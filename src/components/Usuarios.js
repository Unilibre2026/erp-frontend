
import React, { useState } from "react";

export default function Usuarios() {
  const [form, setForm] = useState({
    usuario: "",
    password: "",
    rol: ""
  });

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
      alert(data.mensaje || "Usuario creado");

      setForm({
        usuario: "",
        password: "",
        rol: ""
      });

    } catch (error) {
      console.error(error);
      alert("Error creando usuario");
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
        name="rol"
        placeholder="Rol (admin/user)"
        value={form.rol}
        onChange={handleChange}
      />

      <br /><br />

      <button onClick={guardarUsuario}>
        Guardar usuario
      </button>
    </div>
  );
}