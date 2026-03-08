interface ConduitPanelProps {
  quantity: number;
  setQuantity: (value: number) => void;
  cableOdMm: number;
  setCableOdMm: (value: number) => void;
  conduitResult: string;
}

export function ConduitPanel({ quantity, setQuantity, cableOdMm, setCableOdMm, conduitResult }: ConduitPanelProps) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2>Conduit sizing</h2>
          <p>Approximate fill-ratio workflow. Replace placeholder values with approved Appendix C derived data.</p>
        </div>
      </div>
      <div className="form-grid three-col">
        <label>
          <span>Number of cables</span>
          <input type="number" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
        </label>
        <label>
          <span>Cable outer diameter (mm)</span>
          <input type="number" value={cableOdMm} onChange={(e) => setCableOdMm(Number(e.target.value))} />
        </label>
        <div className="result-card compact">
          <div className="result-label">Recommended conduit</div>
          <div className="result-value">{conduitResult}</div>
        </div>
      </div>
    </section>
  );
}
