var urlConexion = "/";


$(document).ready(function() 
{
   //Organizacion de menu lateral
   $(".nav-item").removeClass("active");
   $("#btnResultados").addClass("active");
   cargarDT();
});

$(window).on("load", function () {
    $("#loader").removeClass("active");
});

function cargarDT() {
    $("#tablaPruebas").on("draw.dt", function () {
        $('[data-toggle="tooltip"]').tooltip({
            container: "body",
        });
    });

    var table = $("#tablaPruebas").DataTable({
        lengthMenu: [[10, 25, 50, -1],[10, 25, 50, "Todos"]],
        language: {url: "//cdn.datatables.net/plug-ins/1.10.6/i18n/Spanish.json"},
        serverSide: true,
        processing:true,
        ajax: {
            url: urlConexion + "resultadosRoute/pruebasDT",
            type: "POST",
        },
        columns: [
            { 	
                data: null,
                orderable: false,
                render: function (data) 
                {
                    return `
                    <div class="btn-group">
                    <button type="button" class="btn-sm btn btn-success" data-toggle="dropdown" aria-expanded="false">
                        Opciones
                    </button>
                    <div class="dropdown-menu">
                        <a class="dropdown-item btnGenerarResultadoPdf" data-id="${data.idPrueba}" href="#"><i class="mdi mdi-file-pdf"></i>Descargar en pdf</a>
                        <a class="dropdown-item btnVerResultado" data-id="${data.idPrueba}" href="#"><i class="mdi mdi-eye"></i> Ver Resultado</a>
                    </div>
                    </div>
                            `;

                },
            },
            {
                data: null,
                orderable: true,
                searchable: true,
                render: function (data) 
                {
                    switch (data.c) 
                    {
                        case 0:
                            return "Muy bajo";
                        
                            break;
                        case 1:
                            return "Bajo";
                            
                            break;
                        case 2:
                            return "Medio Bajo";
                            
                            break;
                        case 3:
                            return "Medio Alto";
                            
                            break;
                        case 4:
                            return "Alto";
                            
                            break;
                    }
                }
            },
            {
                data: null,
                orderable: true,
                searchable: true,
                render: function (data) 
                {
                    switch (data.h) 
                    {
                        case 0:
                            return "Muy bajo";
                        
                            break;
                        case 1:
                            return "Bajo";
                            
                            break;
                        case 2:
                            return "Medio Bajo";
                            
                            break;
                        case 3:
                            return "Medio Alto";
                            
                            break;
                        case 4:
                            return "Alto";
                            
                            break;
                    }
                }
            },
            {
                data: null,
                orderable: true,
                searchable: true,
                render: function (data) 
                {
                    switch (data.a) 
                    {
                        case 0:
                            return "Muy bajo";
                        
                            break;
                        case 1:
                            return "Bajo";
                            
                            break;
                        case 2:
                            return "Medio Bajo";
                            
                            break;
                        case 3:
                            return "Medio Alto";
                            
                            break;
                        case 4:
                            return "Alto";
                            
                            break;
                    }
                }
            },
            {
                data: null,
                orderable: true,
                searchable: true,
                render: function (data) 
                {
                    switch (data.s) 
                    {
                        case 0:
                            return "Muy bajo";
                        
                            break;
                        case 1:
                            return "Bajo";
                            
                            break;
                        case 2:
                            return "Medio Bajo";
                            
                            break;
                        case 3:
                            return "Medio Alto";
                            
                            break;
                        case 4:
                            return "Alto";
                            
                            break;
                    }
                }
            },
            {
                data: null,
                orderable: true,
                searchable: true,
                render: function (data) 
                {
                    switch (data.i) 
                    {
                        case 0:
                            return "Muy bajo";
                        
                            break;
                        case 1:
                            return "Bajo";
                            
                            break;
                        case 2:
                            return "Medio Bajo";
                            
                            break;
                        case 3:
                            return "Medio Alto";
                            
                            break;
                        case 4:
                            return "Alto";
                            
                            break;
                    }
                }
            },
            {
                data: null,
                orderable: true,
                searchable: true,
                render: function (data) 
                {
                    switch (data.d) 
                    {
                        case 0:
                            return "Muy bajo";
                        
                            break;
                        case 1:
                            return "Bajo";
                            
                            break;
                        case 2:
                            return "Medio Bajo";
                            
                            break;
                        case 3:
                            return "Medio Alto";
                            
                            break;
                        case 4:
                            return "Alto";
                            
                            break;
                    }
                }
            },
            {
                data: null,
                orderable: true,
                searchable: true,
                render: function (data) 
                {
                    switch (data.e) 
                    {
                        case 0:
                            return "Muy bajo";
                        
                            break;
                        case 1:
                            return "Bajo";
                            
                            break;
                        case 2:
                            return "Medio Bajo";
                            
                            break;
                        case 3:
                            return "Medio Alto";
                            
                            break;
                        case 4:
                            return "Alto";
                            
                            break;
                    }
                }
            },
            {
                data: "fecha",
                orderable: true,
                searchable: true,
            }
        ],
    });

    $(document)
        .off("keyup", ".buscarColumnaPruebas")
        .on("keyup", ".buscarColumnaPruebas", function (e) {
            e.preventDefault();
            var index = $(this).attr("data-index");
            table.column(index).search(this.value).draw();
        });

        $(document)
        .off("change", ".buscarColumnaPruebas")
        .on("change", ".buscarColumnaPruebas", function (e) {
            e.preventDefault();
            var index = $(this).attr("data-index");
            table.column(index).search(this.value).draw();
        });
}


