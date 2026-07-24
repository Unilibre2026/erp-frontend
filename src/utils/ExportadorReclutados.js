import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import Logo from "../assets/logo.png";

export async function exportarReclutados(
    convocatoria,
    ciudades = [],
    roles = [],
    vacantes = [],
    reclutados = []
) {

    const workbook = new ExcelJS.Workbook();

    workbook.creator = "ERP Universidad Libre";
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet("Reclutados");

    //=====================================
// CARGAR LOGO
//=====================================

const response = await fetch(Logo);

const blob = await response.blob();

const logoBuffer = await blob.arrayBuffer();

const logoId = workbook.addImage({

    buffer: logoBuffer,

    extension: "png"

});

//=====================================
// VALIDAR ARREGLOS
//=====================================

if (!Array.isArray(ciudades)) ciudades = [];

if (!Array.isArray(roles)) roles = [];

if (!Array.isArray(vacantes)) vacantes = [];

if (!Array.isArray(reclutados)) reclutados = [];

//=====================================
// ANCHO DE COLUMNAS
//=====================================

const columnas = [

    { width: 25 } // Ciudad

];

roles.forEach(() => {

    columnas.push({ width: 14 }); // Requerido
    columnas.push({ width: 14 }); // Reclutado
    columnas.push({ width: 14 }); // % Avance

});

columnas.push({ width: 14 });
columnas.push({ width: 14 });
columnas.push({ width: 14 });

worksheet.columns = columnas;

worksheet.properties.defaultRowHeight = 22;

//=====================================
// TITULO
//=====================================

worksheet.mergeCells(2, 2, 2, 8);

worksheet.getCell("B2").value = "UNIVERSIDAD LIBRE";

worksheet.getCell("B2").font = {

    bold: true,
    size: 22,
    color: { argb: "0B5D74" },
    name: "Calibri"

};

worksheet.getCell("B2").alignment = {

    horizontal: "center",
    vertical: "middle"

};

worksheet.getRow(2).height = 40;

//=====================================
// SUBTITULO
//=====================================

worksheet.mergeCells(3, 2, 3, 8);

worksheet.getCell("B3").value = "CONSULTA AVANCE GENERAL - RECLUTADOS";

worksheet.getCell("B3").font = {

    bold: true,
    size: 16,
    name: "Calibri"

};

worksheet.getCell("B3").alignment = {

    horizontal: "center",
    vertical: "middle"

};

worksheet.getRow(3).height = 28;

//=====================================
// INSERTAR LOGO
//=====================================

worksheet.addImage(

    logoId,

    {

        tl: {

            col: 8.8,
            row: 0.7

        },

        ext: {

            width: 180,
            height: 68

        }

    }

);

//=====================================
// INFORMACIÓN
//=====================================

worksheet.getCell("A5").value = "Convocatoria";

worksheet.getCell("B5").value = convocatoria;

const ahora = new Date();

const fechaColombia = new Date(

    ahora.toLocaleString("en-US", {

        timeZone: "America/Bogota"

    })

);

worksheet.getCell("A6").value = "Fecha";

worksheet.getCell("B6").value = fechaColombia;

worksheet.getCell("B6").numFmt = "dd/mm/yyyy hh:mm";

worksheet.getColumn(1).width = 25;

worksheet.getColumn(2).width = 28;

}

//=====================================
// ENCABEZADOS
//=====================================

const filaRoles = 9;
const filaSubtitulos = 10;

worksheet.getRow(filaRoles).height = 30;
worksheet.getRow(filaSubtitulos).height = 24;

//------------------------------------
// CIUDAD
//------------------------------------

worksheet.mergeCells(
    filaRoles,
    1,
    filaSubtitulos,
    1
);

const celdaCiudad = worksheet.getCell(filaRoles, 1);

celdaCiudad.value = "Ciudad";

celdaCiudad.alignment = {

    horizontal: "center",
    vertical: "middle"

};

celdaCiudad.font = {

    bold: true,
    color: { argb: "FFFFFF" },
    size: 12

};

celdaCiudad.fill = {

    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "0B5D74" }

};

//------------------------------------
// ROLES
//------------------------------------

let columna = 2;

