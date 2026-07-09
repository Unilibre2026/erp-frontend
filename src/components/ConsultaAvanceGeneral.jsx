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
            setCiudades([]);
            setRoles([]);
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

            // ==========================
            // CIUDADES
            // ==========================

            const ciudadesUnicas = [
                ...new Set(
                    filtradas.map(v => v.indicador)
                )
            ];

            // ==========================
            // ROLES
            // ==========================

            const rolesUnicos = [
                ...new Set(
                    filtradas.map(v => v.rol)
                )
            ];

            setCiudades(ciudadesUnicas);
            setRoles(rolesUnicos);

            console.log("===== VACANTES =====");
            console.table(filtradas);

            console.log("===== CIUDADES =====");
            console.table(ciudadesUnicas);

            console.log("===== ROLES =====");
            console.table(rolesUnicos);

        } catch (error) {

            console.error(error);

            setVacantes([]);
            setCiudades([]);
            setRoles([]);

        }

    };

    // ==========================
    // CANTIDAD POR CIUDAD Y ROL
    // ==========================

    const obtenerCantidad = (ciudad, rol) => {

        return vacantes
            .filter(
                v =>
                    v.indicador === ciudad &&
                    v.rol === rol
            )
            .reduce(
                (total, v) =>
                    total + Number(v.num_expertos || 0),
                0
            );

    };

    // ==========================
    // TOTAL POR CIUDAD
    // ==========================

    const obtenerTotalCiudad = (ciudad) => {

        return vacantes
            .filter(v => v.indicador === ciudad)
            .reduce(
                (total, v) =>
                    total + Number(v.num_expertos || 0),
                0
            );

    };

    // ==========================
    // TOTAL POR ROL
    // ==========================

    const obtenerTotalRol = (rol) => {

        return vacantes
            .filter(v => v.rol === rol)
            .reduce(
                (total, v) =>
                    total + Number(v.num_expertos || 0),
                0
            );

    };

    // ==========================
    // TOTAL GENERAL
    // ==========================

    const obtenerTotalGeneral = () => {

        return vacantes.reduce(

            (total, v) =>
                total + Number(v.num_expertos || 0),

            0

        );

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

                </div>

            </div>

            {/* ==========================
                TABLA
            ========================== */}

            {

                convocatoria && (

                    <div className="tabla-avance-general">

                        <table>

                            <thead>

    <tr>

        <th rowSpan="2">
            Ciudad
        </th>

        {

            roles.map((rol, index) => (

                <th
                    key={index}
                    colSpan="3"
                    className="titulo-rol"
                >

                    {rol}

                </th>

            ))

        }

        <th
            colSpan="3"
            className="titulo-total"
        >
            Total
        </th>

    </tr>

    <tr>

        {

            roles.map((rol, index) => (

                <>

                    <th key={`r-${index}`}>
                        Requerido
                    </th>

                    <th key={`c-${index}`}>
                        Reclutado
                    </th>

                    <th key={`p-${index}`}>
                        % avance
                    </th>

                </>

            ))

        }

        <th>
            Requerido
        </th>

        <th>
            Reclutado
        </th>

        <th>
            % avance
        </th>

    </tr>

</thead>

                            <tbody>

                                {

                                    ciudades.map((ciudad, index) => (

                                        <tr key={index}>

                                            <td>

                                                {ciudad}

                                            </td>

                                            {

                                                roles.map((rol, i) => (

                                                    <td key={i}>

                                                        {obtenerCantidad(ciudad, rol)}

                                                    </td>

                                                ))

                                            }

                                            <td>

                                                <strong>

                                                    {obtenerTotalCiudad(ciudad)}

                                                </strong>

                                            </td>

                                        </tr>

                                    ))

                                }

                                <tr>

                                    <td>

                                        <strong>Total</strong>

                                    </td>

                                    {

                                        roles.map((rol, index) => (

                                            <td key={index}>

                                                <strong>

                                                    {obtenerTotalRol(rol)}

                                                </strong>

                                            </td>

                                        ))

                                    }

                                    <td>

                                        <strong>

                                            {obtenerTotalGeneral()}

                                        </strong>

                                    </td>

                                </tr>

                            </tbody>

                        </table>

                    </div>

                )

            }

        </div>

    );

}

export default ConsultaAvanceGeneral;