$(document).off("click", ".btnVerResultado").on("click", ".btnVerResultado", function(e)
{
    var idPrueba = $(this).attr("data-id");
	$("#loader").addClass("active");
	Query.callAjax(
		"resultadosRoute/verResultado",
		"POST",
		{idPrueba: idPrueba},
		function(resultado)
		{
			
            window.open("/resultadoRoute", "_self");
            $("#loader").removeClass("active");
		},
		function(error)
		{
			$("#loader").removeClass("active");
            
			swal("", error, "error");
		}
    )
})

$(document).off("click", ".btnGenerarResultadoPdf").on("click", ".btnGenerarResultadoPdf", function(e)
{
    var idPrueba = $(this).attr("data-id");
	$("#loader").addClass("active");
	Query.callAjax(
		"resultadosRoute/generarPdf",
		"POST",
		{idPrueba: idPrueba},
		function(resultado)
		{
	        $('#btnVerEmailResultadoPdf').tooltip({
	            container: 'body'
	        });
			$("html").css('overflow','hidden');
			$('#mensajeEmail').summernote({placeholder: 'Mensaje...',height: 135, minHeight: null, maxHeight: null});
			var table = $("#tablaVentas").DataTable();
			table.ajax.reload();
			var iframe = `<iframe src="${resultado}" frameborder="0" style="width: 100%; height: 80vh;"></iframe>`;
			$("#divIframeResultadoPdf").html(iframe);
			$("#modalResultadoPdf").modal("show");
			$("#loader").removeClass("active");
		},
		function(error)
		{
			$("#loader").removeClass("active");
			swal("", error, "error");
		}
    )
})

$(document).off("click", "#btnCerrarModalResultadoPdf").on("click", "#btnCerrarModalResultadoPdf", function(e)
{
	$("html").css('overflow','');
	$("#modalResultadoPdf").modal("hide");
	reiniciarFormulario("formEmailResultadoPdf");
})


$(document).off("click", "#btnEnviarEmailResultadoPdf").on("click", "#btnEnviarEmailResultadoPdf", function(e)
{
	$("#loader").addClass("active");
	//Validamos el formulario
	validarFormulario("formEmailResultadoPdf", function()
	{
		$("#loader").removeClass("active");
		var errores = $("#formEmailResultadoPdf").find(".errorValidacion");

		if(errores.length == 0)
		{
			var datos = new FormData(document.getElementById("formEmailResultadoPdf"));
			$("#loader").addClass("active");
			QueryForm.callAjax(
				"resultadosRoute/enviarEmail",
				"POST",
				datos,
				function(resultado)
				{
					$("html").css('overflow','');
					$("#modalResultadoPdf").modal("hide");
					reiniciarFormulario("formEmailResultadoPdf");
					$("#loader").removeClass("active");
					swal("", "Resultados de la prueba enviado con exito", "success");
					$('#mensajeEmail').summernote('destroy');
					$('#mensajeEmail').summernote({placeholder: 'Mensaje...',height: 135, minHeight: null, maxHeight: null});
				},
				function(error)
				{
					swal("", "Hubo un error intente nuevamente", "error");
					$("#loader").removeClass("active");
				}
		    )
		}
	})
})

function reiniciarFormulario(form)
{
  var formInputs = "form#"+form+" :input";

  $(formInputs).each(function()
  {
    var input = $(this);
    var inputValue = input.val("");
  })
}


//VALIDACION DE FORMULARIOS

function validarFormulario(form, callback)
{
	$(".errorValidacion").remove();

	var formInputs = "form#"+form+" :input";
	var cantidadInputs = $(formInputs).length;

	//Variable que cuenta el numero de los inputs que pasaron por la validacion
	var inputsValidados = 0;

	//Validaciones
	$(formInputs).each(function()
	{
		var input = $(this);
		var inputType = input.attr('type');
		var inputValue = input.val();
		var idInput = input.attr('id');

        validarCampoVacio(inputValue, idInput);

		if(inputType == "email")
		{
			validarEmail(inputValue, idInput);
		}

		if(inputType == "text")
		{
			alphanumeric(inputValue, idInput);
		}

		inputsValidados++;

		//Respondemos cuando ya se han validado todos los input
		if(inputsValidados == cantidadInputs)
		{
			callback();
		}
	})

}


function validarEmail(inputValue, idInput)
{
	if(inputValue != "")
	{
		var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;

		var validacionEmail = regex.test(inputValue);

		idInput = "#"+idInput;

		if(validacionEmail == false)
		{
			$(idInput).parent().append('<label class="errorValidacion">El email no es valido</label>');
		}
	}
}

function validarCampoVacio(inputValue, idInput)
{
	idInput = "#"+idInput;

	if(inputValue == "" || inputValue == null)
	{		
		$(idInput).parent().append('<label class="errorValidacion">El campo no puede estar vacio</label>');
		return true;
	}
	return false;
}

function alphanumeric(inputValue, idInput)
{ 
	idInput = "#"+idInput;
	var errores = $(idInput).parent().find( ".errorValidacion" );

	if(errores.length == 0)
	{
		if(inputValue != ""){

			var letters = /^[0-9a-zñA-ZÀ-ú#\d\s-]+$/;
			if(inputValue.match(letters))
			{
				$(idInput).parent().find( ".errorValidacion" ).remove();
			}
			else
			{
				$(idInput).parent().append('<label class="errorValidacion">No se aceptan caracteres especiales</label>');
			}

		}
	}
}
