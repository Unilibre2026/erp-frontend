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
        headers: {
          "Content-Type": "application/json",
        },
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
      <h2 style={{ marginBottom: "15px" }}>
        Pendientes de aprobación
      </h2>

      <div
        className="table-wrapper"
        style={{ overflowX: "auto" }}
      >
        <table
         className="tabla-aprobaciones"
         border="1"
          cellPadding="10"
      >
          <thead style={{ background: "#f2f2f2" }}>
            <tr>
              <th className="col-novedad">Novedad</th>
              <th className="col-estado">Estado</th>
              <th className="col-acciones">Acciones</th>
              <th className="col-documento">Documento</th>
              <th className="col-nombre">Nombre</th>
              <th className="col-convocatoria">Convocatoria</th>
              <th className="col-tipo">Tipo</th>
              <th className="col-indicador">Indicador</th>
              <th className="col-nivel">Nivel</th>
              <th className="col-rol">Rol</th>
              <th className="col-responsable">Responsable</th>
              <th className="col-motivo">Motivo</th>
              <th className="col-ciudad">Ciudad</th>
              <th className="col-contacto">Contacto futuro</th>
              <th className="col-justificacion">Justificación</th>
              <th className="col-perfil-laboral">Perfil laboral</th>
              <th className="col-perfil-academico">Perfil académico</th>
              <th className="col-disponibilidad">Disponibilidad</th>
              <th className="col-fecha">Fecha</th>
            </tr>
          </thead>

          <tbody>
            {pendientes.length === 0 ? (
              <tr>
                <td
                  colSpan="19"
                  style={{ textAlign: "center" }}
                >
                  No hay registros
                </td>
              </tr>
            ) : (
              pendientes.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>

                  <td style={{ textAlign: "center" }}>
                    <span className="status-pill pending">
                      🟡 Pendiente
                    </span>
                  </td>

                  <td style={{ textAlign: "center" }}>
                    <div
                      style={{
                        display: "flex",
                        gap: "6px",
                        justifyContent: "center",
                        flexWrap: "wrap",
                      }}
                    >
                      <button
                        className="btn-aprobar"
                        disabled={loadingId === item.id}
                        onClick={() =>
                          decidir(item.id, "APROBADO")
                        }
                      >
                        {loadingId === item.id
                          ? "..."
                          : "Aprobado"}
                      </button>

                      <button
                        className="btn-rechazar"
                        disabled={loadingId === item.id}
                        onClick={() =>
                          decidir(
                            item.id,
                            "NO APROBADO"
                          )
                        }
                      >
                        No aprobado
                      </button>
                    </div>
                  </td>

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
                  <td>
                   <div className="scroll-aprobaciones">
                    {item.justificacion}
                   </div>
                  </td>

                  <td>
                   <div className="scroll-aprobaciones">
                    {item.perfil_laboral}
                   </div>
                  </td>

                  <td>
                   <div className="scroll-aprobaciones">
                    {item.perfil_academico}
                   </div>
                  </td>
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