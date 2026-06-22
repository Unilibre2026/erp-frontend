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

      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Convocatoria</th>
            <th>Tipo</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {pendientes.length === 0 ? (
            <tr>
              <td colSpan="5">No hay registros</td>
            </tr>
          ) : (
            pendientes.map((item) => (
              <tr key={item.id}>
                <td>{item.nombre}</td>
                <td>{item.convocatoria}</td>
                <td>{item.tipo_novedad}</td>

                <td style={{ fontWeight: "bold" }}>
                  🟡 PENDIENTE
                </td>

                <td>
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