import React, { useState } from "react";
import loginLogo from "../assets/logo.png";

export default function Login({ onLogin }) {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (usuario && password) {
      localStorage.setItem("usuario", usuario);
      localStorage.setItem("token", "fake-token");

      onLogin(usuario); // avisa a App.js que ya inició sesión
    } else {
      alert("Completa los campos");
    }
  };

  return (
    <div className="login-container">

      <img src={loginLogo} alt="Logo Login" className="logo" />

      <h2 className="login-titulo">Coordinación de Pruebas</h2>

      <input
        placeholder="Usuario"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
      />

      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Ingresar</button>

    </div>
  );
}