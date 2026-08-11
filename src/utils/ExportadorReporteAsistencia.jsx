import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

/* =========================================
   EXPORTAR REPORTE DE ASISTENCIA
========================================= */

export async function exportarReporteAsistencia(
    reportes,
    tipo = "experto",
    usuario = ""
) {

    try {

        if (!reportes || reportes.length === 0) {

            alert("No hay información para exportar.");

            return;
        }

        const workbook = new ExcelJS.Workbook();

        const worksheet = workbook.addWorksheet(
            "Reporte de asistencia"
        );

        /* =========================================
           FECHA Y HORA DE DESCARGA
        ========================================= */

        const fechaDescarga = new Date();

        const fechaHoraDescarga =
            new Intl.DateTimeFormat("es-CO", {
                timeZone: "America/Bogota",
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true,
            }).format(fechaDescarga);


        /* =========================================
           TÍTULO
        ========================================= */

        worksheet.mergeCells("A1:J1");

        const titulo = worksheet.getCell("A1");

        titulo.value =
            tipo === "total"
                ? "INFORME TOTAL DE ASISTENCIAS"
                : "INFORME DE ASISTENCIAS - EXPERTO SELECCIONADO";

        titulo.font = {
            bold: true,
            size: 16,
        };

        titulo.alignment = {
            horizontal: "center",
            vertical: "middle",
        };

        worksheet.getRow(1).height = 28;


        /* =========================================
           INFORMACIÓN DE DESCARGA
        ========================================= */

        worksheet.mergeCells("A2:J2");

        const informacionDescarga =
            worksheet.getCell("A2");

        informacionDescarga.value =
            `Fecha y hora de descarga: ${fechaHoraDescarga}`;

        informacionDescarga.font = {
            size: 11,
            italic: true,
            color: {
                argb: "FF555555",
            },
        };

        informacionDescarga.alignment = {
            horizontal: "left",
            vertical: "middle",
        };


        worksheet.mergeCells("A3:J3");

        const usuarioDescarga =
            worksheet.getCell("A3");

        usuarioDescarga.value =
            `Usuario que descarga: ${usuario || "-"}`;

        usuarioDescarga.font = {
            size: 11,
            italic: true,
            color: {
                argb: "FF555555",
            },
        };

        usuarioDescarga.alignment = {
            horizontal: "left",
            vertical: "middle",
        };


        worksheet.getRow(2).height = 20;
        worksheet.getRow(3).height = 20;


        /* =========================================
           ENCABEZADOS
        ========================================= */

        const encabezados = [
            "Tipo de reporte",
            "Fecha",
            "Documento",
            "Nombre del experto",
            "Ciudad",
            "Rol",
            "Jornada",
            "Observaciones",
            "Responsable",
            "Fecha registro",
        ];

        worksheet.addRow(encabezados);

        const filaEncabezado = worksheet.getRow(4);

        filaEncabezado.font = {
            bold: true,
            color: {
                argb: "FFFFFFFF",
            },
        };

        filaEncabezado.alignment = {
            horizontal: "center",
            vertical: "middle",
            wrapText: true,
        };

        filaEncabezado.eachCell((cell) => {

            cell.fill = {
                type: "pattern",
                pattern: "solid",
                fgColor: {
                    argb: "FF0B5F7D",
                },
            };

            cell.border = {
                top: {
                    style: "thin",
                },
                bottom: {
                    style: "thin",
                },
                left: {
                    style: "thin",
                },
                right: {
                    style: "thin",
                },
            };

        });

        filaEncabezado.height = 30;


        /* =========================================
           DATOS
        ========================================= */

        reportes.forEach((reporte) => {

            const fila = worksheet.addRow([

                reporte.tipo_reporte || "",

                reporte.fecha || "",

                // Documento como número real de Excel
                reporte.documento
                    ? Number(reporte.documento)
                    : "",

                reporte.nombre || "",

                reporte.ciudad || "",

                reporte.rol || "",

                reporte.jornada || "",

                reporte.observaciones || "",

                reporte.responsable_reporte || "",

                reporte.fecha_registro
                    ? new Date(
                        reporte.fecha_registro
                    ).toLocaleString("es-CO", {
                        timeZone: "America/Bogota",
                    })
                    : "",

            ]);


            /* =========================================
               FORMATO DOCUMENTO
            ========================================= */

            const celdaDocumento = fila.getCell(3);

            if (
                reporte.documento !== null &&
                reporte.documento !== undefined &&
                reporte.documento !== ""
            ) {

                celdaDocumento.value =
                    Number(reporte.documento);

                celdaDocumento.numFmt = "0";

            }

        });


        /* =========================================
           FORMATO DE DATOS
        ========================================= */

        worksheet.eachRow((row, rowNumber) => {

            if (rowNumber > 4) {

                row.alignment = {
                    vertical: "top",
                    wrapText: true,
                };

                row.eachCell((cell) => {

                    cell.border = {
                        bottom: {
                            style: "thin",
                            color: {
                                argb: "FFD9D9D9",
                            },
                        },
                    };

                });

            }

        });


        /* =========================================
           ANCHOS
        ========================================= */

        worksheet.columns = [

            {
                width: 20,
            },

            {
                width: 14,
            },

            {
                width: 16,
            },

            {
                width: 32,
            },

            {
                width: 18,
            },

            {
                width: 30,
            },

            {
                width: 20,
            },

            {
                width: 45,
            },

            {
                width: 22,
            },

            {
                width: 24,
            },

        ];


        /* =========================================
           FILTROS DE EXCEL
        ========================================= */

        worksheet.autoFilter = {
            from: "A4",
            to: "J4",
        };


        /* =========================================
           CONGELAR ENCABEZADO
        ========================================= */

        worksheet.views = [
            {
                state: "frozen",
                ySplit: 4,
            },
        ];


        /* =========================================
           GENERAR ARCHIVO
        ========================================= */

        const buffer =
            await workbook.xlsx.writeBuffer();


        const fechaArchivo =
            new Date()
                .toISOString()
                .slice(0, 10);


        const nombreArchivo =
            tipo === "total"
                ? `Informe_Total_Asistencias_${fechaArchivo}.xlsx`
                : `Informe_Asistencias_Experto_${fechaArchivo}.xlsx`;


        saveAs(

            new Blob(
                [buffer],
                {
                    type:
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                }
            ),

            nombreArchivo

        );

    } catch (error) {

        console.error(
            "Error al exportar reporte de asistencia:",
            error
        );

        alert(
            "No fue posible generar el archivo Excel."
        );

    }

}