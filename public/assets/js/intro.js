var urlConexion = "/";

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
        $("#btnIniciar").prop("disabled", true);

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
    } 
});




