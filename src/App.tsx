import { useMemo, useState } from 'react';
import { CableInputs } from '@/components/CableInputs';
import { CandidateTable } from '@/components/CandidateTable';
import { ConduitPanel } from '@/components/ConduitPanel';
import { DeratingPanel } from '@/components/DeratingPanel';
import { ManufacturerImportPanel } from '@/components/ManufacturerImportPanel';
import { ResultsSummary } from '@/components/ResultsSummary';
import lvCables from '@/data/lv-cables.json';
import hvCables from '@/data/hv-cables.json';
import conduitRules from '@/data/conduit-rules.json';
import {
  calcCurrent,
  calcVoltageDropPercent,
  combineDeratingFactors,
  estimateCableLossKw,
  estimateConduit,
  estimateResistanceOhmPerKm,
  getBaseAmp,
  getVd,
  requiredBaseAmpacity,
} from '@/lib/calculations';
import { parseManufacturerCsv } from '@/lib/parsing';
import { standardsNote } from '@/lib/standards';
import type { CableMode, CableRecord, ManufacturerCableRecord, SystemType } from '@/lib/types';

interface NormalisedCable {
  id: string;
  conductor_mm2: number;
  deratedAmp: number;
  vdPct: number;
  passes: boolean;
  outerDiameterMm?: number;
  mvPerAm: number;
}

function normaliseManufacturerRows(rows: ManufacturerCableRecord[]) {
  return rows.map((row) => ({
    id: row.id,
    conductor_mm2: row.conductor_mm2,
    ampacityA: row.ampacityA,
    mvPerAm: row.mvPerAm,
    outerDiameterMm: row.outerDiameterMm,
  }));
}

