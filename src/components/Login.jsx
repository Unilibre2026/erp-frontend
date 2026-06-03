import React, { useState } from "react";
import loginLogo from "../assets/logo.png";

const API_URL = "https://erp-unilibre-production.up.railway.app";

export default function Login({ onLogin }) {
  const [usuario, setUsuario] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!usuario || !password) {
      alert("Completa los campos");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          usuario,
          password
        })
      });

      const data = await res.json();

      if (!data.success) {
      alert(data.mensaje || "Usuario o contraseña incorrectos");
     return;
}

      // Guardamos usuario
      localStorage.setItem(
        "usuario",
        data.usuario || usuario
      );

      // Guardamos token
      localStorage.setItem(
        "token",
        data.token
      );

      // Guardamos módulos permitidos
      localStorage.setItem(
        "modulos",
        JSON.stringify(data.modulos || [])
      );

      onLogin(data.usuario || usuario);

    } catch (error) {
      console.error(error);
      alert("Error conectando con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">

      <img
        src={loginLogo}
        alt="Logo Login"
        className="logo"
      />

      <h2 className="login-titulo">
        Coordinación de Pruebas
      </h2>

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

      <button
        onClick={handleLogin}
        disabled={loading}
      >
        {loading ? "Ingresando..." : "Ingresar"}
      </button>

    </div>
  );
}