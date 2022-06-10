var urlConexion = "/";


$(document).ready(function() 
{
    //Organizacion de menu lateral
    $(".nav-item").removeClass("active");
    $("#btnContactenos").addClass("active");
});


$(window).on("load", function () {
    $("#loader").removeClass("active");
});