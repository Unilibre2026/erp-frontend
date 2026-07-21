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

    const worksheet = workbook.addWorksheet(
        "Aspirantes"
    );

    //===========================
    // CARGAR LOGO
    //===========================

    const response = await fetch(Logo);

    const blob = await response.blob();

    const logoBuffer = await blob.arrayBuffer();

    const logoId = workbook.addImage({

        buffer: logoBuffer,

        extension: "png"

    });

}