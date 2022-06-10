var contElementosAgregados = 0;
var elementosSeleccionados = [];
var urlConexion = "/";
var editarLogo = false;
var idProveedor = "";
var idProducto = "";

$(document).ready(function () {
    //Organizacion de menu lateral
    $(".nav-item").removeClass("active");
    $("#btnEstudiantes").addClass("active");

    cargarDT();
    
});



$(window).on("load", function () {
    $("#loader").removeClass("active");
});

//reiniciar formularios al cerrar las ventanas modales
$(".close").click(function () {
    reiniciarFormulario("formCrearProveedor");
});


function cargarDT() {
    $("#tablaEstudiantes").on("draw.dt", function () {
        $('[data-toggle="tooltip"]').tooltip({
            container: "body",
        });
    });

    var table = $("#tablaEstudiantes").DataTable({
        lengthMenu: [[10, 25, 50, -1],[10, 25, 50, "Todos"]],
        language: {url: "//cdn.datatables.net/plug-ins/1.10.6/i18n/Spanish.json"},
        serverSide: true,
        processing:true,
        ajax: {
            url: urlConexion + "estudiantesRoute/estudiantesDT",
            type: "POST",
        },
        columns: [
            {
                data: "nombres",
                orderable: true,
                searchable: true,
            },
            {
                data: "documento",
                orderable: true,
                searchable: true,
            },
            {
                data: "municipios",
                orderable: true,
                searchable: true,
            },
            {
                data: "colegio",
                orderable: true,
                searchable: true,
            },
            {
                data: "grado",
                orderable: true,
                searchable: true,
            },
            {
                data: "telefono",
                orderable: true,
                searchable: true,
            },
            {
                data: "email",
                orderable: true,
                searchable: true,
            },
            {
                data: "tyc",
                orderable: true,
                searchable: true,
            },
            {
                data: "fechaPrueba",
                orderable: true,
                searchable: true,
            },
            {
                data: "fechaActualizacion",
                orderable: true,
                searchable: true,
            }

        ],
    });

    $(document)
        .off("keyup", ".buscarColumnaEstudiante")
        .on("keyup", ".buscarColumnaEstudiante", function (e) {
            e.preventDefault();
            var index = $(this).attr("data-index");
            table.column(index).search(this.value).draw();
        });

        $(document)
        .off("change", ".buscarColumnaEstudiante")
        .on("change", ".buscarColumnaEstudiante", function (e) {
            e.preventDefault();
            var index = $(this).attr("data-index");
            table.column(index).search(this.value).draw();
        });
}

