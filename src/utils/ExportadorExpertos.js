import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import Logo from "../assets/logo.png";

export async function exportarExpertos(expertos = []) {

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Expertos");

    // =========================
    // LOGO
    // =========================

    const response = await fetch(Logo);
    const logoBlob = await response.blob();

    const reader = new FileReader();

    const base64Logo = await new Promise((resolve) => {
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(logoBlob);
    });

    const logoId = workbook.addImage({
        base64: base64Logo,
        extension: "png"
    });

    worksheet.addImage(logoId, {
        tl: {
            col: 0.1,
            row: 0.2
        },
        ext: {
            width: 70,
            height: 70
        }
    });

    // =========================
    // TÍTULOS
    // =========================

    worksheet.mergeCells("C2:F2");

    worksheet.getCell("C2").value =
        "UNIVERSIDAD LIBRE";

    worksheet.getCell("C2").font = {
        bold: true,
        size: 18
    };

    worksheet.getCell("C2").alignment = {
        horizontal: "center"
    };

    worksheet.mergeCells("C3:F3");

    worksheet.getCell("C3").value =
        "BASE DE EXPERTOS REGISTRADOS";

    worksheet.getCell("C3").font = {
        bold: true,
        size: 14
    };

    worksheet.getCell("C3").alignment = {
        horizontal: "center"
    };

    // =========================
    // FECHA Y TOTAL
    // =========================

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

    worksheet.getCell("A6").value = "Fecha de generación:";
    worksheet.getCell("B6").value = fechaBogota;

    worksheet.getCell("D6").value = "Total de expertos:";
    worksheet.getCell("E6").value = expertos.length;

    ["A6", "D6"].forEach((celda) => {
        worksheet.getCell(celda).font = {
            bold: true
        };
    });

    // =========================
    // COLUMNAS
    // =========================

    worksheet.columns = [
    { key: "id", width: 18 },
    { key: "nombre", width: 40 },
    { key: "correo", width: 35 },
    { key: "telefono", width: 18 },
    { key: "telefono_2", width: 18 },
    { key: "perfil_profesional", width: 70 },
    { key: "nivel_academico", width: 28 }
];

    worksheet.getRow(8).values = [
    "Documento",
    "Nombre",
    "Correo",
    "Teléfono",
    "Teléfono 2",
    "Perfil profesional",
    "Nivel académico"
];

    worksheet.getRow(8).height = 25;

    worksheet.getRow(8).eachCell((cell) => {

        cell.font = {
            bold: true,
            color: {
                argb: "FFFFFFFF"
            }
        };

        cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: {
                argb: "1F4E78"
            }
        };

        cell.alignment = {
            horizontal: "center",
            vertical: "middle"
        };

        cell.border = {
            top: {
                style: "thin"
            },
            left: {
                style: "thin"
            },
            bottom: {
                style: "thin"
            },
            right: {
                style: "thin"
            }
        };

    });

    // =========================
    // DATOS
    // =========================

    expertos.forEach((exp) => {

        worksheet.addRow({

            id: exp.id,

            nombre: exp.nombre,

            correo: exp.correo,

            telefono: exp.telefono,

            telefono_2: exp.telefono_2,

            perfil_profesional: exp.perfil_profesional,

            nivel_academico: exp.nivel_academico

        });

    });

    // =========================
    // FORMATO FILAS
    // =========================

    worksheet.eachRow((row, rowNumber) => {

        if (rowNumber >= 9) {

            row.height = 55;

            row.alignment = {
                vertical: "top",
                wrapText: true
            };

            row.eachCell((cell) => {

                cell.border = {
                    top: {
                        style: "thin"
                    },
                    left: {
                        style: "thin"
                    },
                    bottom: {
                        style: "thin"
                    },
                    right: {
                        style: "thin"
                    }
                };

            });

        }

    });

    // =========================
    // CONGELAR ENCABEZADO
    // =========================

    worksheet.views = [
        {
            state: "frozen",
            ySplit: 8
        }
    ];

    // =========================
    // EXPORTAR
    // =========================

    const buffer =
        await workbook.xlsx.writeBuffer();

    const excelBlob = new Blob(
        [buffer],
        {
            type:
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        }
    );

    saveAs(
        excelBlob,
        `Base_Expertos_${fechaBogota.replace(/[/:]/g, "-")}.xlsx`
    );

}

