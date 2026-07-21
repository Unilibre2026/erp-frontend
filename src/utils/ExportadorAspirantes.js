import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import Logo from "../assets/logo.png";

export async function exportarAspirantes(
    convocatoria,
    datos = []
) {

    const workbook = new ExcelJS.Workbook();

    workbook.creator = "ERP Universidad Libre";
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet("Aspirantes");

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
    // ANCHO DE COLUMNAS
    //=====================================

    worksheet.columns = [
        { width: 45 },
        { width: 25 },
        { width: 55 }
    ];

    //=====================================
    // TÍTULO
    //=====================================

    worksheet.mergeCells("B2:C2");

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
    // SUBTÍTULO
    //=====================================

    worksheet.mergeCells("B3:C3");

    worksheet.getCell("B3").value = "ASPIRANTES POR CONVOCATORIA";

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
    // LOGO
    //=====================================

    worksheet.addImage(logoId, {
        tl: {
            col: 0.2,
            row: 0.4
        },
        ext: {
            width: 180,
            height: 68
        }
    });

    //=====================================
    // INFORMACIÓN
    //=====================================

    worksheet.getCell("A5").value = "Convocatoria";
    worksheet.getCell("B5").value = convocatoria;

    const ahora = new Date();

    const fechaBogota = ahora.toLocaleString("es-CO", {
    timeZone: "America/Bogota",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
});

worksheet.getCell("A6").value = "Fecha";
worksheet.getCell("B6").value = fechaBogota;

    //=====================================
    // ENCABEZADOS DE LA TABLA
    //=====================================

    const filaEncabezado = 8;

    const encabezados = [
        "Convocatoria",
        "Documento",
        "Nombre"
    ];

    encabezados.forEach((texto, indice) => {

        const celda = worksheet.getCell(filaEncabezado, indice + 1);

        celda.value = texto;

        celda.font = {
            bold: true,
            color: { argb: "FFFFFF" },
            name: "Calibri"
        };

        celda.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "0B5D74" }
        };

        celda.alignment = {
            horizontal: "center",
            vertical: "middle"
        };

        celda.border = {
            top: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" },
            bottom: { style: "thin" }
        };

    });

    worksheet.getRow(filaEncabezado).height = 22;

    //=====================================
    // REGISTROS
    //=====================================

    datos.forEach((fila) => {

        worksheet.addRow([
            fila.convocatoria,
            fila.documento,
            fila.nombre
        ]);

    });

    //=====================================
    // FORMATO DE LOS REGISTROS
    //=====================================

    worksheet.eachRow((row, rowNumber) => {

        if (rowNumber <= filaEncabezado) return;

        row.eachCell((cell) => {

            cell.font = {
                name: "Calibri",
                size: 11
            };

            cell.border = {
                top: { style: "thin" },
                left: { style: "thin" },
                right: { style: "thin" },
                bottom: { style: "thin" }
            };

            cell.alignment = {
                vertical: "middle"
            };

        });

    });

    //=====================================
    // DESCARGAR ARCHIVO
    //=====================================

    const buffer = await workbook.xlsx.writeBuffer();

    saveAs(
        new Blob([buffer]),
        "Aspirantes_por_Convocatoria.xlsx"
    );

}