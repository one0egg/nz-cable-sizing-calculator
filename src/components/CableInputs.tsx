import type { CableMode, SystemType } from '@/lib/types';

interface CableInputsProps {
  mode: CableMode;
  subMode: string;
  setSubMode: (value: string) => void;
  system: SystemType;
  setSystem: (value: SystemType) => void;
  voltage: number;
  setVoltage: (value: number) => void;
  powerKw: number;
  setPowerKw: (value: number) => void;
  pf: number;
  setPf: (value: number) => void;
  lengthM: number;
  setLengthM: (value: number) => void;
  maxVd: number;
  setMaxVd: (value: number) => void;
  installationMethod: string;
  setInstallationMethod: (value: string) => void;
  selectedSize: number;
  setSelectedSize: (value: number) => void;
}

export function CableInputs(props: CableInputsProps) {
  const {
    mode,
    subMode,
    setSubMode,
    system,
    setSystem,
    voltage,
    setVoltage,
    powerKw,
    setPowerKw,
    pf,
    setPf,
    lengthM,
    setLengthM,
    maxVd,
    setMaxVd,
    installationMethod,
    setInstallationMethod,
    selectedSize,
    setSelectedSize,
  } = props;

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2>{mode} design inputs</h2>
          <p>{mode === 'LV' ? 'Low-voltage sizing workflow' : 'High-voltage sizing workflow'}</p>
        </div>
      </div>
      <div className="form-grid">
        <label>
          <span>Calculation mode</span>
          <select value={subMode} onChange={(e) => setSubMode(e.target.value)}>
            <option value="standard">Standard library sizing</option>
            <option value="check">Check selected size</option>
            <option value="manufacturer">Manufacturer data mode</option>
          </select>
        </label>
        <label>
          <span>System</span>
          <select value={system} onChange={(e) => setSystem(e.target.value as SystemType)}>
            <option value="1ph">1 phase</option>
            <option value="3ph">3 phase</option>
          </select>
        </label>
        <label>
          <span>Voltage (V)</span>
          <input type="number" value={voltage} onChange={(e) => setVoltage(Number(e.target.value))} />
        </label>
        <label>
          <span>Power (kW)</span>
          <input type="number" value={powerKw} onChange={(e) => setPowerKw(Number(e.target.value))} />
        </label>
        <label>
          <span>Power factor</span>
          <input type="number" step="0.01" value={pf} onChange={(e) => setPf(Number(e.target.value))} />
        </label>
        <label>
          <span>Length (m)</span>
          <input type="number" value={lengthM} onChange={(e) => setLengthM(Number(e.target.value))} />
        </label>
        <label>
          <span>Max voltage drop (%)</span>
          <input type="number" step="0.1" value={maxVd} onChange={(e) => setMaxVd(Number(e.target.value))} />
        </label>
        <label>
          <span>Installation method</span>
          <input value={installationMethod} onChange={(e) => setInstallationMethod(e.target.value)} />
        </label>
        <label>
          <span>Selected cable size (mm²)</span>
          <input type="number" value={selectedSize} onChange={(e) => setSelectedSize(Number(e.target.value))} />
        </label>
      </div>
    </section>
  );
}
