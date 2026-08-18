import { useEffect, useState } from "react";
import "./IncluirPresupuesto.css";

const API_URL = "https://erp-unilibre-production.up.railway.app";

export default function IncluirPresupuesto() {

  const [presupuesto, setPresupuesto] = useState([]);
  const [convocatorias, setConvocatorias] = useState([]);
  const [roles, setRoles] = useState([]);

  const [convocatoriaFiltro, setConvocatoriaFiltro] = useState("");
  const [rolFiltro, setRolFiltro] = useState("");

  const [archivo, setArchivo] = useState(null);
  const [cargando, setCargando] = useState(false);

  // =========================
  // CARGAR PRESUPUESTO
  // =========================

  const cargarPresupuesto = async () => {

    try {

      const response = await fetch(
        `${API_URL}/presupuesto`
      );

      if (!response.ok) {
        throw new Error("No se pudo consultar el presupuesto");
      }

      const data = await response.json();

      setPresupuesto(data);

    } catch (error) {

      console.error(error);

      alert(
        "No fue posible consultar el presupuesto."
      );
    }
  };

  // =========================
  // CARGAR CONVOCATORIAS
  // =========================

  const cargarConvocatorias = async () => {

    try {

      const response = await fetch(
        `${API_URL}/convocatorias`
      );

      if (!response.ok) {
        throw new Error(
          "No se pudieron consultar las convocatorias"
        );
      }

      const data = await response.json();

      setConvocatorias(data);

    } catch (error) {

      console.error(error);
    }
  };

  // =========================
  // CARGAR ROLES
  // =========================

  const cargarRoles = async () => {

    try {

      const response = await fetch(
        `${API_URL}/roles`
      );

      if (!response.ok) {
        throw new Error(
          "No se pudieron consultar los roles"
        );
      }

      const data = await response.json();

      setRoles(data);

    } catch (error) {

      console.error(error);
    }
  };

  // =========================
  // CARGA INICIAL
  // =========================

  useEffect(() => {

    cargarPresupuesto();
    cargarConvocatorias();
    cargarRoles();

  }, []);

  // =========================
  // FILTROS
  // =========================

  const presupuestoFiltrado = presupuesto.filter(
    (item) => {

      const coincideConvocatoria =
        !convocatoriaFiltro ||
        item.convocatoria === convocatoriaFiltro;

      const coincideRol =
        !rolFiltro ||
        item.rol === rolFiltro;

      return (
        coincideConvocatoria &&
        coincideRol
      );
    }
  );

  // =========================
  // ROLES FILTRADOS
  // =========================

  const rolesFiltrados = roles.filter(
    (item) => {

      if (!convocatoriaFiltro) {
        return true;
      }

      return (
        item.convocatoria === convocatoriaFiltro
      );
    }
  );

  // =========================
  // FORMATO MONEDA
  // =========================

  const formatoMoneda = (valor) => {

    if (
      valor === null ||
      valor === undefined ||
      valor === ""
    ) {
      return "$ 0";
    }

    return Number(valor).toLocaleString(
      "es-CO",
      {
        style: "currency",
        currency: "COP",
        maximumFractionDigits: 0
      }
    );
  };

  // =========================
  // FORMATO FECHA
  // =========================

  const formatoFecha = (fecha) => {

    if (!fecha) {
      return "";
    }

    const fechaLocal =
      new Date(`${fecha}T00:00:00`);

    return fechaLocal.toLocaleDateString(
      "es-CO"
    );
  };

  // =========================
  // SELECCIONAR ARCHIVO
  // =========================

  const seleccionarArchivo = (event) => {

    const file =
      event.target.files[0];

    setArchivo(file || null);
  };

  // =========================
  // CARGAR EXCEL
  // =========================

  const cargarExcel = async () => {

    if (!archivo) {

      alert(
        "Selecciona un archivo Excel."
      );

      return;
    }

    setCargando(true);

    try {

      const formData =
        new FormData();

      formData.append(
        "file",
        archivo
      );

      const response = await fetch(
        `${API_URL}/presupuesto/cargar`,
        {
          method: "POST",
          body: formData
        }
      );

      const data =
        await response.json();

      if (!response.ok) {

        throw new Error(
          data.detail ||
          "Error cargando el archivo"
        );
      }

      alert(
        `${data.mensaje}. Registros cargados: ${data.insertados}`
      );

      setArchivo(null);

      document.getElementById(
        "archivo-presupuesto"
      ).value = "";

      await cargarPresupuesto();

    } catch (error) {

      console.error(error);

      alert(
        error.message ||
        "No fue posible cargar el archivo."
      );

    } finally {

      setCargando(false);
    }
  };

  // =========================
  // ELIMINAR REGISTRO
  // =========================

  const eliminarRegistro = async (id) => {

    const confirmar =
      window.confirm(
        "¿Está seguro de eliminar este registro?"
      );

    if (!confirmar) {
      return;
    }

    try {

      const response =
        await fetch(
          `${API_URL}/presupuesto/${id}`,
          {
            method: "DELETE"
          }
        );

      const data =
        await response.json();

      if (!response.ok) {

        throw new Error(
          data.detail ||
          "No se pudo eliminar el registro"
        );
      }

      alert(
        data.mensaje
      );

      await cargarPresupuesto();

    } catch (error) {

      console.error(error);

      alert(
        error.message ||
        "No fue posible eliminar el registro."
      );
    }
  };

  // =========================
  // EXPORTAR EXCEL
  // =========================

  const exportarExcel = async (
    exportarTodo = false
  ) => {

    const datosExportar =
      exportarTodo
        ? presupuesto
        : presupuestoFiltrado;

    if (
      datosExportar.length === 0
    ) {

      alert(
        "No hay registros para exportar."
      );

      return;
    }

    try {

      const ExcelJS =
        await import("exceljs");

      const workbook =
        new ExcelJS.Workbook();

      const worksheet =
        workbook.addWorksheet(
          "Presupuesto"
        );

      worksheet.columns = [
        {
          header: "ID",
          key: "id",
          width: 10
        },
        {
          header: "Convocatoria",
          key: "convocatoria",
          width: 40
        },
        {
          header: "Código prueba",
          key: "codigo_prueba",
          width: 25
        },
        {
          header: "Rol",
          key: "rol",
          width: 40
        },
        {
          header: "Cantidad requerida",
          key: "cantidad_requerida",
          width: 20
        },
        {
          header: "Fecha",
          key: "fecha",
          width: 15
        },
        {
          header: "Valor rol",
          key: "valor_rol",
          width: 18
        },
        {
          header: "Total",
          key: "total",
          width: 18
        }
      ];

      datosExportar.forEach(
        (item) => {

          worksheet.addRow({
            id: item.id,
            convocatoria:
              item.convocatoria,
            codigo_prueba:
              item.codigo_prueba,
            rol: item.rol,
            cantidad_requerida:
              item.cantidad_requerida,
            fecha:
              item.fecha,
            valor_rol:
              Number(item.valor_rol || 0),
            total:
              Number(item.total || 0)
          });
        }
      );

      worksheet.getRow(1).font = {
        bold: true
      };

      worksheet.eachRow(
        (row, rowNumber) => {

          if (rowNumber > 1) {

            row.getCell(6).numFmt =
              "dd/mm/yyyy";

            row.getCell(7).numFmt =
              '"$"#,##0';

            row.getCell(8).numFmt =
              '"$"#,##0';
          }
        }
      );

      const buffer =
        await workbook.xlsx.writeBuffer();

      const blob =
        new Blob(
          [buffer],
          {
            type:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          }
        );

      const url =
        window.URL.createObjectURL(
          blob
        );

      const link =
        document.createElement("a");

      link.href = url;

      link.download =
        exportarTodo
          ? "Presupuesto_completo.xlsx"
          : "Presupuesto_consulta.xlsx";

      link.click();

      window.URL.revokeObjectURL(
        url
      );

    } catch (error) {

      console.error(error);

      alert(
        "No fue posible generar el archivo Excel."
      );
    }
  };

  // =========================
  // RENDER
  // =========================

  return (

    <div className="incluir-presupuesto">

      <div className="presupuesto-header">

        <h2>
          Incluir presupuesto
        </h2>

        <p>
          Carga y consulta del presupuesto
          por convocatoria y rol.
        </p>

      </div>


      {/* =========================
          CARGA EXCEL
      ========================= */}

      <div className="presupuesto-carga">

        <div className="presupuesto-carga-titulo">
          Cargar presupuesto
        </div>

        <div className="presupuesto-carga-contenido">

          <input
            id="archivo-presupuesto"
            type="file"
            accept=".xlsx,.xls"
            onChange={
              seleccionarArchivo
            }
          />

          <button
            type="button"
            className="btn-presupuesto-cargar"
            onClick={cargarExcel}
            disabled={cargando}
          >
            {cargando
              ? "Cargando..."
              : "Cargar Excel"}
          </button>

        </div>

      </div>


      {/* =========================
          FILTROS
      ========================= */}

      <div className="presupuesto-filtros">

        <div className="presupuesto-filtro">

          <label>
            Convocatoria
          </label>

          <select
            value={convocatoriaFiltro}
            onChange={(e) => {

              setConvocatoriaFiltro(
                e.target.value
              );

              setRolFiltro("");
            }}
          >

            <option value="">
              Todas
            </option>

            {convocatorias.map(
              (item) => (

                <option
                  key={item.id}
                  value={
                    item.nombre_convocatoria
                  }
                >
                  {
                    item.nombre_convocatoria
                  }
                </option>

              )
            )}

          </select>

        </div>


        <div className="presupuesto-filtro">

          <label>
            Rol
          </label>

          <select
            value={rolFiltro}
            onChange={(e) =>
              setRolFiltro(
                e.target.value
              )
            }
          >

            <option value="">
              Todos
            </option>

            {rolesFiltrados.map(
              (item) => (

                <option
                  key={item.id}
                  value={item.rol}
                >
                  {item.rol}
                </option>

              )
            )}

          </select>

        </div>

      </div>


      {/* =========================
          BOTONES EXPORTACIÓN
      ========================= */}

      <div className="presupuesto-acciones">

        <button
          type="button"
          className="btn-presupuesto-exportar"
          onClick={() =>
            exportarExcel(false)
          }
        >
          Exportar consulta
        </button>

        <button
          type="button"
          className="btn-presupuesto-exportar"
          onClick={() =>
            exportarExcel(true)
          }
        >
          Exportar todo
        </button>

      </div>


      {/* =========================
          TABLA
      ========================= */}

      <div className="presupuesto-tabla-contenedor">

        <table className="tabla-presupuesto">

          <thead>

            <tr>
              <th>ID</th>
              <th>Convocatoria</th>
              <th>Código prueba</th>
              <th>Rol</th>
              <th>Cantidad</th>
              <th>Fecha</th>
              <th>Valor rol</th>
              <th>Total</th>
              <th>Acción</th>
            </tr>

          </thead>

          <tbody>

            {presupuestoFiltrado.length === 0 ? (

              <tr>

                <td
                  colSpan="9"
                  className="presupuesto-sin-registros"
                >
                  No hay registros para mostrar.
                </td>

              </tr>

            ) : (

              presupuestoFiltrado.map(
                (item) => (

                  <tr key={item.id}>

                    <td>
                      {item.id}
                    </td>

                    <td>
                      {item.convocatoria}
                    </td>

                    <td>
                      {item.codigo_prueba}
                    </td>

                    <td>
                      {item.rol}
                    </td>

                    <td className="presupuesto-numero">
                      {
                        item.cantidad_requerida
                      }
                    </td>

                    <td>
                      {
                        formatoFecha(
                          item.fecha
                        )
                      }
                    </td>

                    <td className="presupuesto-monto">
                      {
                        formatoMoneda(
                          item.valor_rol
                        )
                      }
                    </td>

                    <td className="presupuesto-monto">
                      {
                        formatoMoneda(
                          item.total
                        )
                      }
                    </td>

                    <td>

                      <button
                        type="button"
                        className="btn-presupuesto-eliminar"
                        title="Eliminar registro"
                        onClick={() =>
                          eliminarRegistro(
                            item.id
                          )
                        }
                      >
                        🗑
                      </button>

                    </td>

                  </tr>

                )
              )

            )}

          </tbody>

        </table>

      </div>


      <div className="presupuesto-total-registros">

        Mostrando{" "}
        <strong>
          {presupuestoFiltrado.length}
        </strong>{" "}
        de{" "}
        <strong>
          {presupuesto.length}
        </strong>{" "}
        registros.

      </div>

    </div>
  );
}