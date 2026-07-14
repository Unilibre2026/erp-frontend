import React, { useEffect, useState } from "react";
import "./ConsultaCNSC.css";

const API_URL = "https://erp-unilibre-production.up.railway.app";

function ConsultaCNSC() {

    // ==========================================
    // ESTADOS
    // ==========================================

    const [convocatorias, setConvocatorias] = useState([]);
    const [convocatoria, setConvocatoria] = useState("");

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

                        onChange={(e) =>

                            setConvocatoria(e.target.value)

                        }

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

                    </tbody>

                </table>

            </div>

        </div>

    );

}

export default ConsultaCNSC;