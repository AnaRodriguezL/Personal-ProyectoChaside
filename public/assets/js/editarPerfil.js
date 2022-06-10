var urlConexion = "/";


$(document).ready(function() 
{
  

  cargarTipoDocumentos(function(){
    cargarMunicipios(function(){
           cargarDatosUsuario();
    })
  })


  ValidarSoloNumeros(".numero");
  ValidarLetrasEspacio(".textoLetras");
  ValidarTipoCorreo(".email");
  
});

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
    },
    function(error)
    {
      $("#loader").removeClass("active");
      
      console.log(error);
    }

  )
}


$("#inputFotoFormEditar").change(function()
{
  editarFoto = true;
});

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
              window.open("/editarPerfilRoute", "_self");
              swal("", "Usuario editado correctamente", "success");
              cargarDatosUsuario();
              
           },
           function(error)
           {
            $("#loader").removeClass("active");
              swal("", "Hubo un error comuniquese con el administrador", "error");
           }

        )
      } 
    })
  })
})

$(document).off("click", "#btnCambiarContrasena").on("click", "#btnCambiarContrasena", function(e)
{
  $("#loader").addClass("active");
  validarFormulario("formEditarContrasena", function()
  {
    $("#loader").removeClass("active");
    var errores = $("#formEditarContrasena").find(".errorValidacion");

    if(errores.length == 0)
    {
      $("#loader").addClass("active");

      var formData = new FormData(document.getElementById("formEditarContrasena"));

      QueryForm.callAjax(
         "editarPerfilRoute/editarContrasena",
         "POST",
         formData,
         function(resultado)
         {
            reiniciarFormulario("formEditarContrasena");
            swal("", "Contraseña cambiada correctamente", "success");
            cargarDatosUsuario();
         },
         function(error)
         {
            $("#loader").removeClass("active");
            swal("", error, "error");
         }
      )
    } 
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
function cargarTipoDocumentos(callback)
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
			$("#selectTipoDocumentoFormEditar").html(html);
      $("#selectTipoDocumentoFormEditar").selectpicker('refresh');
      callback();
			
		},
		function(error)
		{
			
		}

    )
}

function cargarMunicipios(callback)
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
      callback();
			
		},
		function(error)
		{
			
		}

    )
}