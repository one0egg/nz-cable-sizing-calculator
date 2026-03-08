interface ManufacturerImportPanelProps {
  csvText: string;
  setCsvText: (value: string) => void;
}

export function ManufacturerImportPanel({ csvText, setCsvText }: ManufacturerImportPanelProps) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2>Manufacturer data</h2>
          <p>Paste CSV rows in the format: size_mm2, ampacity_A, mV_per_A_m, outer_diameter_mm, label</p>
        </div>
      </div>
      <textarea
        className="csv-box"
        value={csvText}
        onChange={(e) => setCsvText(e.target.value)}
        spellCheck={false}
      />
    </section>
  );
}
