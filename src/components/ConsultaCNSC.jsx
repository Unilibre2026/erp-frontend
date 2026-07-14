import React, { useEffect, useState } from "react";
import "./ConsultaCNSC.css";

const API_URL = "https://erp-unilibre-production.up.railway.app";

function ConsultaCNSC() {

    // ==========================================
    // ESTADOS
    // ==========================================

    const [convocatorias, setConvocatorias] = useState([]);
    const [convocatoria, setConvocatoria] = useState("");
    const [datos, setDatos] = useState([]);

    // ==========================================
    // CARGAR CONVOCATORIAS
    // ==========================================

    useEffect(() => {

        cargarConvocatorias();

    }, []);

    const cargarConvocatorias = async () => {

        try {

            const res = await fetch(`${API_URL}/convocatorias`);

            const data = await res.json();

            const lista = [

                ...new Set(

                    data.map(c => c.nombre_convocatoria)

                )

            ].sort((a, b) => a.localeCompare(b, "es"));

            setConvocatorias(lista);

        }

        catch (error) {

            console.error(error);

        }

    };

    // ==========================================
    // CONSULTAR INFORMACIÓN
    // ==========================================

    const cargarConsulta = async (convocatoriaSeleccionada) => {

        if (!convocatoriaSeleccionada) {

            setDatos([]);

            return;

        }

        try {

            const token = localStorage.getItem("token");

            const res = await fetch(

                `${API_URL}/consulta-cnsc`,

                {

                    headers: {

                        Authorization: `Bearer ${token}`

                    }

                }

            );

            if (!res.ok) {

                throw new Error("Error consultando información");

            }

            const data = await res.json();

            const filtrados = (data.datos || []).filter(

                fila =>

                    fila.convocatoria === convocatoriaSeleccionada

            );

            setDatos(filtrados);

        }

        catch (error) {

            console.error(error);

            setDatos([]);

        }

    };

    // ==========================================
    // RETURN
    // ==========================================

    return (

        <div className="consulta-cnsc">

            <h2>

                Consulta CNSC

            </h2>

            {/*======================================
                    FILTRO
            ======================================*/}

            <div className="barra-superior">

                <div className="campo">

                    <label>

                        Convocatoria

                    </label>

                    <select

                        value={convocatoria}

                        onChange={(e) => {

                            const valor = e.target.value;

                            setConvocatoria(valor);

                            cargarConsulta(valor);

                        }}

                    >

                        <option value="">

                            Seleccione convocatoria

                        </option>

                        {

                            convocatorias.map((c) => (

                                <option
                                    key={c}
                                    value={c}
                                >

                                    {c}

                                </option>

                            ))

                        }

                    </select>

                </div>

                <button className="btn-exportar">

                    📥 Exportar Excel

                </button>

            </div>

            {/*======================================
                    TABLA
            ======================================*/}

            <div className="tabla-cnsc">

                <table>

                    <thead>

                        <tr>

                            <th>Proceso de selección</th>

                            <th>Fecha de novedad</th>

                            <th>Tipo de novedad</th>

                            <th>Ciudad de aplicación</th>

                            <th>Rol</th>

                            <th>Nombre del experto</th>

                        </tr>

                    </thead>

                    <tbody>

                        {
                            datos.map((fila, index) => (

                                <tr key={index}>

                                    <td>{fila.convocatoria}</td>

                                    <td>{formatearFecha(fila.fecha_creacion)}</td>

                                    <td>{fila.tipo_novedad}</td>

                                    <td>{fila.eje}</td>

                                    <td>{fila.rol}</td>

                                    <td>{fila.nombre}</td>

                                </tr>

                            ))
                        }

                    </tbody>

                </table>

            </div>

        </div>

    );

}

// ==========================================
// FORMATEAR FECHA
// ==========================================

const formatearFecha = (fecha) => {

    if (!fecha) return "";

    return new Date(fecha).toLocaleDateString(

        "es-CO",

        {

            day: "2-digit",
            month: "2-digit",
            year: "numeric"

        }

    );

};

export default ConsultaCNSC;