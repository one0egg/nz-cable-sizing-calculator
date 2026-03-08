interface DeratingPanelProps {
  factorA: number;
  setFactorA: (value: number) => void;
  labelA: string;
  factorB: number;
  setFactorB: (value: number) => void;
  labelB: string;
  factorC: number;
  setFactorC: (value: number) => void;
  labelC: string;
  totalFactor: number;
}

export function DeratingPanel(props: DeratingPanelProps) {
  const {
    factorA,
    setFactorA,
    labelA,
    factorB,
    setFactorB,
    labelB,
    factorC,
    setFactorC,
    labelC,
    totalFactor,
  } = props;

  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2>Derating factors</h2>
          <p>Use approved project factors for final design.</p>
        </div>
        <div className="kpi-small">Total factor: {totalFactor.toFixed(3)}</div>
      </div>
      <div className="form-grid three-col">
        <label>
          <span>{labelA}</span>
          <input type="number" step="0.01" value={factorA} onChange={(e) => setFactorA(Number(e.target.value))} />
        </label>
        <label>
          <span>{labelB}</span>
          <input type="number" step="0.01" value={factorB} onChange={(e) => setFactorB(Number(e.target.value))} />
        </label>
        <label>
          <span>{labelC}</span>
          <input type="number" step="0.01" value={factorC} onChange={(e) => setFactorC(Number(e.target.value))} />
        </label>
      </div>
    </section>
  );
}
