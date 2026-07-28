import React, { useEffect, useState } from "react";
import "./ConsultaAvanceGeneral.css";
import { exportarAvanceGeneral } from "../utils/ExportadorExcel";
import { exportarReclutados } from "../utils/ExportadorReclutados";
import { exportarConsolidado } from "../utils/ExportadorConsolidado";


const API_URL = "https://erp-unilibre-production.up.railway.app";

function ConsultaAvanceGeneral() {

    // ==========================================
    // ESTADOS
    // ==========================================

    const [convocatorias, setConvocatorias] = useState([]);
    const [convocatoria, setConvocatoria] = useState("");

    const [vacantes, setVacantes] = useState([]);

    const [reclutados, setReclutados] = useState([]);
    const [preAprobados, setPreAprobados] = useState([]);
    const [aprobados, setAprobados] = useState([]);

    const [ciudades, setCiudades] = useState([]);

    const [roles, setRoles] = useState([]);

    const [tipoAnalisis, setTipoAnalisis] = useState("preaprobados");

    // ==========================================
    // CARGAR CONVOCATORIAS
    // ==========================================

    useEffect(() => {

        cargarConvocatorias();

    }, []);

    // ==========================================
    // CONSULTAR CONVOCATORIAS
    // ==========================================

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
    // CONSULTAR VACANTES
    // ==========================================

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

                throw new Error("Error consultando vacantes");

            }

            const data = await res.json();

            const lista = data.vacantes || data || [];

            const filtradas = lista.filter(

                v => v.convocatoria === convocatoriaSeleccionada

            );

            setVacantes(filtradas);

// ================================
// RECLUTADOS
// ================================

const resReclutados = await fetch(
    `${API_URL}/avance-general`
);

if (!resReclutados.ok) {
    throw new Error("Error consultando reclutados");
}

const dataReclutados = await resReclutados.json();

setReclutados(dataReclutados.reclutados || []);
setPreAprobados(dataReclutados.pre_aprobados || []);
setAprobados(dataReclutados.aprobados || []);

            // ================================
            // CIUDADES
            // ================================

            const ciudadesUnicas = [

                ...new Set(

                    filtradas.map(

                        v => v.indicador

                    )

                )

            ].sort((a, b) => a.localeCompare(b, "es"));

            setCiudades(ciudadesUnicas);

            // ================================
            // ROLES
            // ================================

            const rolesUnicos = [

                ...new Set(

                    filtradas.map(

                        v => v.rol

                    )

                )

            ].sort((a, b) => a.localeCompare(b, "es"));

            setRoles(rolesUnicos);

        }

        catch (error) {

            console.error(error);

            setVacantes([]);
            setCiudades([]);
            setRoles([]);

        }

    };

    // ==========================================
    // REQUERIDOS POR CIUDAD Y ROL
    // ==========================================

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

    const obtenerReclutados = (ciudad, rol) => {

    const registro = reclutados.find(

        r =>

            r.convocatoria === convocatoria &&
            r.eje === ciudad &&
            r.rol === rol

    );

    return registro ? registro.reclutados : 0;

};

const obtenerPorcentaje = (requerido, reclutado) => {

    if (Number(requerido) === 0) return "0,0%";

    return `${((Number(reclutado) / Number(requerido)) * 100)
        .toFixed(1)
        .replace(".", ",")}%`;

};



const obtenerPreAprobados = (ciudad, rol) => {

    const registro = preAprobados.find(

        p =>

            p.convocatoria === convocatoria &&
            p.indicador === ciudad &&
            p.rol === rol

    );

    return registro ? registro.pre_aprobados : 0;

};

// ==========================================
// APROBADOS
// ==========================================

const obtenerAprobados = (ciudad, rol) => {

    const registro = aprobados.find(

        a =>

            a.convocatoria === convocatoria &&
            a.indicador === ciudad &&
            a.rol === rol

    );

    return registro ? registro.aprobados : 0;

};






