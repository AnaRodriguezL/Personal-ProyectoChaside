var urlConexion = "/";
var respuesta=-1;//limpiar las seleccion de las manitas
var posicionPregunta=0;

$(document).ready(function() 
{
    //Organizacion de menu lateral
    $(".nav-item").removeClass("active");
    $("#btnPrueba").addClass("active");
    cargarTipoDocumentos();
    cargarMunicipios();
    ValidarSoloNumeros(".numero");
    ValidarLetrasEspacio(".textoLetras");
    ValidarTipoCorreo(".email");
});


$(window).on("load", function () {
    $("#loader").removeClass("active");
});


$(document).off("click", "#btnSiguienteQuestion").on("click", "#btnSiguienteQuestion", function (e) {
  
  if(respuesta!=-1){
    Query.callAjax(
      "pruebaRoute/ConsulSiguiente",
      "POST",
      {respuesta:respuesta},
      function(resultado)
      { 
        var resultado = resultado[0];
        $("#loader").removeClass("active");
        $("#pregunta").text(resultado.pregunta);
        $("#imagenPregunta").attr("src","assets/img/preguntas/"+resultado.fotoPregunta);
        $("#negacion").removeClass("likeNegacion");
        $("#afirmacion").removeClass("likeAfirmacion");
        
        
        if(resultado.respuesta!=undefined){

          if(resultado.respuesta==1){
            $("#afirmacion").addClass("likeAfirmacion");
            respuesta=1;
          }
          else{
            $("#negacion").addClass("likeNegacion");
            respuesta=0;
          }

        }else{
          respuesta=-1;
        }
   
        posicionPregunta=resultado.numPregunta;
        var porcentaje=(posicionPregunta*100)/28
        $("#barraProgreso").width(porcentaje+"%");
        
        if(resultado.numPregunta==28){
          $("#btnSiguienteQuestion").slideUp();
          $("#btnFinalizarQuestion").slideDown();
        }
        else{
          $("#btnSiguienteQuestion").slideDown();
        
        }
        if(resultado.numPregunta==1){
          $("#btnAnteriorQuestion").slideUp();
        }
        else{
          $("#btnAnteriorQuestion").slideDown();
        
        }

        $("#squarespaceModal").modal("show");
        
      },
      function(error)
      {
        $("#loader").removeClass("active");
        
        console.log(error);
      }

    )
  }
  else{
    swal(
      "",
      "Debes seleccionar una opción para continuar",
      "warning"
  );
  }
    
});

$(document).off("click", "#btnAnteriorQuestion").on("click", "#btnAnteriorQuestion", function (e) {
  
  if(respuesta!=-1){
    Query.callAjax(
      "pruebaRoute/ConsulAnterior",
      "POST",
      {respuesta:respuesta},
      function(resultado)
      { 
        var resultado = resultado[0];
        $("#loader").removeClass("active");
        $("#pregunta").text(resultado.pregunta);
        $("#imagenPregunta").attr("src","assets/img/preguntas/"+resultado.fotoPregunta);
        $("#negacion").removeClass("likeNegacion");
        $("#afirmacion").removeClass("likeAfirmacion");

        if(resultado.respuesta==1){
          $("#afirmacion").addClass("likeAfirmacion");
          respuesta=1;
        }
        else{
          $("#negacion").addClass("likeNegacion");
          respuesta=0;
        }
        
        posicionPregunta=resultado.numPregunta;
        var porcentaje=(posicionPregunta*100)/28
        $("#barraProgreso").width(porcentaje+"%");
        if(resultado.numPregunta==28){
          $("#btnSiguienteQuestion").slideUp();
          $("#btnFinalizarQuestion").slideDown();
        }
        else{
          $("#btnSiguienteQuestion").slideDown();
        
        }
        if(resultado.numPregunta==1){
          $("#btnAnteriorQuestion").slideUp();
        }
        else{
          $("#btnAnteriorQuestion").slideDown();
        
        }

        $("#squarespaceModal").modal("show");
        
      },
      function(error)
      {
        $("#loader").removeClass("active");
        
        console.log(error);
      }

    )
  }
  else{
    swal(
      "",
      "Debes seleccionar una opción para devolverse",
      "warning"
  );
  }
    
});