roles.forEach((rol) => {

    worksheet.mergeCells(
        filaRoles,
        columna,
        filaRoles,
        columna + 2
    );

    const tituloRol = worksheet.getCell(filaRoles, columna);

    tituloRol.value = rol;

    tituloRol.alignment = {

        horizontal: "center",
        vertical: "middle"

    };

    tituloRol.font = {

        bold: true,
        color: { argb: "FFFFFF" }

    };

    tituloRol.fill = {

        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "0B5D74" }

    };

    worksheet.getCell(filaSubtitulos, columna).value = "Requerido";
    worksheet.getCell(filaSubtitulos, columna + 1).value = "Reclutado";
    worksheet.getCell(filaSubtitulos, columna + 2).value = "% avance";

    for (let i = 0; i < 3; i++) {

        const celda = worksheet.getCell(
            filaSubtitulos,
            columna + i
        );

        celda.font = {

            bold: true,
            color: { argb: "FFFFFF" }

        };

        celda.alignment = {

            horizontal: "center"

        };

        celda.fill = {

            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "2F7D94" }

        };

    }

    columna += 3;

});

//------------------------------------
// TOTAL
//------------------------------------

worksheet.mergeCells(
    filaRoles,
    columna,
    filaRoles,
    columna + 2
);

const tituloTotal = worksheet.getCell(filaRoles, columna);

tituloTotal.value = "TOTAL";

tituloTotal.font = {

    bold: true,
    color: { argb: "FFFFFF" }

};

tituloTotal.alignment = {

    horizontal: "center"

};

tituloTotal.fill = {

    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "0B5D74" }

};

worksheet.getCell(filaSubtitulos, columna).value = "Requerido";
worksheet.getCell(filaSubtitulos, columna + 1).value = "Reclutado";
worksheet.getCell(filaSubtitulos, columna + 2).value = "% avance";

for (let i = 0; i < 3; i++) {

    const celda = worksheet.getCell(
        filaSubtitulos,
        columna + i
    );

    celda.font = {

        bold: true,
        color: { argb: "FFFFFF" }

    };

    celda.alignment = {

        horizontal: "center"

    };

    celda.fill = {

        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "2F7D94" }

    };

}

//=====================================
// FUNCIONES AUXILIARES
//=====================================

//------------------------------
// REQUERIDOS
//------------------------------

const obtenerRequeridos = (ciudad, rol) => {

    return vacantes
        .filter(v =>
            v.indicador === ciudad &&
            v.rol === rol
        )
        .reduce(
            (t, v) => t + Number(v.num_expertos || 0),
            0
        );

};

//------------------------------
// RECLUTADOS
//------------------------------

const obtenerReclutados = (ciudad, rol) => {

    const dato = reclutados.find(r =>

        String(r.eje).trim() === String(ciudad).trim() &&
        String(r.rol).trim() === String(rol).trim()

    );

    return dato ? Number(dato.reclutados) : 0;

};

//------------------------------
// PORCENTAJE
//------------------------------

const calcularPorcentaje = (requeridos, reclutados) => {

    if (Number(requeridos) === 0) return 0;

    return Number(reclutados) / Number(requeridos);

};

//------------------------------
// TOTAL RECLUTADOS POR ROL
//------------------------------

const obtenerTotalReclutadosRol = (rol) => {

    return reclutados
        .filter(r => String(r.rol).trim() === String(rol).trim())
        .reduce(
            (t, r) => t + Number(r.reclutados || 0),
            0
        );

};

//=====================================
// DATOS DE LA TABLA
//=====================================

let fila = 11;

ciudades.forEach((ciudad) => {

    let columna = 1;

    worksheet.getCell(fila, columna).value = ciudad;

    columna++;

    let totalRequeridosCiudad = 0;
    let totalReclutadosCiudad = 0;

    roles.forEach((rol) => {

        const requeridos = obtenerRequeridos(ciudad, rol);
        const reclutadosRol = obtenerReclutados(ciudad, rol);

        totalRequeridosCiudad += requeridos;
        totalReclutadosCiudad += reclutadosRol;

        worksheet.getCell(fila, columna).value = requeridos;
        columna++;

        worksheet.getCell(fila, columna).value = reclutadosRol;
        columna++;

        const porcentaje = calcularPorcentaje(
            requeridos,
            reclutadosRol
        );

        worksheet.getCell(fila, columna).value = porcentaje;
        worksheet.getCell(fila, columna).numFmt = "0.0%";
        columna++;

    });

    worksheet.getCell(fila, columna).value = totalRequeridosCiudad;
    columna++;

    worksheet.getCell(fila, columna).value = totalReclutadosCiudad;
    columna++;

    worksheet.getCell(fila, columna).value =
        calcularPorcentaje(
            totalRequeridosCiudad,
            totalReclutadosCiudad
        );

    worksheet.getCell(fila, columna).numFmt = "0.0%";

    fila++;

});

