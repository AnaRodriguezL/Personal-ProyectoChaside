var urlConexion = "/";
var tipoUsu;
//Efecto imagen
$(".js-tilt").tilt({
    scale: 1.1,
});

$(document).ready(function () {
    //Validamos el navegador
    $("#loader").removeClass("active");

    var ua = detect.parse(navigator.userAgent);
    var browser = ua.browser.family;

    if (browser == "Safari" || browser == "Mobile Safari") {
        $("#btnIngresar").prop("disabled", true);

        swal(
            {
                title: "Lo sentimos",
                text: "Para ejecutar la herramienta es necesario google chrome",
                type: "error",
                showCancelButton: false,
                confirmButtonText: "Descargar chrome",
                closeOnConfirm: false,
            },
            function () {
                window.open("https://www.google.com/intl/es/chrome/", "_blank");
            }
        );
    } else {
        cargarTipoDocumentos();
        cargarMunicipios();
        ValidarSoloNumeros(".numero");
        ValidarLetrasEspacio(".textoLetras");
        ValidarTipoCorreo(".email");
    }
});

//VALIDACION DE FORMULARIO

$("#formLogin").on("submit", function (e) {
    e.preventDefault();

    var ua = detect.parse(navigator.userAgent);
    var browser = ua.browser.family;

    if (browser == "Safari" || browser == "Mobile Safari") {
        swal(
            {
                title: "Lo sentimos",
                text: "Para ejecutar la herramienta es necesario google chrome",
                type: "error",
                showCancelButton: false,
                confirmButtonText: "Descargar chrome",
                closeOnConfirm: false,
            },
            function () {
                window.open("https://www.google.com/intl/es/chrome/", "_blank");
            }
        );
    } else {
        validarFormulario();
    }
});

function validarFormulario() {
    var inputEmail = $("#inputEmail").val();
    var inputContrasena = $("#inputContrasena").val();

    if (inputEmail == "") {
        swal("Oops!", "El campo email no puede estar vacío", "warning");
    } else if (inputContrasena == "") {
        swal("Oops!", "El campo contraseña no puede estar vacío", "warning");
    } else {
        var datos = { email: inputEmail, contrasena: inputContrasena };

        Query.callAjax(
            "loginRoute/validarEmail",
            "POST",
            datos,
            function (resultado) {
                resultado = resultado[0];
                var tipoUsuario = resultado.tipoUsuario;

                var datos_usuario = {
                    tipoUsuario: tipoUsuario,
                    email: inputEmail,
                };

                Query.callAjax(
                    "loginRoute/validarLogin",
                    "POST",
                    datos,
                    function (resultado) {
                        tipoUsu=resultado[0].tipoUsuario
                        if (resultado[0].cambiarPassword==1) {
                            $("#modalCambiarPass").modal("show");
                        }
                        else{
                            if (tipoUsu==1)
                            window.open("/estudiantesRoute", "_self");
                            else{
                                window.open("/pruebaRoute", "_self");
                            }
                        }
                    },
                    function (error) {
                        swal(
                            "Error",
                            "La contraseña que ingresaste es incorrecta",
                            "error"
                        );
                    }
                );
            },
            function (error) {
                swal(
                    "Error",
                    "El usuario no se encuentra registrado.",
                    "error"
                );
            }
        );
    }
}

$(document).off("click", "#olvidarPass").on("click", "#olvidarPass", function (e) {
        $("#modalOlvidoPass").modal("show");
});

$(document).off("click", ".btnCerrarModalOlvidoPass").on("click", ".btnCerrarModalOlvidoPass", function (e) {
        reiniciarFormulario("formOlvidoPass");
});

$(document).off("click", "#RecordarPass").on("click", "#RecordarPass", function (e) {
        var inputEmail = $("#emailRecordarPass").val();
        var inputDocumento = $("#documetnoRecordarPass").val();

        if (inputEmail == "") {
            swal("Oops!", "El campo email no puede estar vacío", "warning");
        } else if (inputDocumento == "") {
            swal(
                "Oops!",
                "El campo Número de documento no puede estar vacío",
                "warning"
            );
        } else {
            var datos = { email: inputEmail, documento: inputDocumento };

            Query.callAjax(
                "loginRoute/validarRecordarPass",
                "POST",
                datos,
                function (resultado) {
                    $("#loader").addClass("active");
                    Query.callAjax(
                        "loginRoute/restablecerPass",
                        "POST",
                        datos,
                        function (resultado) {
                            swal(
                                "",
                                "Se ha enviado la nueva contraseña a su correo",
                                "success"
                            );
                            $("#loader").removeClass("active");
                            $("#modalOlvidoPass").modal("hide");
                            reiniciarFormulario("formOlvidoPass");
                        },
                        function (error) {
                            swal(
                                "Error",
                                "No se pudo enviar la nueva contraseña al correo ingresado",
                                "error"
                            );
                            $("#loader").removeClass("active");
                        }
                    );
                },
                function (error) {
                    swal(
                        "Error",
                        "Los datos ingreados no se encuntran registrados",
                        "error"
                    );
                }
            );
        }
});


