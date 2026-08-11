import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

/* =========================================
   EXPORTAR REPORTE DE ASISTENCIA
========================================= */

export async function exportarReporteAsistencia(
    reportes,
    tipo = "experto"
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

        const filaEncabezado = worksheet.getRow(2);

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

            worksheet.addRow([
                reporte.tipo_reporte || "",
                reporte.fecha || "",
                reporte.documento || "",
                reporte.nombre || "",
                reporte.ciudad || "",
                reporte.rol || "",
                reporte.jornada || "",
                reporte.observaciones || "",
                reporte.responsable_reporte || "",
                reporte.fecha_registro
                    ? new Date(
                          reporte.fecha_registro
                      ).toLocaleString("es-CO")
                    : "",
            ]);

        });

        /* =========================================
           FORMATO DE DATOS
        ========================================= */

        worksheet.eachRow((row, rowNumber) => {

            if (rowNumber > 2) {

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
            from: "A2",
            to: "J2",
        };

        /* =========================================
           CONGELAR ENCABEZADO
        ========================================= */

        worksheet.views = [
            {
                state: "frozen",
                ySplit: 2,
            },
        ];

        /* =========================================
           GENERAR ARCHIVO
        ========================================= */

        const buffer = await workbook.xlsx.writeBuffer();

        const fechaArchivo = new Date()
            .toISOString()
            .slice(0, 10);

        const nombreArchivo =
            tipo === "total"
                ? `Informe_Total_Asistencias_${fechaArchivo}.xlsx`
                : `Informe_Asistencias_Experto_${fechaArchivo}.xlsx`;

        saveAs(
            new Blob([buffer], {
                type:
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            }),
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