import { useEffect, useState } from "react";

const API_URL = "https://erp-unilibre-production.up.railway.app";

export default function Aprobaciones() {

  const [pendientes, setPendientes] = useState([]);

  const cargarPendientes = async () => {
    try {
      const res = await fetch(`${API_URL}/aprobaciones/pendientes`);
      const data = await res.json();
      setPendientes(data);
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
      aprobacion: aprobacion,
      justificacion_aprobacion: justificacion
    };

    try {
      await fetch(`${API_URL}/aprobaciones/decidir`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      cargarPendientes();

    } catch (error) {
      console.log("Error enviando decisión:", error);
    }
  };

  useEffect(() => {
    cargarPendientes();
  }, []);

  return (
    <div>
      <h2>Pendientes de aprobación</h2>

      <table
        border="1"
        cellPadding="19"
        style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}
      >
        <thead className="tabla-aprobaciones-header">
          <tr>
            <th>Novedad</th>
            <th>Documento del experto</th>
            <th>Nombre del experto</th>
            <th>Convocatoria</th>
            <th>Tipo de novedad</th>
            <th>Eje/Indicador</th>
            <th>Nivel</th>
            <th>Rol</th>
            <th>Responsable de la novedad</th>
            <th>Motivo del retiro</th>
            <th>Ciudad domicilio</th>
            <th>Contactar en futuras convocatorias</th>
            <th>Justificación de la asignación</th>
            <th>Perfil laboral</th>
            <th>Perfil académico</th>
            <th>Disponibilidad de tiempo</th>
            <th>Fecha de la novedad</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {pendientes.length === 0 ? (
            <tr>
              <td colSpan="19">No hay registros</td>
            </tr>
          ) : (
            pendientes.map((item) => (
              <tr key={item.id}>

                <td>{item.id}</td>
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

                {/* 🔧 CORREGIDO: antes estaba mal mapeado */}
                <td>{item.disponibilidad_tiempo}</td>

                <td>{item.fecha_creacion}</td>

                <td style={{ fontWeight: "bold", textAlign: "center" }}>
                  🟡 PENDIENTE
                </td>

                <td style={{ textAlign: "center", whiteSpace: "nowrap" }}>
                  <button onClick={() => decidir(item.id, "APROBADO")}>
                    Aprobar
                  </button>

                  <button onClick={() => decidir(item.id, "NO APROBADO")}>
                    No aprobar
                  </button>
                </td>

              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}