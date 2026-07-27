import React, { useState, useEffect } from "react";
import "./IndicadoresGestion.css";

const API_URL = "https://erp-unilibre-production.up.railway.app";

function IndicadoresGestion() {

    const [consulta, setConsulta] = useState("gestion_diaria");
    const [convocatoria, setConvocatoria] = useState("");
    const [usuario, setUsuario] = useState("");

    const [convocatorias, setConvocatorias] = useState([]);
    const [usuarios, setUsuarios] = useState([]);

    const cargarConvocatorias = async () => {
    try {
        const res = await fetch(`${API_URL}/convocatorias`);
        const data = await res.json();
        setConvocatorias(data);
    } catch (error) {
        console.error("Error cargando convocatorias:", error);
    }
};

useEffect(() => {
    cargarConvocatorias();
}, []);


const cargarUsuarios = async (convocatoriaSeleccionada) => {
    if (!convocatoriaSeleccionada) {
        setUsuarios([]);
        return;
    }

    try {
        const res = await fetch(
            `${API_URL}/indicadores-gestion/usuarios/${encodeURIComponent(convocatoriaSeleccionada)}`
        );

        const data = await res.json();

        setUsuarios(data);

    } catch (error) {
        console.error(error);
        setUsuarios([]);
    }
};

const consultarGestionDiaria = async (convocatoriaSeleccionada, responsableSeleccionado) => {

    console.log("Convocatoria:", convocatoriaSeleccionada);
    console.log("Responsable:", responsableSeleccionado);

};

    return (
        <div className="indicadores-container">

            <h2>Indicadores de Gestión</h2>

                 <div className="filtros">

    <div className="campo">
        <label>Consulta</label>
        <select
            value={consulta}
            onChange={(e) => setConsulta(e.target.value)}
        >
            <option value="gestion_diaria">
                Gestión diaria
            </option>
        </select>
    </div>

    <div className="campo">
        <label>Convocatoria</label>
        
   <select
    value={convocatoria}
    onChange={(e) => {
        const valor = e.target.value;

        setConvocatoria(valor);
        setUsuario("");
        cargarUsuarios(valor);
    }}
>
    <option value="">Seleccione...</option>

   {convocatorias.map((item) => (
    <option
        key={item.id}
        value={item.nombre_convocatoria}
    >
        {item.nombre_convocatoria}
    </option>
))}

</select>
    </div>

    <div className="campo">
        <label>Usuario</label>
        <select
         value={usuario}
         onChange={(e) => {

        const valor = e.target.value;

        setUsuario(valor);

        if (!valor) return;

        consultarGestionDiaria(
            convocatoria,
            valor
        );

    }}
>
    <option value="">Seleccione...</option>

    {usuarios.map((item) => (
        <option
            key={item}
            value={item}
        >
            {item}
        </option>
    ))}
</select>
    </div>

    

</div>
            <div className="indicadores">
                <div className="tarjeta">
                    <span>Ingresos Totales</span>
                    <h3>0</h3>
                </div>

                <div className="tarjeta">
                    <span>Ingresos Usuario</span>
                    <h3>0</h3>
                </div>

                <div className="tarjeta">
                    <span>Participación</span>
                    <h3>0%</h3>
                </div>
            </div>

            <div className="contenedor-tabla">
                <table>
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Día</th>
                            <th>Ingresos Totales</th>
                            <th>Ingresos Usuario</th>
                            <th>% Participación</th>
                        </tr>
                    </thead>

                    <tbody>
                    </tbody>

                </table>
            </div>

        </div>
    );
}

export default IndicadoresGestion;