$(document).off("click", "#cambiarPass").on("click", "#cambiarPass", function (e) {
    
    $("#loader").addClass("active");
    validarFormularioRegistrate("formCambiarPass", function () {
        $("#loader").removeClass("active");
        var errores = $("#formCambiarPass").find(".errorValidacion");
        if (errores.length == 0) {

            var inputRepetirNuevaPass = $("#repetirNuevaPass").val();
            var inputNuevaPass = $("#nuevaPass").val();

            if (inputRepetirNuevaPass != inputNuevaPass) {
                swal("Oops!", "Las contraseñas ingresadas no coinciden", "warning");
            }
            else{
                $("#loader").addClass("active");
                var formData = new FormData(document.getElementById("formCambiarPass"));

                QueryForm.callAjax(
                    "loginRoute/cambiarContrasena",
                    "POST",
                    formData,
                    function (resultado) {
                        $("#loader").removeClass("active");
                        swal("", "Contraseña cambiada correctamente", "success");
                        if (tipoUsu==1)
                            window.open("/estudiantesRoute", "_self");
                            else{
                                window.open("/pruebaRoute", "_self");
                            }
                        
                        
                    },
                    function (error) {
                        $("#loader").addClass("active");
                        swal("", "Hubo un error por favor volver a intentarlo", "error");

                    }
                );
            }
        
        } 
    });     
});

//REINICIAR FORMULARIOS
function reiniciarFormulario(form) {
    var formInputs = "form#" + form + " :input";

    $(formInputs).each(function () {
        var input = $(this);
        var inputValue = input.val("");
    });
}

function cargarTipoDocumentos() {
    Query.callAjax(
        "loginRoute/listarTipoDocumentos",
        "POST",
        {},
        function (resultado) {
            var html = '<option value="">Seleccione una opción</option>';
            resultado.forEach(function (resultado) {
                html +=
                    '<option value="' +
                    resultado.idDocumento +
                    '">' +
                    resultado.tipoDocumento +
                    "</option>";
            });
            $("#inputTipoDocumentoFormCrear").html(html);
            $("#inputTipoDocumentoFormCrear").selectpicker('refresh');
            
        },
        function (error) {}
    );
}

function cargarMunicipios() {
    Query.callAjax(
        "loginRoute/listarMunicipios",
        "POST",
        {},
        function (resultado) {
            var html = '<option value="">Seleccione una opción</option>';
            resultado.forEach(function (resultado) {
                html +=
                    '<option value="' +
                    resultado.id_municipio +
                    '">' +
                    resultado.nombre +
                    "</option>";
            });
            $("#selectMunicipioFormCrear").html(html);
            $("#selectMunicipioFormCrear").selectpicker('refresh');
        },
        function (error) {}
    );
}

