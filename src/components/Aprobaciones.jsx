import { useEffect, useState } from "react";

const API_URL = "https://erp-unilibre-production.up.railway.app";

export default function Aprobaciones() {
  const [pendientes, setPendientes] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  const cargarPendientes = async () => {
    try {
      const res = await fetch(`${API_URL}/aprobaciones/pendientes`);
      const data = await res.json();

      setPendientes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.log("Error cargando pendientes:", error);
    }
  };

  const decidir = async (id, aprobacion) => {
    let justificacion = null;

    if (aprobacion === "NO APROBADO") {
      justificacion = prompt("Escribe la justificación:");
      if (!justificacion) return;
    }

    const payload = {
      numero_novedad: id,
      aprobacion,
      justificacion_aprobacion: justificacion,
    };

    try {
      setLoadingId(id);

      await fetch(`${API_URL}/aprobaciones/decidir`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      cargarPendientes();
    } catch (error) {
      console.log("Error enviando decisión:", error);
    } finally {
      setLoadingId(null);
    }
  };

  useEffect(() => {
    cargarPendientes();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "15px" }}>Pendientes de aprobación</h2>

      <div className="table-wrapper" style={{ overflowX: "auto" }}>
        <table
          border="1"
          cellPadding="10"
          style={{
            width: "100%",
            borderCollapse: "collapse",
            tableLayout: "auto",
            fontSize: "13px",
            minWidth: "1400px",
          }}
        >
          <thead style={{ background: "#f2f2f2" }}>
            <tr>
              <th>Novedad</th>
              <th>Estado</th>
              <th>Acciones</th>
              <th>Documento</th>
              <th>Nombre</th>
              <th>Convocatoria</th>
              <th>Tipo</th>
              <th>Indicador</th>
              <th>Nivel</th>
              <th>Rol</th>
              <th>Responsable</th>
              <th>Motivo</th>
              <th>Ciudad</th>
              <th>Contacto futuro</th>
              <th>Justificación</th>
              <th>Perfil laboral</th>
              <th>Perfil académico</th>
              <th>Disponibilidad</th>
              <th>Fecha</th>
            </tr>
          </thead>

          <tbody>
            {pendientes.length === 0 ? (
              <tr>
                {/* 🔥 CORREGIDO: ahora sigue teniendo 19 columnas */}
                <td colSpan="19" style={{ textAlign: "center" }}>
                  No hay registros
                </td>
              </tr>
            ) : (
              pendientes.map((item) => (
                <tr key={item.id}>
                  {/* 🔥 Novedad */}
                  <td>{item.id}</td>

                  {/* 🔥 Estado */}
                  <td style={{ textAlign: "center" }}>
                    <span className="status-pill pending">
                      🟡 Pendiente
                    </span>
                  </td>

                  {/* 🔥 Acciones */}
                  <td style={{ textAlign: "center" }}>
                    <div style={{ display: "flex", gap: "6px", justifyContent: "center" }}>
                      <button
                        disabled={loadingId === item.id}
                        onClick={() => decidir(item.id, "APROBADO")}
                      >
                        {loadingId === item.id ? "..." : "Aprobar"}
                      </button>

                      <button
                        disabled={loadingId === item.id}
                        onClick={() => decidir(item.id, "NO APROBADO")}
                      >
                        Rechazar
                      </button>
                    </div>
                  </td>

                  {/* 🔥 Documento */}
                  <td>{item.documento_experto}</td>

                  <td>{item.nombre}</td>
                  <td>{item.convocatoria}</td>
                  <td>{item.tipo_novedad}</td>
                  <td>{item.eje}</td>
                  <td>{item.nivel}</td>
                  <td>{item.rol}</td>
                  <td>{item.responsable}</td>
                  <td>{item.motivo_retiro}</td>
                  <td>{item.ciudad_domicilio}</td>
                  <td>{item.contactar_futuro}</td>
                  <td>{item.justificacion}</td>
                  <td>{item.perfil_laboral}</td>
                  <td>{item.perfil_academico}</td>
                  <td>{item.disponibilidad_tiempo}</td>
                  <td>{item.fecha_creacion}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}