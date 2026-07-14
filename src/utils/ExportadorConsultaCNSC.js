import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import Logo from "../assets/logo.png";

export async function exportarConsultaCNSC(
    convocatoria,
    datos
) {

    const workbook = new ExcelJS.Workbook();

    const hoja = workbook.addWorksheet("Consulta CNSC");

    // ==========================================
    // LOGO
    // ==========================================

    const response = await fetch(Logo);

    const blob = await response.blob();

    const arrayBuffer = await blob.arrayBuffer();

    const logoId = workbook.addImage({

        buffer: arrayBuffer,

        extension: "png"

    });

    hoja.addImage(

        logoId,

        {

            tl: { col: 0.3, row: 0.3 },

            ext: {

                width: 260,

                height: 75

            }

        }

    );

    // ==========================================
    // TITULO
    // ==========================================

    hoja.mergeCells("A5:G5");

    const titulo = hoja.getCell("A5");

    titulo.value = "CONSULTA CNSC";

    titulo.font = {

        bold: true,

        size: 18,

        color: {

            argb: "0B5D74"

        }

    };

    titulo.alignment = {

        horizontal: "center"

    };

    // ==========================================
    // CONVOCATORIA
    // ==========================================

    hoja.getCell("A7").value = "Convocatoria:";

    hoja.getCell("A7").font = {

        bold: true

    };

    hoja.getCell("B7").value = convocatoria;

    // ==========================================
    // FECHA DE GENERACIÓN
    // ==========================================

    hoja.getCell("A8").value = "Fecha de generación:";

    hoja.getCell("A8").font = {

        bold: true

    };

    hoja.getCell("B8").value = new Date().toLocaleDateString("es-CO");

    // ==========================================
    // ENCABEZADOS
    // ==========================================

    const filaInicio = 10;

    const encabezados = [

        "#",
        "Proceso de selección",
        "Fecha de novedad",
        "Tipo de novedad",
        "Ciudad de aplicación",
        "Rol",
        "Nombre del experto"

    ];

    encabezados.forEach((titulo, index) => {

        const celda = hoja.getCell(filaInicio, index + 1);

        celda.value = titulo;

        celda.font = {

            bold: true,

            color: {

                argb: "FFFFFF"

            }

        };

        celda.fill = {

            type: "pattern",

            pattern: "solid",

            fgColor: {

                argb: "0B5D74"

            }

        };

        celda.alignment = {

            horizontal: "center",

            vertical: "middle"

        };

        celda.border = {

            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" }

        };

    });

    // ==========================================
    // DATOS
    // ==========================================

    datos.forEach((fila, index) => {

        const numeroFila = filaInicio + 1 + index;

        hoja.getCell(numeroFila, 1).value = index + 1;

        hoja.getCell(numeroFila, 2).value = fila.convocatoria;

        hoja.getCell(numeroFila, 3).value =
            new Date(fila.fecha_creacion).toLocaleDateString("es-CO");

        hoja.getCell(numeroFila, 4).value = fila.tipo_novedad;

        hoja.getCell(numeroFila, 5).value = fila.eje;

        hoja.getCell(numeroFila, 6).value = fila.rol;

        hoja.getCell(numeroFila, 7).value = fila.nombre;

        for (let columna = 1; columna <= 7; columna++) {

            const celda = hoja.getCell(numeroFila, columna);

            celda.border = {

                top: { style: "thin" },
                bottom: { style: "thin" },
                left: { style: "thin" },
                right: { style: "thin" }

            };

            celda.alignment = {

                vertical: "middle",

                horizontal: columna === 1 ? "center" : "left",

                wrapText: true

            };

        }

    });

    // ==========================================
    // ANCHOS DE COLUMNAS
    // ==========================================

    hoja.columns = [

        { width: 8 },     // #
        { width: 40 },    // Proceso
        { width: 18 },    // Fecha
        { width: 18 },    // Tipo
        { width: 22 },    // Ciudad
        { width: 35 },    // Rol
        { width: 42 }     // Nombre

    ];

    // ==========================================
    // GENERAR ARCHIVO
    // ==========================================

    const buffer = await workbook.xlsx.writeBuffer();

    saveAs(

        new Blob([buffer]),

        `Consulta CNSC - ${convocatoria}.xlsx`

    );

}