$(document).off("click", "#btnFinalizarQuestion").on("click", "#btnFinalizarQuestion", function (e) {
  
  if(respuesta!=-1){
    Query.callAjax(
      "pruebaRoute/FinalizarQuestionario",
      "POST",
      {respuesta:respuesta},
      function(resultado)
      { 
        var resultado = resultado[0];
       
        $("#negacion").removeClass("likeNegacion");
        $("#afirmacion").removeClass("likeAfirmacion");
        $("#barraProgreso").width("50%");
        $("#btnSiguienteQuestion").slideUp();
        $("#btnAnteriorQuestion").slideUp();
        respuesta=-1;
        $("#squarespaceModal").modal("hide");
        posicionPregunta=0;
        window.open("/resultadoRoute", "_self");
        $("#loader").removeClass("active");

      },
      function(error)
      {
        $("#loader").removeClass("active");
        
        console.log(error);
      }

    )
  }
  else{
     swal(
      "",
      "Debes seleccionar una opción para Finalizar",
      "warning"
  );
  }
    
});
$(document).off("click", "#negacion").on("click", "#negacion", function (e) {
    
    $("#negacion").addClass("likeNegacion");
    $("#afirmacion").removeClass("likeAfirmacion");
    respuesta=0;
   
    
});

$(document).off("click", "#afirmacion").on("click", "#afirmacion", function (e) {
  
    $("#afirmacion").addClass("likeAfirmacion");
    $("#negacion").removeClass("likeNegacion");
    respuesta=1;
    
});

$(document).off("click", "#iniciarPrueba").on("click", "#iniciarPrueba", function (e) {
  
  $("#loader").addClass("active");
  QueryForm.callAjax(
      "PruebaRoute/ConsultarInicioPrueba",
      "POST",
      {},
      function(resultado)
      {
        iniciarPrueba();
      },
      function(error)
      {
       $("#loader").removeClass("active");
         swal("", "La aplicacion solo permite realizar una prueba cada seis meses", "warning");
      }

   )
    
  
});

$(document).off("click", "#cerrarPrueba").on("click", "#cerrarPrueba", function (e) {
  
    swal("", "Tus respuestas se almacenaron. Podras continuar donde quedaste", "warning");
  
});

function iniciarPrueba(){
  
    $("#loader").addClass("active");
    QueryForm.callAjax(
        "PruebaRoute/ConsulActualizacionDatos",
        "POST",
        {},
        function(resultado)
        {
            var resultado = resultado[0];
            var fechaActualizacion = new Date(resultado.fechaActualizacion);
            var dia = ("0" + fechaActualizacion.getDate()).slice(-2);
            var mes = ("0" + (fechaActualizacion.getMonth() + 1)).slice(-2);
            fechaActualizacion = fechaActualizacion.getFullYear()+"-"+(mes)+"-"+(dia) ;

            
            var fecha = new Date();
				var dia = fecha.getDate();
				var mes = fecha.getMonth()+1;
				var year = fecha.getFullYear();

				if(mes < 10)
				{
					mes = "0"+mes;
				}

				if(dia < 10)
				{
					dia = "0"+dia;
				}


               var fechaActual = new Date(year, mes, dia);
           
               var fechaMenor = new Date(fechaActual.setMonth(fechaActual.getMonth()-2));

               
            var dias = ("0" + fechaMenor.getDate()).slice(-2);
            var mess = ("0" + (fechaMenor.getMonth() + 1)).slice(-2);
            fechaMenor = fechaMenor.getFullYear()+"-"+(mess)+"-"+(dias) ;
               
                if(fechaActualizacion>fechaMenor){
                  Query.callAjax(
                    "pruebaRoute/ConsulPreguntaInicial",
                    "POST",
                    {},
                    function(resultado)
                    { 
                      var resultado = resultado[0];
                      
                      $("#loader").removeClass("active");
                      $("#pregunta").text(resultado.pregunta);
                      $("#imagenPregunta").attr("src","assets/img/preguntas/"+resultado.fotoPregunta);
                      $("#negacion").removeClass("likeNegacion");
                      $("#afirmacion").removeClass("likeAfirmacion");
                      
                      respuesta=-1;
                      posicionPregunta=resultado.numPregunta;
                      var porcentaje=(posicionPregunta*100)/28
                      $("#barraProgreso").width(porcentaje+"%");
                      
                      if(resultado.numPregunta==28){
                        $("#btnSiguienteQuestion").slideUp();
                        $("#btnFinalizarQuestion").slideDown();
                      }
                      else{
                        $("#btnSiguienteQuestion").slideDown();
                        $("#btnFinalizarQuestion").slideUp();
                       
                      }
                      if(resultado.numPregunta==1){
                        $("#btnAnteriorQuestion").slideUp();
                      }
                      else{
                        $("#btnAnteriorQuestion").slideDown();
                       
                      }

                     
                      $('#squarespaceModal').modal({backdrop: 'static', keyboard: false}) 
                      $("#squarespaceModal").modal("show");
                      
                    },
                    function(error)
                    {
                      $("#loader").removeClass("active");
                      
                      console.log(error);
                      alert("error")
                    }
                
                  )
                }
                else{
                    cargarDatosUsuario();
                }

           
        },
        function(error)
        {
         $("#loader").removeClass("active");
           swal("", "Hubo un error vuelva a intentarlo", "error");
        }

     )
			
    
}

