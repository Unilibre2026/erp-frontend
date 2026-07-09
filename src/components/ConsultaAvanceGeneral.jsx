import { useEffect, useState } from "react";
import "./ConsultaAvanceGeneral.css";

const API_URL = "https://erp-unilibre-production.up.railway.app";

function ConsultaAvanceGeneral() {

    // ==========================
    // ESTADOS
    // ==========================

    const [convocatorias, setConvocatorias] = useState([]);
    const [convocatoria, setConvocatoria] = useState("");
    const [vacantes, setVacantes] = useState([]);
    const [ciudades, setCiudades] = useState([]);
    const [roles, setRoles] = useState([]);

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
                    data.map(c => c.nombre_convocatoria)
                )
            ];

            setConvocatorias(unicas);

        } catch (error) {

            console.error("Error cargando convocatorias:", error);

        }

    };

    // ==========================
    // CARGAR VACANTES
    // ==========================

    const cargarVacantes = async (convocatoriaSeleccionada) => {

        if (!convocatoriaSeleccionada) {

            setVacantes([]);
            return;

        }

        try {

            const token = localStorage.getItem("token");

            const res = await fetch(
                `${API_URL}/vacantes`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!res.ok) {

                throw new Error("Error cargando vacantes");

            }

            const data = await res.json();

            const lista = data.vacantes || data || [];

            const filtradas = lista.filter(
                v => v.convocatoria === convocatoriaSeleccionada
            );

            setVacantes(filtradas);

            // Obtener ciudades únicas
             const ciudadesUnicas = [
                ...new Set(
                    filtradas.map(v => v.indicador)
    )
];

// Obtener roles únicos
              const rolesUnicos = [
                   ...new Set(
                       filtradas.map(v => v.rol)
    )
];

setCiudades(ciudadesUnicas);
setRoles(rolesUnicos);

            console.log("===== VACANTES FILTRADAS =====");
            console.table(filtradas);

            console.log("CIUDADES");
            console.table(ciudadesUnicas);

            console.log("ROLES");
            console.table(rolesUnicos);

        } catch (error) {

            console.error("Error:", error);

            setVacantes([]);

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

                            cargarVacantes(valor);

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

                    {/* Temporal mientras construimos la tabla */}

<div style={{ display: "none" }}>

    {vacantes.length}

    {ciudades.length}

    {roles.length}

</div>

                </div>

            </div>

        </div>

    );

}

export default ConsultaAvanceGeneral;