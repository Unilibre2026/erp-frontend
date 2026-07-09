import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export async function exportarAvanceGeneral(
    convocatoria,
    ciudades,
    roles,
    vacantes
) {

    const workbook = new ExcelJS.Workbook();

    workbook.creator = "ERP Universidad Libre";
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet("Avance General");

    //=====================================
    // ANCHO DE COLUMNAS
    //=====================================

    worksheet.columns = [];

    worksheet.columns.push({ width: 25 }); // Ciudad

    roles.forEach(() => {

        worksheet.columns.push({ width: 14 });
        worksheet.columns.push({ width: 14 });
        worksheet.columns.push({ width: 14 });

    });

    worksheet.columns.push({ width: 14 });
    worksheet.columns.push({ width: 14 });
    worksheet.columns.push({ width: 14 });

    //=====================================
    // TITULO
    //=====================================

    const ultimaColumna = worksheet.columnCount;

    worksheet.mergeCells(2, 1, 2, ultimaColumna);

    worksheet.getCell("A2").value = "UNIVERSIDAD LIBRE";

    worksheet.getCell("A2").font = {

        bold: true,
        size: 20,
        color: { argb: "0B5D74" }

    };

    worksheet.getCell("A2").alignment = {

        horizontal: "center"

    };

    //=====================================
    // SUBTITULO
    //=====================================

    worksheet.mergeCells(3, 1, 3, ultimaColumna);

    worksheet.getCell("A3").value = "CONSULTA AVANCE GENERAL";

    worksheet.getCell("A3").font = {

        bold: true,
        size: 16

    };

    worksheet.getCell("A3").alignment = {

        horizontal: "center"

    };

    //=====================================
    // INFORMACIÓN
    //=====================================

    worksheet.getCell("A5").value = "Convocatoria";
    worksheet.getCell("B5").value = convocatoria;

    worksheet.getCell("A6").value = "Fecha";
    worksheet.getCell("B6").value = new Date();
    worksheet.getCell("B6").numFmt = "dd/mm/yyyy hh:mm";

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

    let columna = 1;

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

const obtenerCantidad = (ciudad, rol) => {

    return vacantes
        .filter(v =>

            v.indicador === ciudad &&
            v.rol === rol

        )
        .reduce(

            (total, v) => total + Number(v.num_expertos || 0),

            0

        );

};

const obtenerTotalCiudad = (ciudad) => {

    return vacantes
        .filter(v => v.indicador === ciudad)
        .reduce(

            (total, v) => total + Number(v.num_expertos || 0),

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

    roles.forEach((rol) => {

        worksheet.getCell(fila, columna).value =
            obtenerCantidad(ciudad, rol);

        columna++;

        worksheet.getCell(fila, columna).value = 0;

        columna++;

        worksheet.getCell(fila, columna).value = "0,0%";

        columna++;

    });

    worksheet.getCell(fila, columna).value =
        obtenerTotalCiudad(ciudad);

    columna++;

    worksheet.getCell(fila, columna).value = 0;

    columna++;

    worksheet.getCell(fila, columna).value = "0,0%";

    fila++;

});

    //=====================================
    // GUARDAR
    //=====================================

    const buffer = await workbook.xlsx.writeBuffer();

    saveAs(
        new Blob([buffer]),
        "Consulta_Avance_General.xlsx"
    );

}