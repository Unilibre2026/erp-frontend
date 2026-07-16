import { useEffect, useState } from "react";
import { FileUser, User } from "lucide-react";


const API_URL = "https://erp-unilibre-production.up.railway.app";

export default function Aprobaciones() {
  const [pendientes, setPendientes] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [expertoSeleccionado, setExpertoSeleccionado] = useState(null);

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
              <th>Resumen perfil</th>
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
                   <button
                    className="btn-hoja-vida"
                    title="Ver hoja de vida"
                    onClick={() => {
                      console.log(item);
                      setExpertoSeleccionado(item);
                    }}
                   >
                    <FileUser strokeWidth={2} />
                   </button>
                  </td>

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
                  <td>{item.observaciones}</td>
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
                  <td>{item.validador}</td>
                  <td>{item.fecha_creacion}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {expertoSeleccionado && (
        <div
          className="modal-overlay"
          onClick={() => setExpertoSeleccionado(null)}
        >
          <div
            className="modal-hoja-vida"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >          
                 <User size={28} color="#ffffff" />
                  .
               </h2>
                <small
                  style={{
                  fontSize: "16px",      // Cambia el tamaño
                  fontWeight: "600",     // Opcional: seminegrita
                  color: "#ffffff"       // Si quieres cambiar el color
                  }}
                >
                 Resumen Ejecutivo del Perfil
                </small>
              </div>

              <button
                className="btn-cerrar-modal"
                onClick={() => setExpertoSeleccionado(null)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">

  <div className="perfil-header">

    <div className="perfil-avatar">
     <User
       size={48}
       color="#ffffff"
       strokeWidth={2.2}
      />
    </div>

    <div className="perfil-info">
      <h2>{expertoSeleccionado.nombre}</h2>

      <p>
        <strong>Documento:</strong> {expertoSeleccionado.documento_experto}
      </p>

      <p>
        <strong>Convocatoria:</strong> {expertoSeleccionado.convocatoria}
      </p>

    </div>

  </div>


  <div className="perfil-grid">

    <div className="card-perfil">
      <h3>Información General</h3>

      <p><strong>Tipo de novedad:</strong> {expertoSeleccionado.tipo_novedad}</p>

      <p><strong>Indicador:</strong> {expertoSeleccionado.eje}</p>

      <p><strong>Nivel:</strong> {expertoSeleccionado.nivel}</p>

      <p><strong>Rol:</strong> {expertoSeleccionado.rol}</p>

      <p><strong>Responsable:</strong> {expertoSeleccionado.responsable}</p>

      <p><strong>Ciudad:</strong> {expertoSeleccionado.observaciones}</p>

      <p><strong>Disponibilidad:</strong> {expertoSeleccionado.validador}</p>

      <p><strong>Contacto futuro:</strong> {expertoSeleccionado.contactar_futuro}</p>

      <p><strong>Fecha:</strong> {expertoSeleccionado.fecha_creacion}</p>

    </div>


    <div className="card-perfil">

      <h3>Justificación</h3>

      <div className="texto-card">
       {expertoSeleccionado.justificacion}
    </div>

    </div>


    <div className="card-perfil card-alta">
      <h3>Perfil Laboral</h3>

      <div className="texto-card">
       {expertoSeleccionado.perfil_laboral}
  </div>


    </div>


    <div className="card-perfil card-alta">
     <h3>Perfil Académico</h3>

     <div className="texto-card">
      {expertoSeleccionado.perfil_academico}
  </div>
</div>

    


    <div className="card-perfil">

      <h3>Motivo del retiro</h3>

      <div className="texto-card">
       {expertoSeleccionado.motivo_retiro}
    </div>

    </div>

  </div>

</div>

          </div>
        </div>
      )}

    </div>
  );
}