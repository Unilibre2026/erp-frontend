import React, { useEffect, useRef, useState } from "react";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { Eye, Download, X } from "lucide-react";
import "./PerfilesAprobadosPorExperto.css";

const API_URL = "https://erp-unilibre-production.up.railway.app";

function PerfilesAprobadosPorExperto() {

    // =========================================================
    // DATOS
    // =========================================================

    const [datos, setDatos] = useState([]);

    const [cargando, setCargando] = useState(false);

    const [error, setError] = useState("");

    // =========================================================
    // FILTROS
    // =========================================================

    const [convocatoria, setConvocatoria] = useState("");
    const [indicador, setIndicador] = useState("");
    const [rol, setRol] = useState("");

    const [palabraClave, setPalabraClave] = useState("");
    const [documento, setDocumento] = useState("");
    const [nombre, setNombre] = useState("");

    // =========================================================
    // OPCIONES DE FILTROS
    // =========================================================

    const [opciones, setOpciones] = useState({
        convocatorias: [],
        indicadores: [],
        roles: []
    });

    // =========================================================
    // MODAL
    // =========================================================

    const [registroSeleccionado, setRegistroSeleccionado] =
        useState(null);

    // =========================================================
    // CONTROL DE CONSULTA
    // =========================================================

    const temporizador = useRef(null);

    // =========================================================
    // CARGAR OPCIONES DE FILTROS
    // =========================================================

    useEffect(() => {

        const cargarOpciones = async () => {

            try {

                const res = await fetch(
                    `${API_URL}/perfiles-aprobados-por-experto/filtros`
                );

                if (!res.ok) {
                    throw new Error("Error cargando filtros");
                }

                const data = await res.json();

                setOpciones({
                    convocatorias: Array.isArray(data.convocatorias)
                        ? data.convocatorias
                        : [],

                    indicadores: Array.isArray(data.indicadores)
                        ? data.indicadores
                        : [],

                    roles: Array.isArray(data.roles)
                        ? data.roles
                        : []
                });

            } catch (error) {

                console.error(
                    "Error cargando opciones de filtros:",
                    error
                );

            }

        };

        cargarOpciones();

    }, []);

    // =========================================================
    // DETERMINAR SI HAY FILTRO VÁLIDO
    // =========================================================

    const hayFiltroValido =
        convocatoria !== "" ||
        indicador !== "" ||
        rol !== "" ||
        palabraClave.trim().length >= 4 ||
        documento.trim() !== "" ||
        nombre.trim() !== "";

    // =========================================================
    // CONSULTAR DATOS
    // =========================================================

    const consultarDatos = async () => {

        if (!hayFiltroValido) {

            setDatos([]);
            setError("");

            return;
        }

        setCargando(true);
        setError("");

        try {

            const parametros = new URLSearchParams();

            if (convocatoria) {

                parametros.append(
                    "convocatoria",
                    convocatoria
                );

            }

            if (indicador) {

                parametros.append(
                    "indicador",
                    indicador
                );

            }

            if (rol) {

                parametros.append(
                    "rol",
                    rol
                );

            }

            if (documento.trim()) {

                parametros.append(
                    "documento",
                    documento.trim()
                );

            }

            if (nombre.trim()) {

                parametros.append(
                    "nombre",
                    nombre.trim()
                );

            }

            if (palabraClave.trim().length >= 4) {

                parametros.append(
                    "palabra_clave",
                    palabraClave.trim()
                );

            }

            const res = await fetch(
                `${API_URL}/perfiles-aprobados-por-experto?${parametros.toString()}`
            );

            if (!res.ok) {

                throw new Error(
                    "No fue posible consultar los perfiles aprobados."
                );

            }

            const data = await res.json();

            setDatos(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(
                "Error consultando perfiles aprobados:",
                error
            );

            setDatos([]);

            setError(
                "No fue posible consultar la información."
            );

        } finally {

            setCargando(false);

        }

    };

    // =========================================================
    // CONSULTA AUTOMÁTICA
    // =========================================================

    useEffect(() => {

        if (temporizador.current) {

            clearTimeout(
                temporizador.current
            );

        }

        if (!hayFiltroValido) {

            setDatos([]);
            setError("");

            return;

        }

        const filtroDesplegable =
            convocatoria !== "" ||
            indicador !== "" ||
            rol !== "";

        if (
            filtroDesplegable ||
            documento.trim() !== "" ||
            nombre.trim() !== "" ||
            palabraClave.trim().length >= 4
        ) {

            temporizador.current =
                setTimeout(() => {

                    consultarDatos();

                }, 300);

        }

        return () => {

            if (temporizador.current) {

                clearTimeout(
                    temporizador.current
                );

            }

        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        convocatoria,
        indicador,
        rol,
        palabraClave,
        documento,
        nombre
    ]);

    // =========================================================
    // CAMBIO DE CONVOCATORIA
    // =========================================================

    const cambiarConvocatoria = (e) => {

        const valor = e.target.value;

        setConvocatoria(valor);

        setIndicador("");
        setRol("");

    };

    // =========================================================
    // CAMBIO DE INDICADOR
    // =========================================================

    const cambiarIndicador = (e) => {

        const valor = e.target.value;

        setIndicador(valor);

        setRol("");

    };

    // =========================================================
    // INDICADORES DISPONIBLES
    // =========================================================

    const indicadoresDisponibles =
        opciones.indicadores.filter((item) => {

            if (!convocatoria) {

                return true;

            }

            return (
                !item.convocatoria ||
                item.convocatoria === convocatoria
            );

        });

    // =========================================================
    // ROLES DISPONIBLES
    // =========================================================

    const rolesDisponibles =
        opciones.roles.filter((item) => {

            if (
                convocatoria &&
                item.convocatoria &&
                item.convocatoria !== convocatoria
            ) {

                return false;

            }

            if (
                indicador &&
                item.indicador &&
                item.indicador !== indicador
            ) {

                return false;

            }

            return true;

        });

    // =========================================================
    // ABRIR MODAL
    // =========================================================

    const abrirModal = (registro) => {

        setRegistroSeleccionado(
            registro
        );

    };

    // =========================================================
    // CERRAR MODAL
    // =========================================================

    const cerrarModal = () => {

        setRegistroSeleccionado(
            null
        );

    };

    // =========================================================
    // EXPORTAR EXCEL
    // =========================================================

    const exportarExcel = async () => {

        if (!datos.length) {

            return;

        }

        try {

            const workbook =
                new ExcelJS.Workbook();

            workbook.creator =
                "ERP Unilibre";

            workbook.created =
                new Date();

            const worksheet =
                workbook.addWorksheet(
                    "Perfiles aprobados"
                );

            // =================================================
            // TÍTULO
            // =================================================

            worksheet.mergeCells(
                "A1:M1"
            );

            const titulo =
                worksheet.getCell(
                    "A1"
                );

            titulo.value =
                "PERFILES APROBADOS POR EXPERTO";

            titulo.font = {
                bold: true,
                size: 14
            };

            titulo.alignment = {
                horizontal: "center",
                vertical: "middle"
            };

            worksheet.getRow(1).height =
                25;

            // =================================================
            // ENCABEZADOS
            // =================================================

            worksheet.addRow([
                "N. novedad",
                "Documento experto",
                "Nombre experto",
                "Convocatoria",
                "Tipo novedad",
                "Indicador",
                "Nivel",
                "Rol",
                "Responsable reporte novedad",
                "Ciudad domicilio",
                "Justificación asignación",
                "Perfil laboral",
                "Perfil académico"
            ]);

            const filaEncabezado =
                worksheet.getRow(2);

            filaEncabezado.font = {
                bold: true
            };

            filaEncabezado.alignment = {
                vertical: "middle",
                horizontal: "center",
                wrapText: true
            };

            // =================================================
            // DATOS
            // =================================================

            datos.forEach((item) => {

                worksheet.addRow([
                    item.numero_novedad ?? "",
                    item.documento_experto ?? "",
                    item.nombre_experto ?? "",
                    item.convocatoria ?? "",
                    item.tipo_novedad ?? "",
                    item.indicador ?? "",
                    item.nivel ?? "",
                    item.rol ?? "",
                    item.responsable_reporte_novedad ?? "",
                    item.ciudad_domicilio ?? "",
                    item.justificacion_asignacion ?? "",
                    item.perfil_laboral ?? "",
                    item.perfil_academico ?? ""
                ]);

            });

            // =================================================
            // ANCHO COLUMNAS
            // =================================================

            worksheet.columns = [
                { width: 14 },
                { width: 20 },
                { width: 30 },
                { width: 30 },
                { width: 18 },
                { width: 25 },
                { width: 12 },
                { width: 30 },
                { width: 28 },
                { width: 20 },
                { width: 50 },
                { width: 55 },
                { width: 55 }
            ];

            // =================================================
            // AJUSTES
            // =================================================

            worksheet.eachRow(
                (row, rowNumber) => {

                    if (rowNumber >= 2) {

                        row.alignment = {
                            vertical: "top",
                            wrapText: true
                        };

                    }

                }
            );

            worksheet.views = [
                {
                    state: "frozen",
                    ySplit: 2
                }
            ];

            // =================================================
            // GENERAR ARCHIVO
            // =================================================

            const buffer =
                await workbook.xlsx.writeBuffer();

            saveAs(
                new Blob(
                    [buffer],
                    {
                        type:
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    }
                ),
                "Perfiles_aprobados_por_experto.xlsx"
            );

        } catch (error) {

            console.error(
                "Error exportando Excel:",
                error
            );

            alert(
                "No fue posible generar el archivo Excel."
            );

        }

    };

    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div className="perfiles-aprobados">

            {/* =================================================
                TÍTULO
            ================================================= */}

            <h2>
                Perfiles aprobados por experto
            </h2>


            {/* =================================================
                PRIMERA LÍNEA DE FILTROS
            ================================================= */}

            <div className="perfiles-aprobados-filtros fila-filtros">

                {/* CONVOCATORIA */}

                <select
                    value={convocatoria}
                    onChange={cambiarConvocatoria}
                >

                    <option value="">
                        Todas las convocatorias
                    </option>

                    {opciones.convocatorias.map(
                        (item, index) => {

                            const valor =
                                typeof item === "string"
                                    ? item
                                    : item.convocatoria;

                            return (

                                <option
                                    key={index}
                                    value={valor}
                                >
                                    {valor}
                                </option>

                            );

                        }
                    )}

                </select>


                {/* INDICADOR */}

                <select
                    value={indicador}
                    onChange={cambiarIndicador}
                >

                    <option value="">
                        Todos los indicadores
                    </option>

                    {indicadoresDisponibles.map(
                        (item, index) => {

                            const valor =
                                typeof item === "string"
                                    ? item
                                    : item.indicador;

                            return (

                                <option
                                    key={index}
                                    value={valor}
                                >
                                    {valor}
                                </option>

                            );

                        }
                    )}

                </select>


                {/* ROL */}

                <select
                    value={rol}
                    onChange={(e) =>
                        setRol(e.target.value)
                    }
                >

                    <option value="">
                        Todos los roles
                    </option>

                    {rolesDisponibles.map(
                        (item, index) => {

                            const valor =
                                typeof item === "string"
                                    ? item
                                    : item.rol;

                            return (

                                <option
                                    key={index}
                                    value={valor}
                                >
                                    {valor}
                                </option>

                            );

                        }
                    )}

                </select>


                {/* PALABRA CLAVE */}

                <input
                    type="text"
                    value={palabraClave}
                    onChange={(e) =>
                        setPalabraClave(
                            e.target.value
                        )
                    }
                    placeholder="Palabra clave"
                />

            </div>


            {/* =================================================
                SEGUNDA LÍNEA
            ================================================= */}

            <div className="perfiles-aprobados-filtros fila-filtros-secundaria">

                <input
                    type="text"
                    value={documento}
                    onChange={(e) =>
                        setDocumento(
                            e.target.value
                        )
                    }
                    placeholder="Documento"
                />

                <input
                    type="text"
                    value={nombre}
                    onChange={(e) =>
                        setNombre(
                            e.target.value
                        )
                    }
                    placeholder="Nombre del experto"
                />

            </div>


            {/* =================================================
                SEPARADOR
            ================================================= */}

            <div className="perfiles-aprobados-separador"></div>


            {/* =================================================
                BARRA RESULTADOS
            ================================================= */}

            <div className="perfiles-aprobados-barra">

                <div className="perfiles-aprobados-contador">

                    {cargando && (
                        <span>
                            Consultando...
                        </span>
                    )}

                    {!cargando &&
                        hayFiltroValido &&
                        datos.length > 0 && (

                            <span>
                                {datos.length}{" "}
                                {datos.length === 1
                                    ? "registro encontrado"
                                    : "registros encontrados"}
                            </span>

                        )}

                    {!cargando &&
                        hayFiltroValido &&
                        datos.length === 0 &&
                        !error && (

                            <span>
                                No se encontraron resultados.
                            </span>

                        )}

                </div>


                <button
                    className="btn-exportar-perfiles"
                    onClick={exportarExcel}
                    disabled={datos.length === 0}
                    title={
                        datos.length === 0
                            ? "No hay datos para exportar"
                            : "Exportar resultados a Excel"
                    }
                >

                    <Download
                        size={17}
                        strokeWidth={2}
                    />

                    Exportar Excel

                </button>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div className="perfiles-aprobados-error">
                    {error}
                </div>

            )}


            {/* =================================================
                TABLA
            ================================================= */}

            {datos.length > 0 && (

                <div className="perfiles-aprobados-tabla-contenedor">

                    <table className="tabla-perfiles-aprobados">

                        <thead>

                            <tr>

                                {/* DETALLE PRIMERO */}

                                <th>Detalle</th>

                                <th>N. novedad</th>

                                <th>Documento</th>

                                <th>Nombre del experto</th>

                                <th>Convocatoria</th>

                                <th>Tipo novedad</th>

                                <th>Indicador</th>

                                <th>Nivel</th>

                                <th>Rol</th>

                                <th>Responsable</th>

                                <th>Ciudad domicilio</th>

                                <th>Justificación asignación</th>

                                <th>Perfil laboral</th>

                                <th>Perfil académico</th>

                            </tr>

                        </thead>


                        <tbody>

                            {datos.map(
                                (item, index) => (

                                    <tr
                                        key={
                                            `${item.numero_novedad}-${index}`
                                        }
                                    >

                                        {/* =================================
                                            DETALLE
                                        ================================= */}

                                        <td>

                                            <button
                                                className="btn-detalle-perfil"
                                                onClick={() =>
                                                    abrirModal(item)
                                                }
                                                title="Ver detalle"
                                            >

                                                <Eye
                                                    size={17}
                                                    strokeWidth={1.8}
                                                />

                                            </button>

                                        </td>


                                        {/* =================================
                                            N. NOVEDAD
                                        ================================= */}

                                        <td>
                                            {item.numero_novedad}
                                        </td>


                                        {/* =================================
                                            DOCUMENTO
                                        ================================= */}

                                        <td>
                                            {item.documento_experto}
                                        </td>


                                        {/* =================================
                                            NOMBRE
                                        ================================= */}

                                        <td>
                                            {item.nombre_experto}
                                        </td>


                                        {/* =================================
                                            CONVOCATORIA
                                        ================================= */}

                                        <td>
                                            {item.convocatoria}
                                        </td>


                                        {/* =================================
                                            TIPO NOVEDAD
                                        ================================= */}

                                        <td>
                                            {item.tipo_novedad}
                                        </td>


                                        {/* =================================
                                            INDICADOR
                                        ================================= */}

                                        <td>
                                            {item.indicador}
                                        </td>


                                        {/* =================================
                                            NIVEL
                                        ================================= */}

                                        <td>
                                            {item.nivel}
                                        </td>


                                        {/* =================================
                                            ROL
                                        ================================= */}

                                        <td>
                                            {item.rol}
                                        </td>


                                        {/* =================================
                                            RESPONSABLE
                                        ================================= */}

                                        <td>
                                            {item.responsable_reporte_novedad}
                                        </td>


                                        {/* =================================
                                            CIUDAD
                                        ================================= */}

                                        <td>
                                            {item.ciudad_domicilio}
                                        </td>


                                        {/* =================================
                                            JUSTIFICACIÓN
                                        ================================= */}

                                        <td>
                                            {item.justificacion_asignacion}
                                        </td>


                                        {/* =================================
                                            PERFIL LABORAL
                                        ================================= */}

                                        <td>
                                            {item.perfil_laboral}
                                        </td>


                                        {/* =================================
                                            PERFIL ACADÉMICO
                                        ================================= */}

                                        <td>
                                            {item.perfil_academico}
                                        </td>

                                    </tr>

                                )
                            )}

                        </tbody>

                    </table>

                </div>

            )}


            {/* =================================================
                MENSAJE INICIAL
            ================================================= */}

            {!cargando &&
                !hayFiltroValido && (

                    <div className="perfiles-aprobados-mensaje-inicial">

                        Seleccione un filtro o ingrese una
                        palabra clave de al menos 4 caracteres
                        para consultar los perfiles aprobados.

                    </div>

                )}


            {/* =================================================
                MODAL
            ================================================= */}

            {registroSeleccionado && (

                <div
                    className="modal-overlay-perfiles-aprobados"
                    onClick={cerrarModal}
                >

                    <div
                        className="modal-perfiles-aprobados"
                        onClick={(e) =>
                            e.stopPropagation()
                        }
                    >

                        {/* ENCABEZADO */}

                        <div className="modal-perfiles-aprobados-header">

                            <div>

                                <h3>
                                    Perfil aprobado por experto
                                </h3>

                                <span>
                                    N. novedad:{" "}
                                    {registroSeleccionado.numero_novedad}
                                </span>

                            </div>


                            <button
                                className="btn-cerrar-modal-perfiles"
                                onClick={cerrarModal}
                                title="Cerrar"
                            >

                                <X
                                    size={21}
                                    strokeWidth={1.8}
                                />

                            </button>

                        </div>


                        {/* CONTENIDO */}

                        <div className="modal-perfiles-aprobados-contenido">

                            {/* INFORMACIÓN DEL EXPERTO */}

                            <section>

                                <h4>
                                    Información del experto
                                </h4>

                                <div className="modal-grid-perfiles">

                                    <div>

                                        <label>
                                            Documento
                                        </label>

                                        <span>
                                            {registroSeleccionado.documento_experto || "-"}
                                        </span>

                                    </div>


                                    <div>

                                        <label>
                                            Nombre del experto
                                        </label>

                                        <span>
                                            {registroSeleccionado.nombre_experto || "-"}
                                        </span>

                                    </div>


                                    <div>

                                        <label>
                                            Ciudad de domicilio
                                        </label>

                                        <span>
                                            {registroSeleccionado.ciudad_domicilio || "-"}
                                        </span>

                                    </div>

                                </div>

                            </section>


                            {/* INFORMACIÓN NOVEDAD */}

                            <section>

                                <h4>
                                    Información de la novedad
                                </h4>

                                <div className="modal-grid-perfiles">

                                    <div>

                                        <label>
                                            N. novedad
                                        </label>

                                        <span>
                                            {registroSeleccionado.numero_novedad || "-"}
                                        </span>

                                    </div>


                                    <div>

                                        <label>
                                            Tipo de novedad
                                        </label>

                                        <span>
                                            {registroSeleccionado.tipo_novedad || "-"}
                                        </span>

                                    </div>


                                    <div>

                                        <label>
                                            Convocatoria
                                        </label>

                                        <span>
                                            {registroSeleccionado.convocatoria || "-"}
                                        </span>

                                    </div>


                                    <div>

                                        <label>
                                            Responsable del reporte
                                        </label>

                                        <span>
                                            {registroSeleccionado.responsable_reporte_novedad || "-"}
                                        </span>

                                    </div>

                                </div>

                            </section>


                            {/* ASIGNACIÓN */}

                            <section>

                                <h4>
                                    Asignación
                                </h4>

                                <div className="modal-grid-perfiles">

                                    <div>

                                        <label>
                                            Indicador
                                        </label>

                                        <span>
                                            {registroSeleccionado.indicador || "-"}
                                        </span>

                                    </div>


                                    <div>

                                        <label>
                                            Nivel
                                        </label>

                                        <span>
                                            {registroSeleccionado.nivel || "-"}
                                        </span>

                                    </div>


                                    <div>

                                        <label>
                                            Rol
                                        </label>

                                        <span>
                                            {registroSeleccionado.rol || "-"}
                                        </span>

                                    </div>

                                </div>

                            </section>


                            {/* JUSTIFICACIÓN */}

                            <section>

                                <h4>
                                    Justificación de asignación
                                </h4>

                                <div className="modal-texto-perfil">

                                    {registroSeleccionado.justificacion_asignacion ||
                                        "Sin información"}

                                </div>

                            </section>


                            {/* PERFIL LABORAL */}

                            <section>

                                <h4>
                                    Perfil laboral
                                </h4>

                                <div className="modal-texto-perfil">

                                    {registroSeleccionado.perfil_laboral ||
                                        "Sin información"}

                                </div>

                            </section>


                            {/* PERFIL ACADÉMICO */}

                            <section>

                                <h4>
                                    Perfil académico
                                </h4>

                                <div className="modal-texto-perfil">

                                    {registroSeleccionado.perfil_academico ||
                                        "Sin información"}

                                </div>

                            </section>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}

export default PerfilesAprobadosPorExperto;