import { exportOrderToPDF } from "../utils/exportPdf";

export default function OrderList({
  orders,
  onEdit,
  onDelete,
  filterStatus,
  setFilterStatus,
  search,
  setSearch,
  user,
}) {
  return (
    <div className="card">
      <div className="row spaceBetween">
        <h2 className="h2">Órdenes</h2>

        <div className="row">
          <input
            className="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por cliente / rut / marca / modelo / presupuesto..."
          />

          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="todas">Todas</option>
            <option value="nueva">Nueva</option>
            <option value="en_proceso">En proceso</option>
            <option value="completada">Completada</option>
          </select>
        </div>
      </div>

      <div className="tableWrap mt10">
        <table>
          <thead>
            <tr>
              <th>N° Serie</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>RUT</th>
              <th>Teléfono</th>
              <th>Equipo</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Presupuesto</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td colSpan="10" className="muted">No hay órdenes para mostrar.</td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id}>
                  <td className="muted" style={{ fontWeight: "bold", color: "#193D6D" }}>
                    {o.serialNumber}
                  </td>
                  <td className="muted">{formatDate(o.createdAt)}</td>
                  <td>{o.clientName}</td>
                  <td className="muted">{o.rut || "—"}</td>
                  <td className="muted">{o.phone}</td>
                  <td>{o.equipment}</td>
                  <td className="muted">{o.brand || "—"}</td>
                  <td className="muted">{o.model || "—"}</td>
                  <td className="muted">{formatCLP(o.budget)}</td>
                  <td>
                    <span className="pill">{labelStatus(o.status)}</span>
                  </td>
                  <td>
                    <div className="row">
                      <button onClick={() => onEdit(o)}>Editar</button>
                      <button onClick={async () => await exportOrderToPDF(o, user)}>PDF</button>
                      <button className="danger" onClick={() => onDelete(o.id)}>
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <p className="muted mt10">
        Tip: si escribes el RUT con puntos/guión igual lo encuentra. También puedes buscar por número de serie.
      </p>
    </div>
  );
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function labelStatus(s) {
  if (s === "nueva") return "Nueva";
  if (s === "en_proceso") return "En proceso";
  if (s === "completada") return "Completada";
  return s;
}

function formatCLP(value) {
  if (value === "" || value === null || value === undefined) return "—";
  const n = Number(value);
  if (Number.isNaN(n)) return String(value);

  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(n);
}
