import React, { useState, useEffect } from "react";

import Login from "./components/Login"; // componente login

import appLogo from "./logo.png"; // logo del sistema (global)


import "./App.css";

import Usuarios from "./components/Usuarios";
import PermisosModulos from "./components/PermisosModulos";

const API_URL = "https://erp-unilibre-production.up.railway.app";






/* =========================
   APP PRINCIPAL
========================= */

function App() {

  const modulosPermitidos = JSON.parse(
  localStorage.getItem("modulos") || "[]"
);

const esAdmin =
  localStorage.getItem("usuario") === "admin";

  const puedeVer = (modulo) => {
    return (
      esAdmin ||
      modulosPermitidos.includes(modulo)
    );
  };

  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      setUsuario(localStorage.getItem("usuario"));
    }
  }, []);

  // =========================
  // AQUÍ VA EL LOGOUT
  // =========================
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    setUsuario(null);
  };

const [vista, setVista] = useState("formulario");
  const [rolForm, setRolForm] = useState({
    convocatoria: "",
    rol: ""
  });

const [roles, setRoles] = useState([]);
  const [vacanteForm, setVacanteForm] = useState({
    convocatoria: "",
    indicador: "",
    nivel: "",
    rol: "",
    num_expertos: ""
  }); 

  
  


const [vacantes, setVacantes] = useState([]);

const cargarVacantes = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("No hay token en localStorage");
      setVacantes([]);
      return;
    }

    const res = await fetch(`${API_URL}/vacantes`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    // 🔴 Si el backend responde 401, lo manejamos aquí
    if (res.status === 401) {
      console.error("No autorizado (401). Token inválido o expirado.");
      setVacantes([]);
      return;
    }

    const data = await res.json();

    console.log("VACANTES:", data);

    const lista = data?.vacantes || data?.data || data || [];

    setVacantes(Array.isArray(lista) ? lista : []);
  } catch (error) {
    console.error("Error cargando vacantes:", error);
    setVacantes([]);
  }
};

  

  const cargarRoles = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/roles`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await res.json();

    console.log("ROLES BACKEND:", data);

    const lista = data.roles || data.data || data || [];

    setRoles(Array.isArray(lista) ? lista : []);
  } catch (error) {
    console.error(error);
    setRoles([]);
  }
};

useEffect(() => {
  cargarRoles();
}, []);

useEffect(() => {
  cargarVacantes();
}, []);

  const handleRolChange = (e) => {
  setRolForm({
    ...rolForm,
    [e.target.name]: e.target.value
  });
};

const guardarVacante = async () => {
  if (
    !vacanteForm.convocatoria ||
    !vacanteForm.indicador ||
    !vacanteForm.nivel ||
    !vacanteForm.rol ||
    !vacanteForm.num_expertos
  ) {
    alert("Completa todos los campos");

    
    return;
  }

  try {

    const token = localStorage.getItem("token");
    const res = await fetch(`${API_URL}/vacantes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(vacanteForm)
    });

    const data = await res.json();
    alert(data.mensaje);

    setVacanteForm({
      convocatoria: "",
      indicador: "",
      nivel: "",
      rol: "",
      num_expertos: ""
    });

    cargarVacantes();

  } catch (error) {
    console.error(error);
    alert("Error guardando vacante");
  }
};

const handleVacanteChange = (e) => {
  setVacanteForm({
    ...vacanteForm,
    [e.target.name]: e.target.value
  });

};