const obtenerTotalReclutadosRol = (rol) => {

    return reclutados

        .filter(

            r =>

                r.convocatoria === convocatoria &&
                r.rol === rol

        )

        .reduce(

            (total, r) => total + Number(r.reclutados),

            0

        );

};

const obtenerTotalPreAprobadosRol = (rol) => {

    return preAprobados

        .filter(

            p =>

                p.convocatoria === convocatoria &&
                p.rol === rol

        )

        .reduce(

            (total, p) => total + Number(p.pre_aprobados),

            0

        );

};

// ==========================================
// TOTAL APROBADOS POR ROL
// ==========================================

const obtenerTotalAprobadosRol = (rol) => {

    return aprobados

        .filter(

            a =>

                a.convocatoria === convocatoria &&
                a.rol === rol

        )

        .reduce(

            (total, a) => total + Number(a.aprobados),

            0

        );

};

const obtenerTotalGeneralReclutados = () => {

    return reclutados.reduce(

        (total, r) => total + Number(r.reclutados),

        0

    );

};

const obtenerTotalGeneralPreAprobados = () => {

    return preAprobados.reduce(

        (total, p) => total + Number(p.pre_aprobados),

        0

    );

};

// ==========================================
// TOTAL GENERAL APROBADOS
// ==========================================

const obtenerTotalGeneralAprobados = () => {

    return aprobados.reduce(

        (total, a) => total + Number(a.aprobados),

        0

    );

};

    // ==========================================
    // TOTAL POR CIUDAD
    // ==========================================

    const obtenerTotalCiudad = (ciudad) => {

        return vacantes

            .filter(

                v => v.indicador === ciudad

            )

            .reduce(

                (total, v) =>

                    total + Number(v.num_expertos || 0),

                0

            );

    };


    const obtenerTotalReclutadosCiudad = (ciudad) => {

    return reclutados

        .filter(

            r =>

                r.convocatoria === convocatoria &&
                r.eje === ciudad

        )

        .reduce(

            (total, r) => total + Number(r.reclutados),

            0

        );

};

const obtenerTotalPreAprobadosCiudad = (ciudad) => {

    return preAprobados

        .filter(

            p =>

                p.convocatoria === convocatoria &&
                p.indicador === ciudad

        )

        .reduce(

            (total, p) => total + Number(p.pre_aprobados),

            0

        );

};

// ==========================================
// TOTAL APROBADOS POR CIUDAD
// ==========================================

