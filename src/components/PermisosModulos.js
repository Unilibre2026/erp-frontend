import React, { useEffect, useState } from "react";

export default function PermisosModulos() {

  const [file, setFile] = useState(null);

  const [permisos, setPermisos] = useState([]);

  useEffect(() => {
    cargarPermisos();
  }, []);

  const cargarPermisos = async () => {

    try {

      const res = await fetch(
        "https://erp-unilibre-production.up.railway.app/permisos_modulos"
      );

      const data = await res.json();

      setPermisos(data);

    } catch (error) {

      console.error(error);
    }
  };

  const subirExcel = async () => {

    if (!file) {

      alert("Selecciona un archivo");
      return;
    }

    const formData = new FormData();

    formData.append("file", file);

    try {

      const res = await fetch(
        "https://erp-unilibre-production.up.railway.app/permisos_modulos/cargar",
        {
          method: "POST",
          body: formData
        }
      );

      const data = await res.json();

      alert(JSON.stringify(data));

      cargarPermisos();

    } catch (error) {

      console.error(error);

      alert("Error cargando archivo");
    }
  };

  return (

    <div style={{ padding: "20px" }}>

      <h2>Permisos módulos</h2>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
      />

      <br /><br />

      <button onClick={subirExcel}>
        Subir Excel
      </button>

      <hr style={{ margin: "30px 0" }} />

      <table
        border="1"
        cellPadding="10"
        style={{
          borderCollapse: "collapse",
          width: "100%"
        }}
      >

        <thead>

          <tr>
            <th>ID</th>
            <th>Usuario</th>
            <th>Módulo</th>
          </tr>

        </thead>

        <tbody>

          {permisos.map((p) => (

            <tr key={p.id}>

              <td>{p.id}</td>
              <td>{p.usuario}</td>
              <td>{p.modulo}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}