const guardarRol = async () => {
  if (!rolForm.convocatoria || !rolForm.rol) {
    alert("Completa los campos");
    
    return;
  }
 

  try {
    const res = await fetch(`${API_URL}/roles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(rolForm)
    });

    const data = await res.json();
    alert(data.mensaje);

    // limpiar formulario
    setRolForm({
      convocatoria: "",
      rol: ""
    });


    cargarRoles();
  } catch (error) {
    console.error(error);
    alert("Error guardando rol");
  }
};

const eliminarRol = async (id) => {
  try {
    const res = await fetch(`${API_URL}/roles/${id}`, {
      method: "DELETE"
    });

    const data = await res.json();
    alert(data.mensaje);

    cargarRoles(); // recarga tabla
  } catch (error) {
    console.error(error);
    alert("Error eliminando rol");
  }
};

const eliminarVacante = async (id) => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_URL}/vacantes/${id}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await res.json();

    alert(data.mensaje);

    cargarVacantes();

  } catch (error) {
    console.error(error);
  }
};

if (!usuario) {
  return <Login onLogin={setUsuario} />;
}


  return (
    <div className="container">

    

      <div className="sidebar">
        <h2 className="titulo-sidebar">Reclutamiento</h2>

        {puedeVer("formulario") && (
  <button onClick={() => setVista("formulario")}>
    Formulario
  </button>
)}
      

        {puedeVer("consulta") && (
  <button onClick={() => setVista("consulta")}>
    Consultas
  </button>
)}

        
        {puedeVer("carga") && (
  <button onClick={() => setVista("carga")}>
    Carga masiva de expertos
  </button>
)}


        {puedeVer("convocatorias") && (
  <button onClick={() => setVista("convocatorias")}>
    Crear convocatorias
  </button>
)}

{puedeVer("indicadores") && (
  <button onClick={() => setVista("indicadores")}>
    Crear indicadores
  </button>
)}

{puedeVer("roles") && (
  <button onClick={() => setVista("Crear rol")}>
    Crear rol
  </button>
)}

{puedeVer("vacantes") && (
  <button onClick={() => setVista("Autorizar vacantes")}>
    Autorizar vacantes
  </button>
)}

{puedeVer("observaciones_expertos") && (
  <button onClick={() => setVista("Cargar observaciones de expertos")}>
    Cargar observaciones de expertos
  </button>
)}

{puedeVer("perfiles_sugeridos_indicador") && (
  <button onClick={() => setVista("Cargar perfiles sugeridos por indicador")}>
    Cargar perfiles sugeridos por indicador
  </button>
)}
        {puedeVer("usuarios") && (
  <button onClick={() => setVista("usuarios")}>
    Crear usuarios
  </button>
)}

{puedeVer("usuarios") && (
<button onClick={() => setVista("permisos_modulos")}>
  Permisos módulos
</button>

)}

        <button
  onClick={logout}
  style={{ background: "red", color: "white", marginTop: "20px" }}
>
  Cerrar sesión
</button>



        
      </div>

      <div className="content">

        <div className="contenedor-logo">
          <img src={appLogo} alt="Logo" className="logo-superior" />
        </div>

        <>
  {vista === "formulario" && <Formulario />}
  {vista === "consulta" && <Consultas />}
  {vista === "carga" && <CargaMasiva />}
  {vista === "convocatorias" && <Convocatorias />}
  {vista === "indicadores" && <Indicadores />}
  {vista === "usuarios" && <Usuarios />}
  {vista === "permisos_modulos" && <PermisosModulos />}


  {vista === "Cargar observaciones de expertos" && (
    <ObservacionesExpertos />
  )}

  {vista === "Cargar perfiles sugeridos por indicador" && (
    <PerfilesSugeridos />
  )}
</>
        
        
        



{vista === "Crear rol" && (
  <div style={{ padding: "20px" }}>

    <h2>Confirmar roles:</h2>


    <div style={{
      display: "flex",
      gap: "15px",
      alignItems: "flex-end",
      flexWrap: "wrap"
    }}>

      {/* Convocatoria */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label>Convocatoria</label>
        <input
  name="convocatoria"
  value={rolForm.convocatoria}
  onChange={handleRolChange}
  type="text"
  style={{ width: "200px" }}
/>
      </div>

      {/* Rol */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <label>Rol</label>
        <input
  name="rol"
  value={rolForm.rol}
  onChange={handleRolChange}
  type="text"
  style={{ width: "200px" }}
/>
      </div>

      {/* Botón guardar */}
      <div>
        <button onClick={guardarRol} style={{ height: "38px" }}>
  Guardar
</button>
      </div>

    </div>
{/* ================= TABLA ================= */}
    <hr />

    <h3>Roles registrados</h3>

    <table border="1" width="100%">
      <thead>
        <tr>
          <th>ID</th>
          <th>Convocatoria</th>
          <th>Rol</th>
          <th>Acción</th>
        </tr>
      </thead>

      <tbody>
        {roles.map((r) => (
          <tr key={r.id}>
            <td>{r.id}</td>
            <td>{r.convocatoria}</td>
            <td>{r.rol}</td>
            <td>
              <button
                onClick={() => eliminarRol(r.id)}
                style={{ background: "red", color: "white" }}
              >
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

  </div>
)}



       {vista === "Autorizar vacantes" && (
  <div style={{ padding: "20px" }}>
    
    <h2>Autorizar vacantes por rol:</h2>

    <div
  style={{
    display: "flex",
    gap: "15px",
    alignItems: "flex-start",
    flexWrap: "wrap"
  }}

  

  
>
  
  {/* Convocatoria */}
  <div style={{ display: "flex", flexDirection: "column" }}>
    <label>Convocatoria</label>
    <input
      name="convocatoria"
      value={vacanteForm.convocatoria}
      onChange={handleVacanteChange}
      type="text"
      style={{ width: "160px" }}
    />
  </div>

  {/* Indicador */}
  <div style={{ display: "flex", flexDirection: "column" }}>
    <label>Indicador</label>
    <input
      name="indicador"
      value={vacanteForm.indicador}
      onChange={handleVacanteChange}
      type="text"
      style={{ width: "160px" }}
    />
  </div>

  {/* Nivel */}
  <div style={{ display: "flex", flexDirection: "column" }}>
    <label>Nivel</label>
    <input
      name="nivel"
      value={vacanteForm.nivel}
      onChange={handleVacanteChange}
      type="text"
      style={{ width: "140px" }}
    />
  </div>

  {/* Rol */}
  <div style={{ display: "flex", flexDirection: "column" }}>
    <label>Rol</label>
    <input
      name="rol"
      value={vacanteForm.rol}
      onChange={handleVacanteChange}
      type="text"
      style={{ width: "140px" }}
    />
  </div>

  {/* N° expertos */}
  <div style={{ display: "flex", flexDirection: "column" }}>
    <label>N° expertos</label>
    <input
      name="num_expertos"
      value={vacanteForm.num_expertos}
      onChange={handleVacanteChange}
      type="number"
      style={{ width: "160px" }}
    />
  </div>

  {/* Boton guardar vacante */}

  <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
  <button onClick={guardarVacante} style={{ height: "38px" }}>
    Guardar
  </button>
</div>

        </div>

    <hr />

    <h3>Vacantes registradas</h3>

    <table border="1" width="100%">
      <thead>
        <tr>
          <th>ID</th>
          <th>Convocatoria</th>
          <th>Indicador</th>
          <th>Nivel</th>
          <th>Rol</th>
          <th>N° Expertos</th>
          <th>Acción</th>
        </tr>
      </thead>

      <tbody>
        {vacantes.map((v) => (
          <tr key={v.id}>
            <td>{v.id}</td>
            <td>{v.convocatoria}</td>
            <td>{v.indicador}</td>
            <td>{v.nivel}</td>
            <td>{v.rol}</td>
            <td>{v.num_expertos}</td>
            <td>
  <button
    onClick={() => eliminarVacante(v.id)}
    style={{ background: "red", color: "white" }}
  >
    Eliminar
  </button>
</td>
            
          </tr>
        ))}
      </tbody>
    </table>

  </div>

)}

      </div>
      
    </div>
  );
}




function Formulario() {

  const [form, setForm] = useState({
    documento_experto: "",
    nombre_experto: "",
    tipo_novedad: "",
    convocatoria: "",
    indicador: "",
    nivel: "",
    rol: "",
    responsable_reporte_novedad: "",
    justificacion_asignacion: "",
    motivo_retiro: "",
    contactar_futuras_convocatorias: "",
    experiencia_en_entidad: "",
    perfil_laboral: "",
    disponibilidad_tiempo: "",
    perfil_academico: ""
  });

  const [loadingBusqueda, setLoadingBusqueda] = useState(false);
  const [estadoExperto, setEstadoExperto] = useState(null);
  const [convocatorias, setConvocatorias] = useState([]);
  const [indicadores, setIndicadores] = useState([]);
  const [niveles, setNiveles] = useState([]);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
  cargarConvocatorias();
}, []);
useEffect(() => {
  if (form.convocatoria) {
    fetch(`${API_URL}/roles/por-convocatoria/${form.convocatoria}`)
      .then(res => res.json())
      .then(data => setRoles(data));
  } else {
    setRoles([]);
  }
}, [form.convocatoria]);

  const cargarConvocatorias = async () => {

  try {

    const res = await fetch(`${API_URL}/convocatorias`
    );

    const data = await res.json();

    const unicas = [
      ...new Set(
        data.map(i => i.nombre_convocatoria)
      )
    ];

    setConvocatorias(unicas);

  } catch (error) {

    console.error(error);

  }
};

  const handleChange = async (e) => {

  const { name, value } = e.target;

  setForm((prev) => ({
    ...prev,
    [name]: value
  }));

  // =========================
  // LIMPIAR MENSAJE DOCUMENTO
  // =========================

  if (name === "documento_experto") {
    setEstadoExperto(null);
  }

  // =========================
  // CARGAR INDICADORES
  // =========================

  if (name === "convocatoria") {

  try {

    const res = await fetch(
      `${API_URL}/indicadores_por_convocatoria/${value}`
    );

    const data = await res.json();

    setIndicadores(
      Array.isArray(data)
        ? data
        : data.indicadores || []
    );

    const resRoles = await fetch(`${API_URL}/roles/por-convocatoria/${value}`)

    const dataRoles = await resRoles.json();

    setRoles(
      Array.isArray(dataRoles)
        ? dataRoles
        : dataRoles.roles || []
    );

  } catch (error) {

    console.error(error);

  }
}

  // =========================
  // CARGAR NIVELES
  // =========================

  if (name === "indicador") {

    try {

      const res = await fetch(
        `${API_URL}/niveles/${form.convocatoria}/${value}`
      );

      const data = await res.json();

      setNiveles(
        Array.isArray(data)
          ? data
          : data.niveles || []
      );

    } catch (error) {

      console.error(error);

    }
  }


if (name === "nivel") {

  try {

    const res = await fetch(
      `${API_URL}/validar-asignacion?documento=${form.documento_experto}&convocatoria=${encodeURIComponent(form.convocatoria)}&indicador=${encodeURIComponent(form.indicador)}&nivel=${encodeURIComponent(value)}`
    );

    const data = await res.json();

    if (data.existe) {
      alert(
        "⚠️ Este experto ya se encuentra asignado a esta convocatoria, indicador y nivel."
      );
    }

  } catch (error) {
    console.error(error);
  }

 }

};


  const buscarExperto = async () => {
    const documento = form.documento_experto;
    if (!documento) return;

    setLoadingBusqueda(true);
    setEstadoExperto(null);

    try {
      const res = await fetch(`${API_URL}/experto/${documento}`);

      if (!res.ok) {
        setEstadoExperto(false);
        setForm((prev) => ({ ...prev, nombre_experto: "" }));
        return;
      }


      

      const data = await res.json();

      const nombre =
        data?.nombre_completo ||
        data?.nombre ||
        data?.nombre_experto ||
        null;

      if (!nombre) {
        setEstadoExperto(false);
        setForm((prev) => ({ ...prev, nombre_experto: "" }));
        return;
      }

      setForm((prev) => ({
        ...prev,
        nombre_experto: nombre
      }));

      setEstadoExperto(true);

    } catch (error) {
      setEstadoExperto(false);
    } finally {
      setLoadingBusqueda(false);
    }
  };

  const guardar = async () => {

    if (!form.documento_experto || !form.nombre_experto) {
      alert("Debe buscar un experto válido antes de guardar");
      return;
    }

  // =========================
  // VALIDAR ASIGNACIÓN DUPLICADA
  // =========================

if (form.tipo_novedad === "Ingreso") {

  try {

    const validar = await fetch(
      `${API_URL}/validar-asignacion?documento=${form.documento_experto}&convocatoria=${encodeURIComponent(form.convocatoria)}&indicador=${encodeURIComponent(form.indicador)}&nivel=${encodeURIComponent(form.nivel)}`
    );

    const resultado = await validar.json();

    if (resultado.existe) {
      alert(
        "Este experto ya se encuentra asignado a esta convocatoria, indicador y nivel."
      );
      return;
    }

  } catch (error) {
    console.error("Error validando asignación:", error);
    alert("No fue posible validar la asignación.");
    return;
  }

}


    try {
      const res = await fetch(`${API_URL}/novedades`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.detail || "Error");

      alert(data.mensaje || "Guardado correctamente");

      setForm({
        documento_experto: "",
        nombre_experto: "",
        tipo_novedad: "",
        convocatoria: "",
        indicador: "",
        nivel: "",
        rol: "",
        responsable_reporte_novedad: "",
        justificacion_asignacion: "",
        motivo_retiro: "",
        contactar_futuras_convocatorias: "",
        experiencia_en_entidad: "",
        perfil_laboral: "",
        disponibilidad_tiempo: "",
        perfil_academico: ""
      });

      setEstadoExperto(null);

    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <h2>Registro de Novedad</h2>

      <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>

  <div style={{ display: "flex", flexDirection: "column" }}>

    <label>Documento del experto</label>

    <input
      className="campo-documento"
      name="documento_experto"
      
      value={form.documento_experto}
      onChange={handleChange}
      onBlur={buscarExperto}
      style={{ width: "180px" }}
    />

    {loadingBusqueda && <p>Buscando...</p>}

    {estadoExperto === true && (
      <p style={{ color: "green", margin: 0 }}>
        
      </p>
    )}

    {estadoExperto === false && form.documento_experto && (
  <p style={{ color: "red", margin: 0 }}>
    Documento no encontrado
  </p>
)}

  </div>

  

  <div style={{ display: "flex", flexDirection: "column" }}>


  <label>Nombre del experto</label>

  <input
  name="nombre_experto"
  value={estadoExperto === true ? form.nombre_experto : ""}
  readOnly
  disabled
  style={{
    width: "250px",
    height: "22px",
    padding: "2px 8px",
    backgroundColor: "#f0f0f0",
    color: "#666",
    border: "1px solid #ccc"
  }}
/>

</div>

</div>



<div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>

  <div style={{ display: "flex", flexDirection: "column" }}>

  <label
    style={{
      fontSize: "14px",
      fontWeight: "normal",
      marginBottom: "4px"
    }}
  >
    Convocatoria
  </label>

  <select
  name="convocatoria"
  value={form.convocatoria}
  onChange={handleChange}
  style={{ width: "280px", height: "35px" }}
>

  <option value="">
    Seleccione convocatoria
  </option>

  {convocatorias.map((c, idx) => (
    <option key={idx} value={c}>
      {c}
    </option>
  ))}

</select>

</div>

<div style={{ display: "flex", flexDirection: "column" }}>
  <label
    style={{
      fontSize: "14px",
      fontWeight: "normal",
      marginBottom: "4px"
    }}
  >
    Tipo de novedad
  </label>

  <select
   name="tipo_novedad"
   value={form.tipo_novedad}
   onChange={handleChange}
   style={{ width: "180px", height: "34px" }}
  >
    <option value="">Seleccione...</option>
    <option value="Ingreso">Ingreso</option>
    <option value="Cambio de rol">Cambio de rol</option>
    <option value="Retiro parcial">Retiro parcial</option>
    <option value="Retiro DEFINITIVO">Retiro DEFINITIVO</option>
  </select>
</div>


  <div style={{ display: "flex", flexDirection: "column" }}>
    <label
    style={{
      fontSize: "14px",
      fontWeight: "normal",
      marginBottom: "4px"
    }}
  >
    Motivo del retiro
  </label>

    <select
    name="motivo_retiro"
    onChange={handleChange}
    style={{ width: "200px", height: "34px" }}
  >
    <option value="">Seleccione...</option>
    <option value="Conocimientos insuficientes">Conocimientos insuficientes</option>
    <option value="Disponibilidad de tiempo">Disponibilidad de tiempo</option>
    <option value="Estado de salud">Estado de salud</option>
    <option value="Honorarios">Honorarios</option>
    <option value="Motivos personales">Motivos personales</option>
    <option value="No cunple con el perfil">No cumple con el perfil</option>
    <option value="No se logró contactar">No se logró contactar</option>
    <option value="Otro">Otro</option>
  </select>
</div>

  <div style={{ display: "flex", flexDirection: "column" }}>
    <label
    style={{
      fontSize: "14px",
      fontWeight: "normal",
      marginBottom: "4px"
    }}
  >
    Contactar en futuras convocatorias?
  </label>

    <select
    name="contactar_futuras_convocatorias"
    onChange={handleChange}
    style={{ width: "200px", height: "34px" }}
  >
    <option value="">Seleccione...</option>
    <option value="SI">SI</option>
    <option value="NO">NO</option>
    
  </select>
</div>

  

</div>
<div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>

  {/* INDICADOR */}
  <div style={{ display: "flex", flexDirection: "column" }}>

    <label
      style={{
        fontSize: "14px",
        fontWeight: "normal",
        marginBottom: "4px"
      }}
    >
      Indicador
    </label>

    <select
  name="indicador"
  value={form.indicador}
  onChange={handleChange}
  style={{
    width: "400px",
    height: "38px",
    padding: "5px",
    boxSizing: "border-box"
  }}
>

  <option value="">
    Seleccione indicador
  </option>

  {indicadores.map((i, idx) => (

    <option
      key={idx}
      value={i.indicador}
    >
      {i.indicador}
    </option>

  ))}

</select>

  </div>

  {/* NIVEL */}
  <div style={{ display: "flex", flexDirection: "column" }}>

    <label
      style={{
        fontSize: "14px",
        fontWeight: "normal",
        marginBottom: "4px"
      }}
    >
      Nivel
    </label>

    <select
  name="nivel"
  value={form.nivel}
  onChange={handleChange}
  style={{
    width: "200px",
    height: "38px",
    padding: "5px",
    boxSizing: "border-box"
  }}
>

  <option value="">
    Seleccione nivel
  </option>

  {Array.isArray(niveles) &&
    niveles.map((n, idx) => (

      <option
        key={idx}
        value={n.nivel}
      >
        {n.nivel}
      </option>

    ))}

</select>

  </div>

  {/* ROL */}
  <div style={{ display: "flex", flexDirection: "column" }}>

    <label
      style={{
        fontSize: "14px",
        fontWeight: "normal",
        marginBottom: "4px"
      }}
    >
      Rol
    </label>

    <select
  name="rol"
  value={form.rol}
  onChange={handleChange}
>
  <option value="">
    Seleccione rol
  </option>

  {roles.map((r) => (
    <option key={r.id} value={r.rol}>
      {r.rol}
    </option>
  ))}
</select>

  </div>

  </div>

  <div style={{ display: "flex", flexDirection: "column" }}>
  
  

  <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>

  

  {/* DISPONIBILIDAD */}
  <div style={{ display: "flex", flexDirection: "column" }}>

    <label
      style={{
        fontSize: "14px",
        fontWeight: "normal",
        marginBottom: "4px"
      }}
    >
      Disponibilidad de tiempo
    </label>

    <input
      name="disponibilidad_tiempo"
      onChange={handleChange}
      placeholder="Disponibilidad de tiempo"
      style={{ width: "280px" }}
    />

  </div>

  {/* CIUDAD DE DOMICILIO */}
<div style={{ display: "flex", flexDirection: "column" }}>

  <label
    style={{
      fontSize: "14px",
      fontWeight: "normal",
      marginBottom: "4px"
    }}
  >
    Ciudad de domicilio
  </label>

  <input
    name="experiencia_en_entidad"
    value={form.experiencia_en_entidad}
    onChange={handleChange}
    placeholder="Ciudad de domicilio"
    style={{ width: "220px" }}
  />

</div>



<div style={{ display: "flex", flexDirection: "column" }}>
  
</div>

</div>

  

</div>
<div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>

  {/* JUSTIFICACIÓN */}
  <div style={{ display: "flex", flexDirection: "column" }}>

    <label
      style={{
        fontSize: "14px",
        fontWeight: "normal",
        marginBottom: "4px"
      }}
    >
      Justificación de la asignación
    </label>

    <textarea
      name="justificacion_asignacion"
      onChange={handleChange}
      
      style={{
        width: "600px",
        height: "100px",
        padding: "10px",
        boxSizing: "border-box",
        resize: "vertical"
      }}
    />

  </div>

  {/* PERFIL LABORAL */}
  <div style={{ display: "flex", flexDirection: "column" }}>

    <label
      style={{
        fontSize: "14px",
        fontWeight: "normal",
        marginBottom: "4px"
      }}
    >
      Perfil laboral
    </label>

    <textarea
      name="perfil_laboral"
      onChange={handleChange}
      
      style={{
        width: "600px",
        height: "100px",
        padding: "10px",
        boxSizing: "border-box",
        resize: "vertical"
      }}
    />

  </div>

</div>
<div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>

  {/* PERFIL ACADÉMICO */}
  <div style={{ display: "flex", flexDirection: "column" }}>

    <label
      style={{
        fontSize: "14px",
        fontWeight: "normal",
        marginBottom: "4px"
      }}
    >
      Perfil académico
    </label>

    <textarea
      name="perfil_academico"
      onChange={handleChange}
      
      style={{
        width: "600px",
        height: "100px",
        padding: "10px",
        boxSizing: "border-box",
        resize: "vertical"
      }}
    />

  </div>

</div>

<div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>

  {/* RESPONSABLE */}
  <div style={{ display: "flex", flexDirection: "column" }}>

    <label
      style={{
        fontSize: "14px",
        fontWeight: "normal",
        marginBottom: "4px"
      }}
    >
      Responsable reporte novedad
    </label>

    <input
      name="responsable_reporte_novedad"
      value={localStorage.getItem("usuario") || ""}
      readOnly
     
      style={{
        width: "250px",
        height: "32px",
        padding: "10px",
        boxSizing: "border-box",
        backgroundColor: "#e9ecef",
        color: "#495057",
        border: "1px solid #ced4da"
      }}
    />

  </div>

</div>

     
     

      <button onClick={guardar}>Guardar</button>
    </div>
  );
}

/* =========================
   🔥 NUEVO MÓDULO: CARGA MASIVA
========================= */

function CargaMasiva() {

  const [archivo, setArchivo] = useState(null);
   const [expertos, setExpertos] = useState([]);

   const API_URL = "https://erp-unilibre-production.up.railway.app";

   // =========================
  // OBTENER EXPERTOS
  // =========================
  const obtenerExpertos = async () => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`${API_URL}/expertos`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();

    console.log("STATUS:", res.status);
    console.log("DATA:", data);

    setExpertos(Array.isArray(data) ? data : []);

  } catch (err) {
    console.error("Error cargando expertos", err);
  }
};

  // =========================
  // CARGA AL MONTAR
  // =========================
  useEffect(() => {
    obtenerExpertos();
  }, []);

  // =========================
  // SUBIR EXCEL
  // =========================
  

  const subirExcel = async () => {
    if (!archivo) {
      alert("Selecciona un archivo Excel");
      return;
    }

    const formData = new FormData();
    formData.append("file", archivo);

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`${API_URL}/expertos/cargar`, {
        method: "POST",
        headers: {"Authorization": `Bearer ${token}`},
        body: formData
      });

      const data = await res.json();

      alert(
        `Insertados: ${data.insertados}\nDuplicados: ${data.duplicados}`
      );
      setArchivo(null);

      // refrescar tabla //
      obtenerExpertos();

    } catch (err) {
      alert("Error subiendo archivo");
    }
  };

  // =========================
  // ELIMINAR EXPERTO
  // =========================
  const eliminarExperto = async (id) => {
    const confirmar = window.confirm("¿Seguro que deseas eliminar este experto?");
    if (!confirmar) return;

    const token = localStorage.getItem("token");

    try {
      await fetch(`${API_URL}/expertos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert("Eliminado correctamente");

      obtenerExpertos();

    } catch (err) {
      alert("Error eliminando experto");
    }
  };

  // =========================
  // UI
  // =========================

  return (
    <div>
      <h2>Carga Masiva de Expertos</h2>

      
       {/* SUBIDA EXCEL */}
       <input
        type="file"
        accept=".xlsx"
        onChange={(e) => setArchivo(e.target.files[0])}
      />

      <button onClick={subirExcel}>
        Subir Excel
      </button> 
     {/* TABLA DE EXPERTOS */}
      <h3 style={{ marginTop: "20px" }}>Listado de Expertos</h3>

      <table border="1" width="100%">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {Array.isArray(expertos) &&
            expertos.map((exp) => (
            <tr key={exp.id}>
              <td>{exp.id}</td>
              <td>{exp.nombre}</td>
              <td>{exp.correo}</td>

              <td>
                <button onClick={() => eliminarExperto(exp.id)}>
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



function Convocatorias() {
  const [form, setForm] = useState({
    nombre_convocatoria: "",
    fecha_inicio: "",
    fecha_fin: ""
  });

  const [loading, setLoading] = useState(false);
  const [lista, setLista] = useState([]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });


  };

  const cargarConvocatorias = async () => {
    try {
      const res = await fetch(`${API_URL}/convocatorias`);
      const data = await res.json();
      setLista(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    cargarConvocatorias();
  }, []);

  const guardar = async () => {
    if (!form.nombre_convocatoria || !form.fecha_inicio || !form.fecha_fin) {
      alert("Completa todos los campos");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/convocatorias`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      alert(data.mensaje);

      setForm({
        nombre_convocatoria: "",
        fecha_inicio: "",
        fecha_fin: ""
      });

      cargarConvocatorias();

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ AQUÍ SÍ VA BIEN
  const eliminarConvocatoria = async (id) => {
    try {
      const res = await fetch(`${API_URL}/convocatorias/${id}`, {
        method: "DELETE"
      });

      const data = await res.json();

      alert(data.mensaje);

      cargarConvocatorias();

    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Activar convocatoria</h2>

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <input
          name="nombre_convocatoria"
          placeholder="Nombre de la convocatoria"
          value={form.nombre_convocatoria}
          onChange={handleChange}
          style={{ width: "300px" }}
        />

    </div>

    <div style={{ display: "flex", flexDirection: "column" }}>
      <label>Fecha de inicio</label>
        <input
          type="date"
          name="fecha_inicio"
          value={form.fecha_inicio}
          onChange={handleChange}
          style={{ width: "160px" }}
        />

        </div>

    <div style={{ display: "flex", flexDirection: "column" }}>
      <label>Fecha de finalización</label>

        <input
          type="date"
          name="fecha_fin"
          value={form.fecha_fin}
          onChange={handleChange}
          style={{ width: "160px" }}
        />

        <button
  onClick={guardar}
  disabled={loading}
  style={{ width: "140px", height: "38px" }}
>
  {loading ? "Guardando..." : "Guardar"}
</button>
      </div>

      <hr />

      <h3>Convocatorias registradas</h3>
      <table className="tabla-convocatorias">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Inicio</th>
            <th>Fin</th>
            <th>Acción</th>
          </tr>
        </thead>

        <tbody>
          {lista.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.nombre_convocatoria}</td>
              <td>{c.fecha_inicio}</td>
              <td>{c.fecha_fin}</td>
              <td>
                <button onClick={() => eliminarConvocatoria(c.id)}>
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

/* =========================
   CONSULTAS
========================= */


function Consultas() {

  const [datos, setDatos] = useState([]);
  const [campoBusqueda, setCampoBusqueda] = useState("documento_experto");
  const [textoBusqueda, setTextoBusqueda] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/novedades`)
      .then(r => r.json())
      .then(data => {
        console.table([data[0]]);
        setDatos(data);
      })
      .catch(err => console.error("Error cargando datos:", err));
  }, []);

  const filtrados = datos.filter((item) => {
    if (!textoBusqueda) return true;

    return String(item?.[campoBusqueda] || "")
      .toLowerCase()
      .includes(textoBusqueda.toLowerCase());
  });

  return (
    <div>
      <h2>CONSULTA GENERAL DE NOVEDADES</h2>

      <select onChange={(e) => setCampoBusqueda(e.target.value)}>
        <option value="documento_experto">Documento</option>
        <option value="nombre">Nombre</option>
        <option value="tipo_novedad">Tipo</option>
        <option value="convocatoria">Convocatoria</option>
      </select>

      <input
        placeholder="Buscar..."
        value={textoBusqueda}
        onChange={(e) => setTextoBusqueda(e.target.value)}
      />

      <table border="1">
        <thead>
          <tr>
            <th>N. novedad</th>
            <th>Documento</th>
            <th>Nombre del experto</th>
            <th>Convocatoria</th>
            <th>Tipo de novedad</th>
            <th>Eje/indicador</th>
            <th>Nivel</th>
            <th>Rol</th>
            <th>Responsable de la novedad</th>
            <th>Motivo del retiro</th>
            <th>Ciudad de domicilio</th>
            <th>Contactar en futuras convocaorias</th>
            <th>Justificación de la asignación</th>
            <th>Perfil laboral</th>
            <th>Perfil académico</th>
            <th>Disponibilidad de tiempo</th>
            <th>Fecha de la novedad</th>
          </tr>
        </thead>

        <tbody>
          {filtrados.map((i, idx) => (
            <tr key={idx}>
              <td>{i.id}</td>
              <td>{i.documento_experto}</td>
              <td>{i.nombre}</td>
              <td>{i.convocatoria}</td>
              <td>{i.tipo_novedad}</td>
              <td>{i.eje}</td>
              <td>{i.nivel}</td>
              <td>{i.rol}</td>
              <td>{i.responsable}</td>
              <td>{i.motivo_retiro}</td> 
              <td>
  <div className="scroll-columna-12">
    {i.observaciones}
  </div>
</td>             
              <td>{i.contactar_futuro}</td>
              <td>
        <div className="scroll-columna-12">
          {i.justificacion}
        </div>
      </td>
                 <td>
        <div className="scroll-columna-12">
          {i.perfil_laboral}
        </div>
      </td>
              <td>{i.perfil_academico}</td>
              <td>{i.validador}</td>
              <td>{i.fecha_creacion}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* =========================
   INDICADORES
========================= */

function Indicadores() {

  const [archivo, setArchivo] = useState(null);
  const [datos, setDatos] = useState([]);
  const [convocatoria, setConvocatoria] = useState("");
  const [indicador, setIndicador] = useState("");

  // =========================
  // CARGAR TABLA
  // =========================

  const cargarIndicadores = async () => {

    try {

      const res = await fetch(`${API_URL}/indicadores`);
      const data = await res.json();

      setDatos(data);

    } catch (error) {

      console.error(error);

    }
  };

  // =========================
  // AL ABRIR MÓDULO
  // =========================

  useEffect(() => {
    cargarIndicadores();
    
  }, []);

   const filtrados = datos.filter((i) => {

  const cumpleConvocatoria =
    !convocatoria ||
    i.convocatoria === convocatoria;

  const cumpleIndicador =
    !indicador ||
    i.indicador === indicador;

  return cumpleConvocatoria && cumpleIndicador;

});

  // =========================
  // SUBIR EXCEL
  // =========================

  const subirExcelIndicadores = async () => {

    if (!archivo) {
      alert("Selecciona un archivo Excel");
      return;
    }

    const formData = new FormData();
    formData.append("file", archivo);

    try {

      const res = await fetch(`${API_URL}/indicadores/cargar`, {
        method: "POST",
        body: formData
      });

      const data = await res.json();

      alert(data.mensaje);

      cargarIndicadores();

    } catch (error) {

      console.error(error);
      alert("Error cargando archivo");

    }
  };

  const eliminarIndicador = async (id) => {

  const confirmar = window.confirm(
    "¿Deseas eliminar este indicador?"
  );

  if (!confirmar) return;

  try {

    const res = await fetch(`${API_URL}/indicadores/${id}`, {
  method: "DELETE"
});

    const data = await res.json();

    alert(data.mensaje);

    cargarIndicadores();

  } catch (error) {

    console.error(error);
    alert("Error eliminando indicador");

  }
};

  return (
  <div>

    <h2>Incluir: Ejes/Indicadores</h2>

    <input
      type="file"
      accept=".xlsx"
      onChange={(e) => setArchivo(e.target.files[0])}
    />

    <button onClick={subirExcelIndicadores}>
      Cargar Excel
    </button>

    <hr />

    <select
      value={convocatoria}
      onChange={(e) => setConvocatoria(e.target.value)}
    >

      <option value="">Todas las convocatorias</option>

      {[...new Set(datos.map(i => i.convocatoria))].map((c, idx) => (
        <option key={idx} value={c}>
          {c}
        </option>
      ))}

    </select>

    <select
      value={indicador}
      onChange={(e) => setIndicador(e.target.value)}
    >

      <option value="">Todos los indicadores</option>

      {[
        ...new Set(
          datos
            .filter(i =>
              !convocatoria ||
              i.convocatoria === convocatoria
            )
            .map(i => i.indicador)
        )
      ].map((ind, idx) => (

        <option key={idx} value={ind}>
          {ind}
        </option>

      ))}

    </select>

    <h3>Indicadores registrados</h3>

<div className="contenedor-tabla-indicadores">

  <table className="tabla-indicadores" border="1">

      <thead>
  <tr>
    <th>ID</th>
    <th>Convocatoria</th>
    <th>Indicador</th>
    <th>Nivel</th>
    <th>Definición</th>
    <th>Propósito</th>
    <th>Funciones</th>
    <th>Acción</th>
  </tr>
</thead>

      <tbody>

        {filtrados.map((i) => (
          <tr key={i.id}>

            <td>{i.id}</td>

            <td>
              {i.convocatoria}
            </td>

            <td>
              {i.indicador}
            </td>

            <td>
              {i.nivel}
            </td>

            <td>
  <div className="td-scroll">
    {i.definicion}
  </div>
</td>

<td>
  <div className="td-scroll">
    {i.proposito}
  </div>
</td>

<td>
  <div className="td-scroll">
    {i.funciones}
  </div>
</td>
<td>
  <button onClick={() => eliminarIndicador(i.id)}>
    Eliminar
  </button>
</td>

          </tr>
        ))}

      </tbody>

    </table>

  </div>

</div>

);
}

/* =========================
   OBSERVACIONES EXPERTOS
========================= */

function ObservacionesExpertos() {

  const [archivo, setArchivo] = useState(null);

  const [datos, setDatos] = useState([]);

  const [filtro, setFiltro] = useState("");

  // =========================
  // CARGAR TABLA
  // =========================

  const cargarObservaciones = async () => {

    try {

      const res = await fetch(
        `${API_URL}/observaciones_expertos`
      );

      const data = await res.json();

      setDatos(data);

    } catch (error) {

      console.error(error);

    }
  };

  // =========================
  // ABRIR MÓDULO
  // =========================

  useEffect(() => {

    cargarObservaciones();

  }, []);

  // =========================
  // SUBIR EXCEL
  // =========================

  const subirExcelObservaciones = async () => {

    if (!archivo) {

      alert("Selecciona un archivo Excel");

      return;
    }

    const formData = new FormData();

    formData.append("file", archivo);

    try {

      const res = await fetch(`${API_URL}/observaciones_expertos/cargar`,
        {
          method: "POST",
          body: formData
        }
      );

      const data = await res.json();

      alert(data.mensaje);

      cargarObservaciones();

    } catch (error) {

      console.error(error);

      alert("Error cargando archivo");
    }
  };

  // =========================
  // ELIMINAR
  // =========================

  const eliminarObservacion = async (id) => {

    const confirmar = window.confirm(
      "¿Deseas eliminar este registro?"
    );

    if (!confirmar) return;

    try {

      const res = await fetch(`${API_URL}/observaciones_expertos/${id}`,
        {
          method: "DELETE"
        }
      );

      const data = await res.json();

      alert(data.mensaje);

      cargarObservaciones();

    } catch (error) {

      console.error(error);

      alert("Error eliminando");
    }
  };

  // =========================
  // FILTRO GENERAL
  // =========================

  const filtrados = datos.filter((i) => {

    if (!filtro) return true;

    const texto = filtro.toLowerCase();

    return (

      String(i.documento || "")
        .toLowerCase()
        .includes(texto)

      ||

      String(i.nombre || "")
        .toLowerCase()
        .includes(texto)

      ||

      String(i.convocatoria || "")
        .toLowerCase()
        .includes(texto)
    );
  });

  return (

    <div>

      <h2>Cargar observaciones de expertos</h2>

      {/* CARGAR EXCEL */}

      <input
        type="file"
        accept=".xlsx"
        onChange={(e) => setArchivo(e.target.files[0])}
      />

      <button onClick={subirExcelObservaciones}>
        Cargar Excel
      </button>

      <hr />

      {/* FILTRO */}

      <input
        type="text"
        placeholder="Buscar documento, nombre o convocatoria"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        style={{
          width: "350px",
          marginBottom: "15px"
        }}
      />

      {/* TABLA */}

      <div className="contenedor-tabla-indicadores">

        <table className="tabla-observaciones" border="1">

          <thead>

            <tr>

              <th>ID</th>
  <th>Documento</th>
  <th>Nombre</th>
  <th>Observación</th>
  <th>Responsable</th>
  <th>Proceso de selección</th>
  <th>Contactar</th>
  <th>Fecha</th>
  <th>Acción</th>

            </tr>

          </thead>

          <tbody>

            {filtrados.map((i) => (

              <tr key={i.id}>

  <td>{i.id}</td>

  <td>{i.documento}</td>

  <td>{i.nombre}</td>

  <td>
    <div className="td-scroll">
      {i.observacion}
    </div>
  </td>

  <td>{i.responsable_de_la_observacion}</td>

  <td>{i.proceso_de_seleccion}</td>

  <td>{i.contactar}</td>

  

  <td>{i.fecha}</td>

  <td>

    <button
      onClick={() => eliminarObservacion(i.id)}
    >
      Eliminar
    </button>

  </td>

</tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  );
}


/* =========================
   PERFILES SUGERIDOS
========================= */

function PerfilesSugeridos() {

  const [archivo, setArchivo] = useState(null);

  const [datos, setDatos] = useState([]);

  const [convocatoria, setConvocatoria] = useState("");

  const [indicador, setIndicador] = useState("");

  const [perfil, setPerfil] = useState("");

  // =========================
  // CARGAR DATOS PERFILES SUGERIDOS
  // =========================

 const cargarPerfiles = async () => {
  try {
    const res = await fetch(`${API_URL}/perfiles_sugeridos_indicador`);

    const data = await res.json();

    console.log("RESPUESTA BACKEND:", data);

    setDatos(Array.isArray(data) ? data : []);

  } catch (error) {
    console.error(error);
  }
};

  // =========================
  // AL ABRIR
  // =========================

  useEffect(() => {

    cargarPerfiles();

  }, []);

  // =========================
  // SUBIR EXCEL PERFILES SUGERIDOS
  // =========================

  const subirExcelPerfiles = async () => {

    if (!archivo) {

      alert("Selecciona un archivo Excel");

      return;
    }

    const formData = new FormData();

    formData.append("file", archivo);

    try {

      const res = await fetch(
        `${API_URL}/perfiles_sugeridos_indicador/cargar`,
        {
          method: "POST",
          body: formData
        }
      );


      const data = await res.json();

      alert(data.mensaje);

      cargarPerfiles();

    } catch (error) {

      console.error(error);

      alert("Error cargando archivo");

    }
  };

  // =========================
  // ELIMINAR PERFIL 
  // =========================

  const eliminarPerfil = async (id) => {

    const confirmar = window.confirm(
      "¿Deseas eliminar este registro?"
    );

    if (!confirmar) return;

    try {

      const res = await fetch(
        `${API_URL}/perfiles_sugeridos_indicador/${id}`,
        {
          method: "DELETE"
        }
      );

      const data = await res.json();

      alert(data.mensaje);

      cargarPerfiles();

    } catch (error) {

      console.error(error);

      alert("Error eliminando");

    }
  };

  // =========================
  // FILTROS PERFILES SUGERIDOS
  // =========================

  const safeDatos = Array.isArray(datos) ? datos : [];

const filtrados = safeDatos.filter((i) => {

    const cumpleConvocatoria =
      !convocatoria ||
      i.convocatoria === convocatoria;

    const cumpleIndicador =
      !indicador ||
      i.indicador === indicador;

    const cumplePerfil =
      !perfil ||
      i.perfil === perfil;

    return (
      cumpleConvocatoria &&
      cumpleIndicador &&
      cumplePerfil
    );
  });

  return (

    <div>

      <h2>Cargar perfiles sugeridos por indicador</h2>

      <input
        type="file"
        accept=".xlsx"
        onChange={(e) => setArchivo(e.target.files[0])}
      />

      <button onClick={subirExcelPerfiles}>
        Cargar Excel
      </button>

      <hr />

      {/* FILTROS */}

      <select
        value={convocatoria}
        onChange={(e) => {

          setConvocatoria(e.target.value);

          setIndicador("");

          setPerfil("");
        }}
      >

        <option value="">
          Todas las convocatorias
        </option>

        {[...new Set(
          datos.map(i => i.convocatoria)
        )].map((c, idx) => (

          <option key={idx} value={c}>
            {c}
          </option>

        ))}

      </select>

      <select
        value={indicador}
        onChange={(e) => {

          setIndicador(e.target.value);

          setPerfil("");
        }}
      >

        <option value="">
          Todos los indicadores
        </option>

        {[...new Set(

          datos
            .filter(i =>
              !convocatoria ||
              i.convocatoria === convocatoria
            )
            .map(i => i.indicador)

        )].map((ind, idx) => (

          <option key={idx} value={ind}>
            {ind}
          </option>

        ))}

      </select>

      <select
        value={perfil}
        onChange={(e) => setPerfil(e.target.value)}
      >

        <option value="">
          Todos los perfiles
        </option>

        {[...new Set(

          datos
            .filter(i =>

              (!convocatoria ||
                i.convocatoria === convocatoria)

              &&

              (!indicador ||
                i.indicador === indicador)

            )
            .map(i => i.perfil)

        )].map((p, idx) => (

          <option key={idx} value={p}>
            {p}
          </option>

        ))}

      </select>

      <hr />

      {/* TABLA */}

      <table
        className="tabla-perfiles"
        border="1"
      >

        <thead>

          <tr>

            <th>ID</th>
            <th>Convocatoria</th>
            <th>Indicador</th>
            <th>Perfil</th>
            <th>Confirma perfil</th>
            <th>Acción</th>

          </tr>

        </thead>

        <tbody>

          {filtrados.map((i) => (

            <tr key={i.id}>

              <td>{i.id}</td>

              <td>{i.convocatoria}</td>

              <td>{i.indicador}</td>

              <td>{i.perfil}</td>

              <td>{i.confirma_perfil}</td>

              <td>

                <button
                  onClick={() => eliminarPerfil(i.id)}
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



export default App;