const obtenerTotalAprobadosCiudad = (ciudad) => {

    return aprobados

        .filter(

            a =>

                a.convocatoria === convocatoria &&
                a.indicador === ciudad

        )

        .reduce(

            (total, a) => total + Number(a.aprobados),

            0

        );

};

    // ==========================================
    // TOTAL POR ROL
    // ==========================================

    const obtenerTotalRol = (rol) => {

        return vacantes

            .filter(

                v => v.rol === rol

            )

            .reduce(

                (total, v) =>

                    total + Number(v.num_expertos || 0),

                0

            );

    };

    // ==========================================
    // TOTAL GENERAL
    // ==========================================

    const obtenerTotalGeneral = () => {

        return vacantes.reduce(

            (total, v) =>

                total + Number(v.num_expertos || 0),

            0

        );

    };

    // ==========================================
    // RETURN
    // ==========================================

    return (

        <div className="consulta-avance-general">

            <h2>

                Consulta avance general

            </h2>

            {/*======================================
                    FILTROS
            =======================================*/}

            <div className="barra-superior">

    {/* Convocatoria */}
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

            {convocatorias.map((c) => (

                <option
                    key={c}
                    value={c}
                >
                    {c}
                </option>

            ))}

        </select>

    </div>

    {/* NUEVO FILTRO */}

    <div className="campo">

        <label>

            Tipo de análisis

        </label>

        <select
            value={tipoAnalisis}
            onChange={(e) => setTipoAnalisis(e.target.value)}
        >

            <option value="preaprobados">

                Aprobados

            </option>

            <option value="reclutados">

                Reclutados

            </option>

            <option value="consolidado">

                Consolidado

            </option>

        </select>

    </div>

    {/* Botón */}

    <button
    className="btn-exportar"
    onClick={() => {

        if (tipoAnalisis === "preaprobados") {

            exportarAvanceGeneral(
                convocatoria,
                ciudades,
                roles,
                vacantes,
                reclutados,
                preAprobados
            );

        } else if (tipoAnalisis === "reclutados") {

            exportarReclutados(
                convocatoria,
                ciudades,
                roles,
                vacantes,
                reclutados
            );

        } else if (tipoAnalisis === "consolidado") {

            exportarConsolidado(
                convocatoria,
                roles,
                vacantes,
                reclutados
            );

        }

    }}
>

    📥 Exportar Excel

</button>
</div>

            {/*======================================
                    TABLA PREAPROBADOS
            =======================================*/}

            {

                convocatoria && 
                tipoAnalisis === "preaprobados" && (


                    <div className="tabla-avance-general">

                        <table>

                            <thead>

                                <tr>

                                    <th

                                        className="col-ciudad"

                                        rowSpan="2"

                                    >

                                        Ciudad

                                    </th>

                                    {

                                        roles.map((rol) => (

                                         <th

                                           key={rol}

                                           colSpan={5}

                                           className="titulo-rol"

                                        >

                                          {rol}

                                     </th>

))

                                    }

                                    <th

                                        colSpan={5}

                                        className="titulo-total"

                                    >

                                        Total

                                    </th>

                                </tr>

                                <tr>

                                    {

                                        roles.map((rol) => (

                                            <React.Fragment key={rol}>

                                                <th className="subtitulo">

                                                    Requerido

                                                </th>

                                                <th className="subtitulo">

                                                    Reclutado

                                                </th>

                                                <th className="subtitulo">

                                                    Pre aprobado

                                                </th>

                                                <th className="subtitulo">

                                                    Aprobado

                                                </th>

                                                <th className="subtitulo fin-rol">

                                                    % avance

                                                </th>

                                            </React.Fragment>

                                        ))

                                    }

                                    <th className="subtitulo">

                                        Requerido

                                    </th>

                                    <th className="subtitulo">

                                        Reclutado

                                    </th>

                                    <th className="subtitulo">

                                        Pre aprobado

                                    </th>

                                    <th className="subtitulo">

                                        Aprobado

                                    </th>

                                    <th className="subtitulo">

                                        % avance

                                    </th>

                                </tr>

                            </thead>

                            <tbody>

    {

        ciudades.map((ciudad) => (

            <tr key={ciudad}>

                {/* ==========================
                        CIUDAD
                ========================== */}

                <td className="col-ciudad">

                    {ciudad}

                </td>

                {/* ==========================
                        ROLES
                ========================== */}

               {
    roles.map((rol) => (

        <React.Fragment key={rol}>

            <td className="dato requerido">
                {obtenerCantidad(ciudad, rol)}
            </td>

            <td className="dato reclutado">
                {obtenerReclutados(ciudad, rol)}
            </td>

            <td className="dato pre-aprobado">
                {obtenerPreAprobados(ciudad, rol)}
            </td>

            <td className="dato aprobado">
                {obtenerAprobados(ciudad, rol)}
</td>

            <td className="dato porcentaje fin-rol">
                0,0%
            </td>

        </React.Fragment>

    ))
}
                

                <td className="dato total">

                    <strong>

                        {obtenerTotalCiudad(ciudad)}

                    </strong>

                </td>

                <td className="dato total">

                  <strong>

                    {obtenerTotalReclutadosCiudad(ciudad)}

                   </strong>

                </td> 

                <td className="dato total">

                    <strong>{obtenerTotalPreAprobadosCiudad(ciudad)}</strong>

                </td>
                     <td className="dato total">

                     <strong>{obtenerTotalAprobadosCiudad(ciudad)}</strong>

                </td>

                <td className="dato total">

                    <strong>0,0%</strong>

                </td>

            </tr>

        ))

    }

    {/* FILA TOTAL */}

    <tr className="fila-total">

        <td className="col-ciudad">

            <strong>TOTAL</strong>

        </td>

        {

           roles.map((rol) => (

    <React.Fragment key={rol}>

        <td className="dato total">
            <strong>{obtenerTotalRol(rol)}</strong>
        </td>

        <td className="dato total">
            <strong>{obtenerTotalReclutadosRol(rol)}</strong>
        </td>

        <td className="dato total">
            <strong>{obtenerTotalPreAprobadosRol(rol)}</strong>
        </td>

        <td className="dato total">

            <strong>{obtenerTotalAprobadosRol(rol)}</strong>

        </td>

        <td className="dato total fin-rol">
            <strong>0,0%</strong>
        </td>

    </React.Fragment>

))

        }

        <td className="dato total">

    <strong>
        {obtenerTotalGeneral()}
    </strong>

</td>

<td className="dato total">

    <strong>

        {obtenerTotalGeneralReclutados()}

    </strong>

</td>

<td className="dato total">

    <strong>{obtenerTotalGeneralPreAprobados()}</strong>

</td>

<td className="dato total">

    <strong>{obtenerTotalGeneralAprobados()}</strong>

</td>

<td className="dato total">

    <strong>0,0%</strong>

</td>

    </tr>

</tbody>

                        </table>

                    </div>

                )

            }

 {/* =========================
        TABLA RECLUTADOS
========================= */}

{
    convocatoria &&
    tipoAnalisis === "reclutados" && (

        <div className="tabla-avance-general">

            <table>

                <thead>

                    <tr>

                        <th
                            className="col-ciudad"
                            rowSpan="2"
                        >
                            Ciudad
                        </th>

                        {

                            roles.map((rol) => (

                                <th
                                    key={rol}
                                    colSpan={3}
                                    className="titulo-rol"
                                >

                                    {rol}

                                </th>

                            ))

                        }

                        <th
                            colSpan={3}
                            className="titulo-total"
                        >

                            Total

                        </th>

                    </tr>

                    <tr>

                        {

                            roles.map((rol) => (

                                <React.Fragment key={rol}>

                                    <th className="subtitulo">

                                        Requerido

                                    </th>

                                    <th className="subtitulo">

                                        Reclutado

                                    </th>

                                    <th className="subtitulo fin-rol">

                                        % avance

                                    </th>

                                </React.Fragment>

                            ))

                        }

                        <th className="subtitulo">

                            Requerido

                        </th>

                        <th className="subtitulo">

                            Reclutado

                        </th>

                        <th className="subtitulo">

                            % avance

                        </th>

                    </tr>

                </thead>

                <tbody>

                    {

                        ciudades.map((ciudad) => (

                            <tr key={ciudad}>

                                <td className="col-ciudad">

                                    {ciudad}

                                </td>

                                {

                                    roles.map((rol) => (

                                        <React.Fragment key={rol}>

                                            <td className="dato requerido">

                                                {obtenerCantidad(ciudad, rol)}

                                            </td>

                                            <td className="dato reclutado">

                                                {obtenerReclutados(ciudad, rol)}

                                            </td>

                                            <td className="dato porcentaje fin-rol">

                                                {obtenerPorcentaje(
                                                    obtenerCantidad(ciudad, rol),
                                                    obtenerReclutados(ciudad, rol)
                                                )}

                                            </td>

                                        </React.Fragment>

                                    ))

                                }

                                <td className="dato total">

                                    <strong>

                                        {obtenerTotalCiudad(ciudad)}

                                    </strong>

                                </td>

                                <td className="dato total">

                                    <strong>

                                        {obtenerTotalReclutadosCiudad(ciudad)}

                                    </strong>

                                </td>

                                <td className="dato total">

                                    <strong>

                                        {obtenerPorcentaje(
                                            obtenerTotalCiudad(ciudad),
                                            obtenerTotalReclutadosCiudad(ciudad)
                                        )}

                                    </strong>

                                </td>

                            </tr>

                        ))

                    }

                    {/* FILA TOTAL */}

                    <tr className="fila-total">

                        <td className="col-ciudad">

                            <strong>TOTAL</strong>

                        </td>

                        {

                            roles.map((rol) => (

                                <React.Fragment key={rol}>

                                    <td className="dato total">

                                        <strong>

                                            {obtenerTotalRol(rol)}

                                        </strong>

                                    </td>

                                    <td className="dato total">

                                        <strong>

                                            {obtenerTotalReclutadosRol(rol)}

                                        </strong>

                                    </td>

                                    <td className="dato total fin-rol">

                                        <strong>

                                            {obtenerPorcentaje(
                                                obtenerTotalRol(rol),
                                                obtenerTotalReclutadosRol(rol)
                                            )}

                                        </strong>

                                    </td>

                                </React.Fragment>

                            ))

                        }

                        <td className="dato total">

                            <strong>

                                {obtenerTotalGeneral()}

                            </strong>

                        </td>

                        <td className="dato total">

                            <strong>

                                {obtenerTotalGeneralReclutados()}

                            </strong>

                        </td>

                        <td className="dato total">

                            <strong>

                                {obtenerPorcentaje(
                                    obtenerTotalGeneral(),
                                    obtenerTotalGeneralReclutados()
                                )}

                            </strong>

                        </td>

                    </tr>

                 </tbody>

            </table>

        </div>

    )

}

{/* =========================
        TABLA CONSOLIDADO
========================= */}

{
    convocatoria &&
    tipoAnalisis === "consolidado" && (

        <div className="tabla-avance-general">

            <table>

                <thead>

                    <tr>

                        {

                            roles.map((rol) => (

                                <th
                                    key={rol}
                                    colSpan={3}
                                    className="titulo-rol"
                                >

                                    {rol}

                                </th>

                            ))

                        }

                        <th
                            colSpan={3}
                            className="titulo-total"
                        >

                            TOTAL

                        </th>

                    </tr>

                    <tr>

                        {

                            roles.map((rol) => (

                                <React.Fragment key={rol}>

                                    <th className="subtitulo">

                                        Requerido

                                    </th>

                                    <th className="subtitulo">

                                        Reclutado

                                    </th>

                                    <th className="subtitulo fin-rol">

                                        % avance

                                    </th>

                                </React.Fragment>

                            ))

                        }

                        <th className="subtitulo">

                            Requerido

                        </th>

                        <th className="subtitulo">

                            Reclutado

                        </th>

                        <th className="subtitulo">

                            % avance

                        </th>

                    </tr>

                </thead>

                <tbody>

                    <tr>

                        {

                            roles.map((rol) => (

                                <React.Fragment key={rol}>

                                    <td className="dato requerido">

                                        {obtenerTotalRol(rol)}

                                    </td>

                                    <td className="dato reclutado">

                                        {obtenerTotalReclutadosRol(rol)}

                                    </td>

                                    <td className="dato porcentaje fin-rol">

                                        {obtenerPorcentaje(
                                            obtenerTotalRol(rol),
                                            obtenerTotalReclutadosRol(rol)
                                        )}

                                    </td>

                                </React.Fragment>

                            ))

                        }

                        <td className="dato total">

                            <strong>

                                {obtenerTotalGeneral()}

                            </strong>

                        </td>

                        <td className="dato total">

                            <strong>

                                {obtenerTotalGeneralReclutados()}

                            </strong>

                        </td>

                        <td className="dato total">

                            <strong>

                                {obtenerPorcentaje(
                                    obtenerTotalGeneral(),
                                    obtenerTotalGeneralReclutados()
                                )}

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