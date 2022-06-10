var urlConexion = "/";


$(document).ready(function() 
{
    //Organizacion de menu lateral
    $(".nav-item").removeClass("active");
    $("#btnFacultades").addClass("active");
});


$(window).on("load", function () {
    $("#loader").removeClass("active");
});


$(document).off("click", ".btnVerCarreras").on("click", ".btnVerCarreras", function(e)
{
    var idFacultad = $(this).attr("data-id");
	$("#loader").addClass("active");
	Query.callAjax(
		"facultadesRoute/guardarIdFacultad",
		"POST",
		{idFacultad: idFacultad},
		function(resultado)
		{
			
            window.open("/carrerasRoute", "_self");
            $("#loader").removeClass("active");
		},
		function(error)
		{
			$("#loader").removeClass("active");
            
			swal("", error, "error");
		}
    )
})