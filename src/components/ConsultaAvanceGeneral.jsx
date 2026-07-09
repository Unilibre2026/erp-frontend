import { useEffect, useState } from "react";
import "./ConsultaAvanceGeneral.css";

const API_URL = "https://erp-unilibre-production.up.railway.app";

function ConsultaAvanceGeneral() {

    // ==========================
    // ESTADOS
    // ==========================

    const [convocatorias, setConvocatorias] = useState([]);
    const [convocatoria, setConvocatoria] = useState("");

    // Información que llegará del backend
    const [avance, setAvance] = useState([]);

    // Los dejamos preparados para los siguientes pasos
    const [roles, setRoles] = useState([]);
    const [ciudades, setCiudades] = useState([]);

    // ==========================
    // CARGAR CONVOCATORIAS
    // ==========================

    useEffect(() => {

        cargarConvocatorias();

    }, []);

    // ==========================
    // FUNCIONES
    // ==========================

    const cargarConvocatorias = async () => {

        try {

            const res = await fetch(`${API_URL}/convocatorias`);

            const data = await res.json();

            const unicas = [
                ...new Set(
                    data.map((c) => c.nombre_convocatoria)
                )
            ];

            setConvocatorias(unicas);

        } catch (error) {

            console.error("Error cargando convocatorias:", error);

        }

    };

    // ==========================
    // CARGAR AVANCE
    // ==========================

    const cargarAvance = async (convocatoriaSeleccionada) => {

        if (!convocatoriaSeleccionada) {

            setAvance([]);
            setRoles([]);
            setCiudades([]);
            return;

        }

        try {

            const res = await fetch(
                `${API_URL}/avance-prueba/${encodeURIComponent(convocatoriaSeleccionada)}`
            );

            if (!res.ok) {

                throw new Error("Error consultando información");

            }

            const data = await res.json();

            console.log("===== RESPUESTA DEL BACKEND =====");
            console.log(data);

            // Guardamos la información completa
            setAvance(data.indicadores || []);

            // Estos estados se llenarán más adelante
            // cuando construyamos la tabla dinámica.
            setRoles([]);
            setCiudades([]);

        } catch (error) {

            console.error(error);

            setAvance([]);
            setRoles([]);
            setCiudades([]);

        }

    };

    // ==========================
    // RETURN
    // ==========================

    return (

        <div className="consulta-avance-general">

            <h2>
                Consulta avance general
            </h2>

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

                            cargarAvance(valor);

                        }}

                    >

                        <option value="">
                            Seleccione convocatoria
                        </option>

                        {

                            convocatorias.map((c, index) => (

                                <option
                                    key={index}
                                    value={c}
                                >

                                    {c}

                                </option>

                            ))

                        }

                    </select>

                </div>

            </div>

        </div>

    );

}

export default ConsultaAvanceGeneral;