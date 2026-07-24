import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import Logo from "../assets/logo.png";

export async function exportarConsolidado(
    convocatoria,
    roles = [],
    vacantes = [],
    reclutados = []
) {

    const workbook = new ExcelJS.Workbook();

    workbook.creator = "ERP Universidad Libre";
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet("Consolidado");

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

if (!Array.isArray(roles)) roles = [];

if (!Array.isArray(vacantes)) vacantes = [];

if (!Array.isArray(reclutados)) reclutados = [];

//=====================================
// ANCHO DE COLUMNAS
//=====================================

const columnas = [];

roles.forEach(() => {

    columnas.push({ width: 16 }); // Requerido
    columnas.push({ width: 16 }); // Reclutado
    columnas.push({ width: 16 }); // % Avance

});

columnas.push({ width: 16 });
columnas.push({ width: 16 });
columnas.push({ width: 16 });

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

worksheet.getCell("B3").value = "CONSULTA AVANCE GENERAL - CONSOLIDADO";

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

//=====================================
// ENCABEZADOS DE LA TABLA
//=====================================

const filaRoles = 8;
const filaTitulos = 9;

let columna = 1;

roles.forEach((rol) => {

    worksheet.mergeCells(filaRoles, columna, filaRoles, columna + 2);

    const celdaRol = worksheet.getCell(filaRoles, columna);

    celdaRol.value = rol;

    celdaRol.font = {
        bold: true,
        color: { argb: "FFFFFFFF" }
    };

    celdaRol.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "0B5D74" }
    };

    celdaRol.alignment = {
        horizontal: "center",
        vertical: "middle"
    };

    worksheet.getCell(filaTitulos, columna).value = "Requerido";
    worksheet.getCell(filaTitulos, columna + 1).value = "Reclutado";
    worksheet.getCell(filaTitulos, columna + 2).value = "% Avance";

    for (let i = 0; i < 3; i++) {

        const celda = worksheet.getCell(filaTitulos, columna + i);

        celda.font = { bold: true };

        celda.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "D9EAD3" }
        };

        celda.alignment = {
            horizontal: "center",
            vertical: "middle"
        };

        celda.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            bottom: { style: "thin" },
            right: { style: "thin" }
        };

    }

    columna += 3;

});

//=====================================
// BLOQUE TOTAL
//=====================================

worksheet.mergeCells(filaRoles, columna, filaRoles, columna + 2);

const celdaTotal = worksheet.getCell(filaRoles, columna);

celdaTotal.value = "TOTAL";

celdaTotal.font = {
    bold: true,
    color: { argb: "FFFFFFFF" }
};

celdaTotal.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "7030A0" }
};

celdaTotal.alignment = {
    horizontal: "center",
    vertical: "middle"
};

worksheet.getCell(filaTitulos, columna).value = "Requerido";
worksheet.getCell(filaTitulos, columna + 1).value = "Reclutado";
worksheet.getCell(filaTitulos, columna + 2).value = "% Avance";

for (let i = 0; i < 3; i++) {

    const celda = worksheet.getCell(filaTitulos, columna + i);

    celda.font = { bold: true };

    celda.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "EADCF4" }
    };

    celda.alignment = {
        horizontal: "center",
        vertical: "middle"
    };

    celda.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }
    };

}

//=====================================
// FILA CONSOLIDADA
//=====================================

const filaDatos = 10;

let col = 1;

let totalVacantes = 0;
let totalReclutados = 0;

roles.forEach((rol) => {

    const requerido = vacantes
        .filter(v => v.rol === rol)
        .reduce(
            (total, v) => total + Number(v.num_expertos || 0),
            0
        );

    const reclutado = reclutados
        .filter(
            r =>
                r.convocatoria === convocatoria &&
                r.rol === rol
        )
        .reduce(
            (total, r) => total + Number(r.reclutados || 0),
            0
        );

    const porcentaje =
        requerido > 0
            ? reclutado / requerido
            : 0;

    worksheet.getCell(filaDatos, col).value = requerido;

    worksheet.getCell(filaDatos, col + 1).value = reclutado;

    worksheet.getCell(filaDatos, col + 2).value = porcentaje;

    worksheet.getCell(filaDatos, col + 2).numFmt = "0.0%";

    totalVacantes += requerido;
    totalReclutados += reclutado;

    col += 3;

});

const porcentajeTotal =
    totalVacantes > 0
        ? totalReclutados / totalVacantes
        : 0;

worksheet.getCell(filaDatos, col).value = totalVacantes;

worksheet.getCell(filaDatos, col + 1).value = totalReclutados;

worksheet.getCell(filaDatos, col + 2).value = porcentajeTotal;

worksheet.getCell(filaDatos, col + 2).numFmt = "0.0%";



//=====================================
// FORMATO FILA DE DATOS
//=====================================

for (let c = 1; c <= worksheet.columnCount; c++) {

    const celda = worksheet.getCell(filaDatos, c);

    celda.alignment = {
        horizontal: "center",
        vertical: "middle"
    };

    celda.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" }
    };

}

worksheet.getRow(filaDatos).height = 22;

//=====================================
// GUARDAR EXCEL
//=====================================

const buffer = await workbook.xlsx.writeBuffer();

saveAs(
    new Blob([buffer]),
    `Consolidado_${convocatoria}.xlsx`
);

}