function EngineeringTab({ mode }: { mode: CableMode }) {
  const [subMode, setSubMode] = useState('standard');
  const [system, setSystem] = useState<SystemType>('3ph');
  const [voltage, setVoltage] = useState(mode === 'LV' ? 400 : 11000);
  const [powerKw, setPowerKw] = useState(mode === 'LV' ? 250 : 4000);
  const [pf, setPf] = useState(0.9);
  const [lengthM, setLengthM] = useState(120);
  const [maxVd, setMaxVd] = useState(mode === 'LV' ? 5 : 3);
  const [installationMethod, setInstallationMethod] = useState(mode === 'LV' ? 'enclosed_conduit' : 'trefoil_buried');
  const [selectedSize, setSelectedSize] = useState(mode === 'LV' ? 95 : 185);
  const [factorA, setFactorA] = useState(mode === 'LV' ? 0.94 : 0.96);
  const [factorB, setFactorB] = useState(mode === 'LV' ? 0.8 : 1.0);
  const [factorC, setFactorC] = useState(mode === 'LV' ? 1.0 : 0.95);
  const [quantity, setQuantity] = useState(mode === 'LV' ? 1 : 3);
  const [csvText, setCsvText] = useState(
    mode === 'LV'
      ? '35,125,1.25,24,LV 35mm²\n70,192,0.68,30,LV 70mm²\n120,269,0.40,36,LV 120mm²'
      : '70,225,0.75,27,HV 70mm²\n120,300,0.49,33,HV 120mm²\n185,380,0.34,38,HV 185mm²'
  );

  const dataset = (mode === 'LV' ? lvCables : hvCables) as CableRecord[];
  const manufacturerRows = useMemo(() => normaliseManufacturerRows(parseManufacturerCsv(csvText)), [csvText]);

  const currentA = useMemo(() => calcCurrent(system, voltage, powerKw, pf), [system, voltage, powerKw, pf]);
  const totalFactor = useMemo(() => combineDeratingFactors([factorA, factorB, factorC]), [factorA, factorB, factorC]);
  const requiredBaseA = useMemo(() => requiredBaseAmpacity(currentA, totalFactor), [currentA, totalFactor]);

  const candidates = useMemo<NormalisedCable[]>(() => {
    if (subMode === 'manufacturer') {
      return manufacturerRows
        .map((row: ReturnType<typeof normaliseManufacturerRows>[number]) => {
          const deratedAmp = row.ampacityA * totalFactor;
          const vdPct = calcVoltageDropPercent({
            currentA,
            mvPerAm: row.mvPerAm,
            lengthM,
            voltageV: voltage,
          });
          return {
            id: row.id,
            conductor_mm2: row.conductor_mm2,
            deratedAmp,
            vdPct,
            passes: deratedAmp >= currentA && vdPct <= maxVd,
            outerDiameterMm: row.outerDiameterMm,
            mvPerAm: row.mvPerAm,
          };
        })
        .sort((a: NormalisedCable, b: NormalisedCable) => a.conductor_mm2 - b.conductor_mm2);
    }

    return dataset
      .map((entry: CableRecord) => {
        const baseAmp = getBaseAmp(entry, installationMethod);
        const mvPerAm = getVd(entry, system);
        const deratedAmp = baseAmp * totalFactor;
        const vdPct = calcVoltageDropPercent({
          currentA,
          mvPerAm,
          lengthM,
          voltageV: voltage,
        });
        return {
          id: entry.id,
          conductor_mm2: entry.conductor_mm2,
          deratedAmp,
          vdPct,
          passes: deratedAmp >= currentA && vdPct <= maxVd,
          outerDiameterMm: entry.outerDiameterMm,
          mvPerAm,
        };
      })
      .sort((a: NormalisedCable, b: NormalisedCable) => a.conductor_mm2 - b.conductor_mm2);
  }, [subMode, manufacturerRows, totalFactor, currentA, lengthM, voltage, maxVd, dataset, installationMethod, system]);

  const standardRecommended = candidates.find((row: NormalisedCable) => row.passes) ?? candidates[candidates.length - 1];
  const selectedRecommended = candidates.find((row: NormalisedCable) => row.conductor_mm2 === selectedSize) ?? standardRecommended;
  const active = subMode === 'check' ? selectedRecommended : standardRecommended;

  const cableOd = active?.outerDiameterMm ?? 0;
  const conduit = estimateConduit(cableOd, quantity, conduitRules);
  const resistanceOhmPerKm = estimateResistanceOhmPerKm(active?.mvPerAm ?? 0, system, pf);
  const lossKw = estimateCableLossKw({ currentA, resistanceOhmPerKm, lengthM, system });
  const annualLossKwh = lossKw * 24 * 365 * 0.6;

  return (
    <div className="workspace-grid">
      <div className="left-column">
        <CableInputs
          mode={mode}
          subMode={subMode}
          setSubMode={setSubMode}
          system={system}
          setSystem={setSystem}
          voltage={voltage}
          setVoltage={setVoltage}
          powerKw={powerKw}
          setPowerKw={setPowerKw}
          pf={pf}
          setPf={setPf}
          lengthM={lengthM}
          setLengthM={setLengthM}
          maxVd={maxVd}
          setMaxVd={setMaxVd}
          installationMethod={installationMethod}
          setInstallationMethod={setInstallationMethod}
          selectedSize={selectedSize}
          setSelectedSize={setSelectedSize}
        />

        <DeratingPanel
          factorA={factorA}
          setFactorA={setFactorA}
          labelA={mode === 'LV' ? 'Temperature factor' : 'Soil temperature factor'}
          factorB={factorB}
          setFactorB={setFactorB}
          labelB={mode === 'LV' ? 'Grouping factor' : 'Soil resistivity factor'}
          factorC={factorC}
          setFactorC={setFactorC}
          labelC={mode === 'LV' ? 'Installation factor' : 'Formation factor'}
          totalFactor={totalFactor}
        />

        {subMode === 'manufacturer' && <ManufacturerImportPanel csvText={csvText} setCsvText={setCsvText} />}

        <ConduitPanel
          quantity={quantity}
          setQuantity={setQuantity}
          cableOdMm={cableOd}
          setCableOdMm={() => {
            // intentionally read-only from selected cable result in this starter build
          }}
          conduitResult={conduit ? `${conduit.conduit_mm} mm` : 'No match'}
        />

        <CandidateTable rows={candidates} />
      </div>

      <div className="right-column">
        <ResultsSummary
          currentA={currentA}
          requiredBaseAmpacityA={requiredBaseA}
          recommendedSize={active?.conductor_mm2 ?? '—'}
          deratedAmpacityA={active?.deratedAmp ?? 0}
          voltageDropPct={active?.vdPct ?? 0}
          maxVoltageDropPct={maxVd}
          lossKw={lossKw}
          annualLossKwh={annualLossKwh}
        />

        <section className="panel">
          <div className="panel-header">
            <div>
              <h2>Standards and assumptions</h2>
              <p>This starter app is structured for NZ projects.</p>
            </div>
          </div>
          <ul className="note-list">
            {standardsNote.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

export default function App() {
  const [mode, setMode] = useState<CableMode>('LV');

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <div className="hero-badges">
            <span className="pill">Engineering tool</span>
            <span className="pill">GitHub Pages ready</span>
            <span className="pill">LV + HV</span>
          </div>
          <h1>NZ Cable Sizing Calculator</h1>
          <p>
            Separate LV and HV workflows, standard library sizing, selected-size checks, manufacturer data mode,
            voltage drop, losses, and conduit recommendation.
          </p>
        </div>
      </header>

      <div className="tabs">
        <button className={mode === 'LV' ? 'tab active' : 'tab'} onClick={() => setMode('LV')}>
          LV
        </button>
        <button className={mode === 'HV' ? 'tab active' : 'tab'} onClick={() => setMode('HV')}>
          HV
        </button>
      </div>

      <main>{mode === 'LV' ? <EngineeringTab mode="LV" /> : <EngineeringTab mode="HV" />}</main>
    </div>
  );
}
