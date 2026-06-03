
import React, { useEffect, useState } from "react";

export default function Usuarios() {
  const [form, setForm] = useState({
  usuario: "",
  password: "",
  nombre: ""
});

useEffect(() => {
  cargarUsuarios();
}, []);

const cargarUsuarios = async () => {

  try {

    const res = await fetch(
      "https://erp-unilibre-production.up.railway.app/usuarios"
    );

    const data = await res.json();

    setUsuarios(data);

  } catch (error) {

    console.error(error);
  }
};



const [usuarios, setUsuarios] = useState([]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

 const guardarUsuario = async () => {
  try {
    const res = await fetch("https://erp-unilibre-production.up.railway.app/usuarios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(form)
    });

    const data = await res.json();

    console.log("STATUS:", res.status);
    console.log("RESPONSE:", data);

    alert(JSON.stringify(data));

    setForm({
      usuario: "",
      password: "",
      nombre: "",
      area: "",
      rol: ""
    });

    cargarUsuarios();

  } catch (error) {
    console.error("ERROR COMPLETO:", error);
    alert("Error creando usuario");
  }
};

const eliminarUsuario = async (id) => {

  const confirmar = window.confirm(
    "¿Deseas eliminar este usuario?"
  );

  if (!confirmar) return;

  try {

    await fetch(
      `https://erp-unilibre-production.up.railway.app/usuarios/${id}`,
      {
        method: "DELETE"
      }
    );

    cargarUsuarios();

  } catch (error) {

    console.error(error);
    alert("Error eliminando usuario");
  }
};

  return (
    <div style={{ padding: "20px" }}>
      <h2>Crear usuarios</h2>

      <input
        name="usuario"
        placeholder="Usuario"
        value={form.usuario}
        onChange={handleChange}
      />

      <br /><br />

      <input
        name="password"
        type="password"
        placeholder="Contraseña"
        value={form.password}
        onChange={handleChange}
      />

      <br /><br />

      <input
  name="nombre"
  placeholder="Nombre"
  value={form.nombre}
  onChange={handleChange}
/>

      <br /><br />

      <input
        name="area"
        placeholder="Área"
        value={form.area}
        onChange={handleChange}
      />

      <br /><br />

      <input
        name="rol"
        placeholder="Rol"
        value={form.rol}
        onChange={handleChange}
      />

      <br /><br />


      <button onClick={guardarUsuario}>
        Guardar usuario
      </button>

<hr style={{ margin: "30px 0" }} />

<h2>Listado de usuarios</h2>

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
      <th>Nombre</th>
      <th>Área</th>
      <th>Rol</th>
      <th>Acciones</th>
    </tr>
  </thead>

  <tbody>

    {usuarios.map((u) => (

      <tr key={u[0]}>

        <td>{u[0]}</td>
        <td>{u[1]}</td>
        <td>{u[2]}</td>
        <td>{u[3]}</td>
        <td>{u[4]}</td>

        <td>

          <button
            onClick={() => eliminarUsuario(u[0])}
            style={{
              backgroundColor: "red",
              color: "white",
              border: "none",
              padding: "5px 10px",
              cursor: "pointer"
            }}
          >
            Eliminar
          </button>

        </td>

      </tr>

    ))}

  </tbody>

</table>

    </div>
  );
}