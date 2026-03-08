interface ResultsSummaryProps {
  currentA: number;
  requiredBaseAmpacityA: number;
  recommendedSize: number | string;
  deratedAmpacityA: number;
  voltageDropPct: number;
  maxVoltageDropPct: number;
  lossKw: number;
  annualLossKwh: number;
}

function StatusBadge({ ok }: { ok: boolean }) {
  return <span className={`status ${ok ? 'ok' : 'fail'}`}>{ok ? 'PASS' : 'FAIL'}</span>;
}

export function ResultsSummary(props: ResultsSummaryProps) {
  const {
    currentA,
    requiredBaseAmpacityA,
    recommendedSize,
    deratedAmpacityA,
    voltageDropPct,
    maxVoltageDropPct,
    lossKw,
    annualLossKwh,
  } = props;

  return (
    <section className="panel sticky-panel">
      <div className="panel-header">
        <div>
          <h2>Results summary</h2>
          <p>Recommended size, checks, and estimated losses.</p>
        </div>
      </div>
      <div className="result-grid">
        <div className="result-card">
          <div className="result-label">Load current</div>
          <div className="result-value">{currentA.toFixed(2)} A</div>
        </div>
        <div className="result-card">
          <div className="result-label">Required base ampacity</div>
          <div className="result-value">{requiredBaseAmpacityA.toFixed(2)} A</div>
        </div>
        <div className="result-card accent">
          <div className="result-label">Recommended cable</div>
          <div className="result-value">{recommendedSize} mm²</div>
        </div>
        <div className="check-row">
          <div>
            <div className="result-label">Current capacity check</div>
            <div className="check-value">{deratedAmpacityA.toFixed(2)} A available</div>
          </div>
          <StatusBadge ok={deratedAmpacityA >= currentA} />
        </div>
        <div className="check-row">
          <div>
            <div className="result-label">Voltage drop check</div>
            <div className="check-value">{voltageDropPct.toFixed(2)}% vs limit {maxVoltageDropPct.toFixed(2)}%</div>
          </div>
          <StatusBadge ok={voltageDropPct <= maxVoltageDropPct} />
        </div>
        <div className="result-card">
          <div className="result-label">Cable loss</div>
          <div className="result-value">{lossKw.toFixed(3)} kW</div>
          <div className="helper">Annualised at 60% load factor: {annualLossKwh.toFixed(0)} kWh</div>
        </div>
      </div>
    </section>
  );
}
