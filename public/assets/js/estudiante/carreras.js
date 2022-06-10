var urlConexion = "/";


$(document).ready(function() 
{
    mostrarCarreras();
});


$(window).on("load", function () {
    $("#loader").removeClass("active");
});

function mostrarCarreras() {
    Query.callAjax(
		"carrerasRoute/verCarreras",
		"POST",
		{},
		function(resultado)
		{
            var html="";
            for(var i=0; i<resultado.length;i=i+2){
              
               var j=i+1;
                html+=
                `<div class="row justify-content-center">
                    <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12" style="margin-bottom: 20px;">
                        <div class="card">
                            <img src="assets/img/carreras/${resultado[i].fotoCarrera}" class="card-img-top">
                            <div class="card-footer">
                                <button class="btn-detalle btnVerCarrera" data-id="${resultado[i].idCarrera}">VER DETALLES</button>
                            </div>
                        </div>
                    </div>`

                    if(j<resultado.length){
                      html+= ` <div class="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12" style="margin-bottom: 20px;">
                                    <div class="card">
                                        <img src="assets/img/carreras/${resultado[j].fotoCarrera}" class="card-img-top">
                                        <div class="card-footer">
                                            <button class="btn-detalle btnVerCarrera"  data-id="${resultado[j].idCarrera}">VER DETALLES</button>
                                        </div>
                                    </div>
                                </div>
                            </div>`;
                    }
                    else{
                        html+=`</div>`;
                    }

            }

            $("#carreras").html(html);

            $("#loader").removeClass("active");
            
		},
		function(error)
		{
			$("#loader").removeClass("active");
            
			swal("", error, "error");
		}
    )

}

$(document).off("click", ".btnVerCarrera").on("click", ".btnVerCarrera", function(e)
{
    var idCarrera = $(this).attr("data-id");
	$("#loader").addClass("active");
	Query.callAjax(
		"carrerasRoute/guardarIdCarrera",
		"POST",
		{idCarrera: idCarrera},
		function(resultado)
		{
			
            window.open("/carreraRoute", "_self");
            $("#loader").removeClass("active");
		},
		function(error)
		{
			$("#loader").removeClass("active");
            
			swal("", error, "error");
		}
    )
})