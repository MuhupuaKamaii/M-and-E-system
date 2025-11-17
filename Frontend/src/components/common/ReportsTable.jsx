import { HiOutlineArrowTopRightOnSquare } from "react-icons/hi2";

export default function ReportsTable({ reports = [] }) {
  return (
    <div className="npc-card">
      <div className="npc-card__head">
        <div>
          <p className="npc-card__title">Submitted reports</p>
          <p className="npc-card__subtitle">Live queue from all OMAs</p>
        </div>
        <button className="npc-link-button" type="button">
          View all
          <HiOutlineArrowTopRightOnSquare size={16} />
        </button>
      </div>

      <div className="npc-table__wrap">
        <table className="npc-table">
          <thead>
            <tr>
              <th>Programme</th>
              <th>OMA</th>
              <th>Submitted</th>
              <th>Status</th>
              <th>Confidence</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report.id}>
                <td>
                  <p className="npc-table__primary">{report.programme}</p>
                  <p className="npc-table__secondary">{report.pillar}</p>
                </td>
                <td>{report.owner}</td>
                <td>{report.date}</td>
                <td>
                  <span className={`npc-pill npc-pill--${report.statusVariant}`}>
                    {report.status}
                  </span>
                </td>
                <td>{report.confidence}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