function cargarDatosUsuario()
{
  Query.callAjax(
    "editarPerfilRoute/datosUsuario",
    "POST",
    {},
    function(resultado)
    { 
      
      var resultado = resultado[0];
     
      tipoUsuario = resultado.tipoUsuario;
      $("#selectTipoDocumentoFormEditar").selectpicker("val", resultado.tipo_documento);
      $("#inputDocumentoFormEditar").val(resultado.documento);
      $("#inputNombreFormEditar").val(resultado.nombres);
      $("#inputApellidoFormEditar").val(resultado.apellidos);
      $("#inputEmailFormEditar").val(resultado.email);
      $("#inputContrasenaFormEditar").val(resultado.password);
      $("#inputTelefonoFormEditar").val(resultado.telefono);
      $("#inputEmailFormEditar").val(resultado.email);
      
     if(tipoUsuario==2){
      $("#selectMunicipioFormEditar").selectpicker("val", resultado.id_municipio);
      $("#inputColegioFormEditar").val(resultado.colegio);
      $("#selectGradoFormEditar").selectpicker("val", resultado.grado);
     }

     
      $("#loader").removeClass("active");
      
      $('#modalEditarDatos').modal({backdrop: 'static', keyboard: false}) 
									$("#modalEditarDatos").modal("show");
    },
    function(error)
    {
      $("#loader").removeClass("active");
      
      console.log(error);
    }

  )
}


$(document).off("click", "#btnEditarDatos").on("click", "#btnEditarDatos", function(e)
{
  $("#loader").addClass("active");
  validarFormulario("formEditarDatos", function()
  {
    var email = $("#inputEmailFormEditar").val();
    validarEmail(email, "inputEmailFormEditar", function()
    {
      $("#loader").removeClass("active");
      var errores = $("#formEditarDatos").find(".errorValidacion");

      if(errores.length == 0)
      {
        $("#loader").addClass("active");


        var formData = new FormData(document.getElementById("formEditarDatos"));

     
        QueryForm.callAjax(
           "editarPerfilRoute/editarDatos",
           "POST",
           formData,
           function(resultado)
           {
              reiniciarFormulario("formEditarUsuario");
              $("#modalEditarDatos").modal("hide");
              swal("", "Datos guardados correctamente", "success");
              iniciarPrueba();
              
           },
           function(error)
           {
            $("#loader").removeClass("active");
              swal("", "Hubo un error intente nuevamente", "error");
           }

        )
      } 
    })
  })
})


