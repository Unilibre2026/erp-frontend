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

    worksheet.columns = [

        { width: 22 },

        { width: 18 },

        { width: 18 },

        { width: 18 },

        { width: 18 },

        { width: 18 }

    ];

    //=====================================
    // TITULO
    //=====================================

    worksheet.mergeCells("A2:F2");

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

    worksheet.mergeCells("A3:F3");

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
    // GUARDAR
    //=====================================

    const buffer = await workbook.xlsx.writeBuffer();

    saveAs(

        new Blob([buffer]),

        "Consulta_Avance_General.xlsx"

    );

}