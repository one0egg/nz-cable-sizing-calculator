interface CandidateRow {
  id: string;
  conductor_mm2: number;
  deratedAmp: number;
  vdPct: number;
  passes: boolean;
}

export function CandidateTable({ rows }: { rows: CandidateRow[] }) {
  return (
    <section className="panel">
      <div className="panel-header">
        <div>
          <h2>Candidate cable schedule</h2>
          <p>Smallest passing cable is selected in standard sizing mode.</p>
        </div>
      </div>
      <div className="table-wrap">
        <table className="candidate-table">
          <thead>
            <tr>
              <th>Cable</th>
              <th>Size</th>
              <th>Derated A</th>
              <th>Vdrop %</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.conductor_mm2}</td>
                <td>{row.deratedAmp.toFixed(1)}</td>
                <td>{row.vdPct.toFixed(2)}</td>
                <td>
                  <span className={`status ${row.passes ? 'ok' : 'fail'}`}>{row.passes ? 'OK' : 'NO'}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