//OPERACIONES REGISTRAR ESTUDIANTE
$(document).off("click", "#buttonContinuarFormCrear").on("click", "#buttonContinuarFormCrear", function (e) {
    $("#loader").addClass("active");
    validarFormularioRegistrate("formCrearEstudiante", function () {
        $("#loader").removeClass("active");
        var errores = $("#formCrearEstudiante").find(".errorValidacion");
        if (errores.length == 0) {
            var radio = $('input[name="inlineRadioOptions"]:checked').val();
            if (radio == undefined) {
                swal(
                    "",
                    "Debes seleccionar si acepta o no la política de privacidad",
                    "warning"
                );
            } else {
                $("#loader").addClass("active");
                var inputEmail = $("#inputEmailFormCrear").val();

                var datos = { email: inputEmail };

                Query.callAjax(
                    "loginRoute/validarEmail",
                    "POST",
                    datos,
                    function (resultado) {
                        $("#loader").removeClass("active");
                        swal(
                            "",
                            "El correo ingresado ya se encuentra registrado.",
                            "warning"
                        );
                    },
                    function (error) {
                        $("#loader").addClass("active");
                        $("#modalCrearEstudiante").modal("hide");

                        var formData = new FormData(
                            document.getElementById("formCrearEstudiante")
                        );
                        formData.append("tyc", radio);

                        QueryForm.callAjax(
                            "loginRoute/crearEstudiante",
                            "POST",
                            formData,
                            function (resultado) {
                                $("#loader").removeClass("active");

                                //Servicio para ingresar o finalizar la sesion
                                swal(
                                    {
                                        title: "Registro exitoso!",
                                        type: "success",
                                        showCancelButton: true,
                                        confirmButtonText: "Ingresar",
                                        cancelButtonText: "Finalizar",
                                        closeOnConfirm: false,
                                        closeOnCancel: false,
                                    },
                                    function (isConfirm) {
                                        if (isConfirm) {
                                            window.open("/pruebaRoute", "_self");;
                                        } else {
                                            window.open(
                                                "/cerrarSesionRoute",
                                                "_self"
                                            );
                                        }
                                    }
                                );
                            },
                            function (error) {
                                $("#loader").removeClass("active");
                                swal(
                                    "Error",
                                    "Hubo un error realizando el registro",
                                    "error"
                                );
                            }
                        );
                    }
                );
            }
        }
    });
});

//FUNCIONES PARA VALIDAR FORMULARIO REGISTARTE ESTUDIANTE

function validarFormularioRegistrate(form, callback) {
    var formInputs = "form#" + form + " :input";
    var cantidadInputs = $(formInputs).length;

    //Variable que cuenta el numero de los inputs que pasaron por la validacion
    var inputsValidados = 0;

    //Validaciones
    $(formInputs).each(function () {
        var input = $(this);
        var inputType = input.attr("type");
        var inputValue = input.val();
        var idInput = input.attr("id");
        var inputTelefono = input.hasClass("inputTelefono");

        //VALIDACIONES ESPECIFICAS PARA ALGUNOS INPUTS

        validarCampoVacio(inputValue, idInput);

        if (inputType == "email") {
            validarEmailCaracteres(inputValue, idInput);
        }

        if (inputType == "text") {
            alphanumeric(inputValue, idInput);
        }

        if (idInput == "inputContraseñaFormCrear" || idInput == "nuevaPass" || idInput == "repetirNuevaPass") {
            validarPassword(inputValue, idInput);
        }
        
        

        inputsValidados++;

        //Respondemos cuando ya se han validado todos los input
        if (inputsValidados == cantidadInputs) {
            callback();
        }
    });
}

function validarCampoVacio(inputValue, idInput) {
    idInput = "#" + idInput;
    if (inputValue == "") {
        $(idInput).parent().find(".errorValidacion").remove();
        $(idInput)
            .parent()
            .append(
                '<label class="errorValidacion">El campo no puede estar vacio</label>'
            );
    } else {
        $(idInput).parent().find(".errorValidacion").remove();
    }
}

function validarEmailCaracteres(inputValue, idInput) {
    var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;

    var validacionEmail = regex.test(inputValue);

    idInput = "#" + idInput;

    if (validacionEmail == false) {
        $(idInput).parent().find(".errorValidacion").remove();
        $(idInput)
            .parent()
            .append(
                '<label class="errorValidacion">El email no es valido</label>'
            );
    } else {
        $(idInput).parent().find(".errorValidacion").remove();
    }
}

function alphanumeric(inputValue, idInput) {
    idInput = "#" + idInput;
    var errores = $(idInput).parent().find(".errorValidacion");

    if (errores.length == 0) {
        var letters = /^[0-9a-zA-ZáéíóúÁÉÍÓÚÑñ\d\s]+$/;
        if (inputValue.match(letters)) {
            $(idInput).parent().find(".errorValidacion").remove();
        } else {
            $(idInput)
                .parent()
                .append(
                    '<label class="errorValidacion">No se aceptan caracteres especiales</label>'
                );
        }
    }
}

function validarPassword(inputValue, idInput) {
    idInput = "#" + idInput;
    if (inputValue.length < 8 || inputValue.length>20 ) {
        $(idInput).parent().find(".errorValidacion").remove();
        $(idInput)
            .parent()
            .append(
                '<label class="errorValidacion">La contraseña no es valida</label>'
            );
    } else {
        $(idInput).parent().find(".errorValidacion").remove();
    }
}


