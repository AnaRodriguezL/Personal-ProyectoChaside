var urlConexion = "/";
var areaChaideSelecionado="";


$(document).ready(function() 
{
    mostrarArea();
});


$(window).on("load", function () {
    $("#loader").removeClass("active");
});


function mostrarArea() {
    Query.callAjax(
		"areaChasideRoute/verAreaChaside",
		"POST",
		{},
		function(resultado)
		{
            var resul = resultado.area;
			var img = resultado.imagenArea;
            //-----seteamos los valores del area chaside
            $("#textoArea1").text(resul.texto1);
			$("#textoArea2").text(resul.texto2);
			$("#imagenArea").attr("src",img);
			// $("#imagenPregunta").attr("src","assets/img/preguntas/"+resultado.fotoPregunta);
            $("#loader").removeClass("active");
            areaChaideSelecionado=resul.letra;
			
		},
		function(error)
		{
			$("#loader").removeClass("active");
            
			swal("", error, "error");
		}
    )

}


$(document).off("click", ".btnVerCarreraArea").on("click", ".btnVerCarreraArea", function(e)
{
    
	$("#loader").addClass("active");

//Se valida que el area seleccionada si tenga carreras en la universidad sino se muestra el popup informativo
	if(areaChaideSelecionado=="S"||areaChaideSelecionado=="D"||areaChaideSelecionado=="E"){
		$("#loader").removeClass("active");
		
		$('#promocionModal').modal({backdrop: 'static', keyboard: false}) 
                      $("#promocionModal").modal("show");
	}else{
		Query.callAjax(
		"areaChasideRoute/guardarBanderaBusqueda",
		"POST",
		{},
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
	}
	
})