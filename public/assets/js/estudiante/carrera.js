var urlConexion = "/";


$(document).ready(function() 
{
    mostrarCarrera();
});


$(window).on("load", function () {
    $("#loader").removeClass("active");
});


function mostrarCarrera() {
    Query.callAjax(
		"carreraRoute/verCarrera",
		"POST",
		{},
		function(resultado)
		{
            var resultado = resultado[0];
			$("#videoCarrera").attr("src",resultado.videoCarrera+"?autoplay=1&mute=1&enablejsapi=1");
			$("#linkCarrera").attr("href",resultado.linkCarrera);

			var htmlBanner=
				`<div style="background-image: url(assets/img/banners/${resultado.banner})" class="jumbotron jumbotron-image">
				</div>`

			$("#bannerCarrera").html(htmlBanner);

			if(resultado.perfilProfesional!=""){
				var html=
				`<div class="card" style="border: none !important; border-radius: 25px; margin-bottom: 15px;">
				<div class="card-body" >
					<h4 class="card-title text-center">
						Perfil de Formación Profesional
					</h4>

					<p class="card-text">
						${resultado.perfilProfesional}
					</p>
				</div>
				</div>`

				$("#perfilProfesional").html(html);
			}
			var htmlOcupacional=
			`<div class="card" style="border: none !important; border-radius: 25px;">
			<div class="card-body">
				<h4 class="card-title text-center">
					Perfil Ocupacional
				</h4>

				<p class="card-text">
					${resultado.perfilOcupacional}
				</p>
			</div>
		</div>`

			$("#perfilOcupacional").html(htmlOcupacional);
			
            $("#loader").removeClass("active");
			
            
		},
		function(error)
		{
			$("#loader").removeClass("active");
            
			swal("", error, "error");
		}
    )

}