//FUNCIONES PARA VALIDAR EL FORMULARIO
function validarFormulario(form, callback)
{
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
    var idInput = input.attr('id')


    //VALIDACIONES ESPECIFICAS PARA ALGUNOS INPUTS
    
    validarCampoVacio(inputValue, idInput);
  

    if(inputType == "email")
    {
      validarEmailCaracteres(inputValue, idInput);
    }

    if(inputType == "text")
    {
      alphanumeric(inputValue, idInput);
    }
   
    if(idInput == "inputContrasenaNueva")
		{
		    validarPassword(inputValue, idInput);
		}

    inputsValidados++;

    //Respondemos cuando ya se han validado todos los input
    if(inputsValidados == cantidadInputs)
    {
      callback();
    }
  })
}

function alphanumeric(inputValue, idInput)
{ 
  idInput = "#"+idInput;
  var errores = $(idInput).parent().find( ".errorValidacion" );

  if(errores.length == 0)
  {
    var letters = /^[0-9a-zA-Z\d\s]+$/;
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

function validarEmailCaracteres(inputValue, idInput)
{
  var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;

  var validacionEmail = regex.test(inputValue);

  idInput = "#"+idInput;

  if(validacionEmail == false)
  {
    $(idInput).parent().find( ".errorValidacion" ).remove();
    $(idInput).parent().append('<label class="errorValidacion">El email no es valido</label>');
  }

  else
  {
    $(idInput).parent().find( ".errorValidacion" ).remove();
  }
}

function validarEmail(inputValue, idInput, callback)
{
  idInput = "#"+idInput;

  //Verificamos que no haya una error pendiente

  var errores = $(idInput).parent().find( ".errorValidacion" );

  if(errores.length == 0)
  {
    //Verificamos que el email se encuentre disponible en la bd
    var datos = {email: inputValue}

    Query.callAjax(

      "editarPerfilRoute/validarEmail",
      "POST",
      datos,
      function(resultado)
      {
        $(idInput).parent().find( ".errorValidacion" ).remove();      
        $(idInput).parent().append('<label class="errorValidacion">El email ya se encuentra en uso</label>');
        callback();
      },
      function(error)
      {
        $(idInput).parent().find( ".errorValidacion" ).remove();
        callback();
      }

      )
  }

  else
  {
    callback();
  }
}

function validarCampoVacio(inputValue, idInput)
{
  idInput = "#"+idInput;
  if(inputValue == "")
  {
    $(idInput).parent().find( ".errorValidacion" ).remove();      
    $(idInput).parent().append('<label class="errorValidacion">El campo no puede estar vacio</label>');
  }

  else
  {
    $(idInput).parent().find( ".errorValidacion" ).remove();
  }
}

function validarPassword(inputValue, idInput)
{
	idInput = "#"+idInput;
	if(inputValue.length<8)
	{
		$(idInput).parent().find( ".errorValidacion" ).remove();			
		$(idInput).parent().append('<label class="errorValidacion">La contraseña no es valida</label>');
	}

	else
	{
		$(idInput).parent().find( ".errorValidacion" ).remove();
	}
}

function reiniciarFormulario(form)
{
  var formInputs = "form#"+form+" :input";

  $(formInputs).each(function()
  {
    var input = $(this);
    var inputValue = input.val("");
  })
}

//FUNCIONES PARA LLENAR LOS SELECT DEL FORMULARIO EDITAR 
function cargarTipoDocumentos()
{
	Query.callAjax(

		"loginRoute/listarTipoDocumentos",
		"POST",
		{},
		function(resultado)
		{
      
			var html = '<option value="">Seleccione una opción</option>';
			resultado.forEach(function(resultado) 
			{
			  	html += '<option value="'+resultado.idDocumento+'">'+resultado.tipoDocumento+'</option>';
			});
			$("select[name=selectTipoDocumentoFormEditar]").html(html);
      
			
		},
		function(error)
		{
			
		}

    )
}

function cargarMunicipios()
{ 
	Query.callAjax(
     
		"loginRoute/listarMunicipios",
		"POST",
		{},
		function(resultado)
		{ 
			var html = '<option value="">Seleccione una opción</option>';
			resultado.forEach(function(resultado) 
			{
			  	html += '<option value="'+resultado.id_municipio+'">'+resultado.nombre+'</option>';
			});
			$("#selectMunicipioFormEditar").html(html);
            $("#selectMunicipioFormEditar").selectpicker('refresh');
      
			
		},
		function(error)
		{
			
		}

    )
}