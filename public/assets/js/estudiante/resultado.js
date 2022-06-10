var urlConexion = "/";


$(document).ready(function() 
{
    resultadosPrueba();
});

function resultadosPrueba() {
    Query.callAjax(
		"resultadoRoute/verResultadoPrueba",
		"POST",
		{},
		function(resultado)
		{
			var resultado=resultado[0];

            switch (resultado.c) 
            {
                case 0:
                  resultadoC= "Muy bajo";
                  $("#resultadoC").text(resultadoC);
                  $("#imagenResultadoC").slideUp();
                  $("#imagenResultadoDislikeC").slideDown();

                  var html = `<i class="mdi mdi-star-outline"></i>
                            <i class="mdi mdi-star-outline"></i>
                            <i class="mdi mdi-star-outline"></i>
                            <i class="mdi mdi-star-outline"></i>`
                            $("#starResultadoC").html(html);
                  var htmlButtom = `<button class="btn-detalle card-footer btnVerArea" data-imagen="assets/img/resultados/cienciasContableDislike.png" data-id="1">VER DETALLES</button>`
                  $("#buttonResultadoC").html(htmlButtom );
                    break;

                case 1:
                  resultadoC= "Bajo";
                  $("#resultadoC").text(resultadoC);
                  $("#imagenResultadoC").slideUp();
                  $("#imagenResultadoDislikeC").slideDown();
                  var html = `<i class="mdi mdi-star"></i>
                            <i class="mdi mdi-star-outline"></i>
                            <i class="mdi mdi-star-outline"></i>
                            <i class="mdi mdi-star-outline"></i>`
                            $("#starResultadoC").html(html);
                            var htmlButtom = `<button class="btn-detalle card-footer btnVerArea" data-imagen="assets/img/resultados/cienciasContableDislike.png" data-id="1">VER DETALLES</button>`
                            $("#buttonResultadoC").html(htmlButtom );

                    break;
                case 2:
                  resultadoC= "Medio Bajo";
                  $("#resultadoC").text(resultadoC);
                  $("#imagenResultadoC").slideUp();
                  $("#imagenResultadoDislikeC").slideDown();
                  var html = `<i class="mdi mdi-star"></i>
                            <i class="mdi mdi-star"></i>
                            <i class="mdi mdi-star-outline"></i>
                            <i class="mdi mdi-star-outline"></i>`
                            $("#starResultadoC").html(html);
                            var htmlButtom = `<button class="btn-detalle card-footer btnVerArea" data-imagen="assets/img/resultados/cienciasContableDislike.png" data-id="1">VER DETALLES</button>`
                            $("#buttonResultadoC").html(htmlButtom );

                    break;
                case 3:
                  resultadoC= "Medio Alto";
                  $("#resultadoC").text(resultadoC);
                  $("#imagenResultadoC").slideUp();
                  $("#imagenResultadoDislikeC").slideDown();
                  var html = `<i class="mdi mdi-star"></i>
                            <i class="mdi mdi-star"></i>
                            <i class="mdi mdi-star"></i>
                            <i class="mdi mdi-star-outline"></i>`
                            $("#starResultadoC").html(html);
                            var htmlButtom = `<button class="btn-detalle card-footer btnVerArea" data-imagen="assets/img/resultados/cienciasContableLike.png" data-id="1">VER DETALLES</button>`
                            $("#buttonResultadoC").html(htmlButtom );
                    break;
                case 4:
                  resultadoC= "Alto";
                  $("#resultadoC").text(resultadoC);
                  $("#imagenResultadoC").slideUp();
                  $("#imagenResultadoDislikeC").slideDown();
                  var html = `<i class="mdi mdi-star"></i>
                            <i class="mdi mdi-star"></i>
                            <i class="mdi mdi-star"></i>
                            <i class="mdi mdi-star"></i>`
                            $("#starResultadoC").html(html);
                            var htmlButtom = `<button class="btn-detalle card-footer btnVerArea" data-imagen="assets/img/resultados/cienciasContableLike.png" data-id="1">VER DETALLES</button>`
                            $("#buttonResultadoC").html(htmlButtom );
                    break;
            }

            switch (resultado.h) 
            {
                case 0:
                  resultadoH= "Muy bajo";
                  $("#resultadoH").text(resultadoH);
                  $("#imagenResultadoH").slideUp();
                  $("#imagenResultadoDislikeH").slideDown();
                  var html = `<i class="mdi mdi-star-outline"></i>
                            <i class="mdi mdi-star-outline"></i>
                            <i class="mdi mdi-star-outline"></i>
                            <i class="mdi mdi-star-outline"></i>`
                            $("#starResultadoH").html(html);
                            var htmlButtom = `<button class="btn-detalle card-footer btnVerArea" data-imagen="assets/img/resultados/humanisticasDislike.png" data-id="2">VER DETALLES</button>`
                            $("#buttonResultadoH").html(htmlButtom );
                    break;
                case 1:
                  resultadoH= "Bajo";
                  $("#resultadoH").text(resultadoH);
                  $("#imagenResultadoH").slideUp();
                  $("#imagenResultadoDislikeH").slideDown();
                  var html = `<i class="mdi mdi-star"></i>
                            <i class="mdi mdi-star-outline"></i>
                            <i class="mdi mdi-star-outline"></i>
                            <i class="mdi mdi-star-outline"></i>`
                            $("#starResultadoH").html(html);
                            var htmlButtom = `<button class="btn-detalle card-footer btnVerArea" data-imagen="assets/img/resultados/humanisticasDislike.png" data-id="2">VER DETALLES</button>`
                            $("#buttonResultadoH").html(htmlButtom );
                    break;
                case 2:
                  resultadoH= "Medio Bajo";
                  $("#resultadoH").text(resultadoH);
                  $("#imagenResultadoH").slideUp();
                  $("#imagenResultadoDislikeH").slideDown();
                  var html = `<i class="mdi mdi-star"></i>
                            <i class="mdi mdi-star"></i>
                            <i class="mdi mdi-star-outline"></i>
                            <i class="mdi mdi-star-outline"></i>`
                            $("#starResultadoH").html(html);
                            var htmlButtom = `<button class="btn-detalle card-footer btnVerArea" data-imagen="assets/img/resultados/humanisticasDislike.png" data-id="2">VER DETALLES</button>`
                            $("#buttonResultadoH").html(htmlButtom );
                    break;
                case 3:
                  resultadoH= "Medio Alto";
                  $("#resultadoH").text(resultadoH);
                  $("#imagenResultadoH").slideDown();
                  $("#imagenResultadoDislikeH").slideUp();
                  var html = `<i class="mdi mdi-star"></i>
                            <i class="mdi mdi-star"></i>
                            <i class="mdi mdi-star"></i>
                            <i class="mdi mdi-star-outline"></i>`
                            $("#starResultadoH").html(html);
                            var htmlButtom = `<button class="btn-detalle card-footer btnVerArea" data-imagen="assets/img/resultados/humanisticaslike.png" data-id="2">VER DETALLES</button>`
                            $("#buttonResultadoH").html(htmlButtom );
                    break;
                case 4:
                  resultadoH= "Alto";
                  $("#resultadoH").text(resultadoH);
                  $("#imagenResultadoH").slideDown();
                  $("#imagenResultadoDislikeH").slideUp();
                  var html = `<i class="mdi mdi-star"></i>
                            <i class="mdi mdi-star"></i>
                            <i class="mdi mdi-star"></i>
                            <i class="mdi mdi-star"></i>`
                            $("#starResultadoH").html(html);
                            var htmlButtom = `<button class="btn-detalle card-footer btnVerArea" data-imagen="assets/img/resultados/humanisticaslike.png" data-id="2">VER DETALLES</button>`
                            $("#buttonResultadoH").html(htmlButtom );
                    break;
            }

            switch (resultado.a) 
            {
                case 0:
                  resultadoA= "Muy bajo";
                  $("#resultadoA").text(resultadoA);
                  $("#imagenResultadoA").slideUp();
                  $("#imagenResultadoDislikeA").slideDown();
                  var html = `<i class="mdi mdi-star-outline"></i>
                            <i class="mdi mdi-star-outline"></i>
                            <i class="mdi mdi-star-outline"></i>
                            <i class="mdi mdi-star-outline"></i>`
                            $("#starResultadoA").html(html);
                            var htmlButtom = `<button class="btn-detalle card-footer btnVerArea" data-imagen="assets/img/resultados/artisiticasDisLike.png" data-id="3">VER DETALLES</button>`
                  $("#buttonResultadoA").html(htmlButtom);
                    break;
                case 1:
                  resultadoA= "Bajo";
                  $("#resultadoA").text(resultadoA);
                  $("#imagenResultadoA").slideUp();
                  $("#imagenResultadoDislikeA").slideDown();
                  var html = `<i class="mdi mdi-star"></i>
                            <i class="mdi mdi-star-outline"></i>
                            <i class="mdi mdi-star-outline"></i>
                            <i class="mdi mdi-star-outline"></i>`
                            $("#starResultadoA").html(html);
                            var htmlButtom = `<button class="btn-detalle card-footer btnVerArea" data-imagen="assets/img/resultados/artisiticasDisLike.png" data-id="3">VER DETALLES</button>`
                            $("#buttonResultadoA").html(htmlButtom);
                    break;
                case 2:
                  resultadoA= "Medio Bajo";
                  $("#resultadoA").text(resultadoA);
                  $("#imagenResultadoA").slideUp();
                  $("#imagenResultadoDislikeA").slideDown();
                  var html = `<i class="mdi mdi-star"></i>
                            <i class="mdi mdi-star"></i>
                            <i class="mdi mdi-star-outline"></i>
                            <i class="mdi mdi-star-outline"></i>`
                            $("#starResultadoA").html(html);
                            var htmlButtom = `<button class="btn-detalle card-footer btnVerArea" data-imagen="assets/img/resultados/artisiticasDisLike.png" data-id="3">VER DETALLES</button>`
                            $("#buttonResultadoA").html(htmlButtom);
                    break;
                case 3:
                  resultadoA= "Medio Alto";
                  $("#resultadoA").text(resultadoA);
                  $("#imagenResultadoA").slideDown();
                  $("#imagenResultadoDislikeA").slideUp();
                  var html = `<i class="mdi mdi-star"></i>
                            <i class="mdi mdi-star"></i>
                            <i class="mdi mdi-star"></i>
                            <i class="mdi mdi-star-outline"></i>`
                            $("#starResultadoA").html(html);
                            var htmlButtom = `<button class="btn-detalle card-footer btnVerArea" data-imagen="assets/img/resultados/artisiticasLike.png" data-id="3">VER DETALLES</button>`
                            $("#buttonResultadoA").html(htmlButtom);
                    break;
                case 4:
                  resultadoA= "Alto";
                  $("#resultadoA").text(resultadoA);
                  $("#imagenResultadoA").slideDown();
                  $("#imagenResultadoDislikeA").slideUp();
                  var html = `<i class="mdi mdi-star"></i>
                            <i class="mdi mdi-star"></i>
                            <i class="mdi mdi-star"></i>
                            <i class="mdi mdi-star"></i>`
                            $("#starResultadoA").html(html);
                            var htmlButtom = `<button class="btn-detalle card-footer btnVerArea" data-imagen="assets/img/resultados/artisiticasLike.png" data-id="3">VER DETALLES</button>`
                            $("#buttonResultadoA").html(htmlButtom);
                    break;
            }

            switch (resultado.s) 
            {
                case 0:
                  resultadoS= "Muy bajo";
                  $("#resultadoS").text(resultadoS);
                  $("#imagenResultadoS").slideUp();
                  $("#imagenResultadoDislikeS").slideDown();
                  var html = `<i class="mdi mdi-star-outline"></i>
                            <i class="mdi mdi-star-outline"></i>
                            <i class="mdi mdi-star-outline"></i>
                            <i class="mdi mdi-star-outline"></i>`
                            $("#starResultadoS").html(html);
                            var htmlButtom = `<button class="btn-detalle card-footer btnVerArea" data-imagen="assets/img/resultados/saludDislike.png" data-id="4">VER DETALLES</button>`
                            $("#buttonResultadoS").html(htmlButtom);
                    break;
                case 1:
                  resultadoS= "Bajo";
                  $("#resultadoS").text(resultadoS);
                  $("#imagenResultadoS").slideUp();
                  $("#imagenResultadoDislikeS").slideDown();
                  var html = `<i class="mdi mdi-star"></i>
                            <i class="mdi mdi-star-outline"></i>
                            <i class="mdi mdi-star-outline"></i>
                            <i class="mdi mdi-star-outline"></i>`
                            $("#starResultadoS").html(html);
                            var htmlButtom = `<button class="btn-detalle card-footer btnVerArea" data-imagen="assets/img/resultados/saludDislike.png" data-id="4">VER DETALLES</button>`
                            $("#buttonResultadoS").html(htmlButtom);
                    break;
                case 2:
                  resultadoS= "Medio Bajo";
                  $("#resultadoS").text(resultadoS);
                  $("#imagenResultadoS").slideUp();
                  $("#imagenResultadoDislikeS").slideDown();
                  var html = `<i class="mdi mdi-star"></i>
                            <i class="mdi mdi-star"></i>
                            <i class="mdi mdi-star-outline"></i>
                            <i class="mdi mdi-star-outline"></i>`
                            $("#starResultadoS").html(html);
                            var htmlButtom = `<button class="btn-detalle card-footer btnVerArea" data-imagen="assets/img/resultados/saludDislike.png" data-id="4">VER DETALLES</button>`
                            $("#buttonResultadoS").html(htmlButtom);
                    break;
                case 3:
                  resultadoS= "Medio Alto";
                  $("#resultadoS").text(resultadoS);
                  $("#imagenResultadoS").slideDown();
                  $("#imagenResultadoDislikeS").slideUp();
                  var html = `<i class="mdi mdi-star"></i>
                            <i class="mdi mdi-star"></i>
                            <i class="mdi mdi-star"></i>
                            <i class="mdi mdi-star-outline"></i>`
                            $("#starResultadoS").html(html);
                            var htmlButtom = `<button class="btn-detalle card-footer btnVerArea" data-imagen="assets/img/resultados/saludlike.png" data-id="4">VER DETALLES</button>`
                            $("#buttonResultadoS").html(htmlButtom);
                    break;
                case 4:
                  resultadoS= "Alto";
                  $("#resultadoS").text(resultadoS);
                  $("#imagenResultadoS").slideDown();
                  $("#imagenResultadoDislikeS").slideUp();
                  var html = `<i class="mdi mdi-star"></i>
                            <i class="mdi mdi-star"></i>
                            <i class="mdi mdi-star"></i>
                            <i class="mdi mdi-star"></i>`
                            $("#starResultadoS").html(html);
                            var htmlButtom = `<button class="btn-detalle card-footer btnVerArea" data-imagen="assets/img/resultados/saludlike.png" data-id="4">VER DETALLES</button>`
                            $("#buttonResultadoS").html(htmlButtom);
                    break;
            }

            switch (resultado.i) 
            {
                case 0:
                  resultadoI= "Muy bajo";
                  $("#resultadoI").text(resultadoI);
                  $("#imagenResultadoI").slideUp();
                  $("#imagenResultadoDislikeI").slideDown();
                  var html = `<i class="mdi mdi-star-outline"></i>
                            <i class="mdi mdi-star-outline"></i>
                            <i class="mdi mdi-star-outline"></i>
                            <i class="mdi mdi-star-outline"></i>`
                            $("#starResultadoI").html(html);
                            var htmlButtom = `<button class="btn-detalle card-footer btnVerArea" data-imagen="assets/img/resultados/ingenieriasDisLike.png" data-id="5">VER DETALLES</button>`
                            $("#buttonResultadoI").html(htmlButtom);
                    break;
                case 1:
                  resultadoI= "Bajo";
                  $("#resultadoI").text(resultadoI);
                  $("#imagenResultadoI").slideUp();
                  $("#imagenResultadoDislikeI").slideDown();
                  var html = `<i class="mdi mdi-star"></i>
                            <i class="mdi mdi-star-outline"></i>
                            <i class="mdi mdi-star-outline"></i>
                            <i class="mdi mdi-star-outline"></i>`
                            $("#starResultadoI").html(html);
                            var htmlButtom = `<button class="btn-detalle card-footer btnVerArea" data-imagen="assets/img/resultados/ingenieriasDisLike.png" data-id="5">VER DETALLES</button>`
                            $("#buttonResultadoI").html(htmlButtom);
                    break;
                case 2:
                  resultadoI= "Medio Bajo";
                  $("#resultadoI").text(resultadoI);
                  $("#imagenResultadoI").slideUp();
                  $("#imagenResultadoDislikeI").slideDown();
                  var html = `<i class="mdi mdi-star"></i>
                            <i class="mdi mdi-star"></i>
                            <i class="mdi mdi-star-outline"></i>
                            <i class="mdi mdi-star-outline"></i>`
                            $("#starResultadoI").html(html);
                            var htmlButtom = `<button class="btn-detalle card-footer btnVerArea" data-imagen="assets/img/resultados/ingenieriasDisLike.png" data-id="5">VER DETALLES</button>`
                            $("#buttonResultadoI").html(htmlButtom);
                    break;
                case 3:
                  resultadoI= "Medio Alto";
                  $("#resultadoI").text(resultadoI);
                  $("#imagenResultadoI").slideDown();
                  $("#imagenResultadoDislikeI").slideUp();
                  var html = `<i class="mdi mdi-star"></i>
                            <i class="mdi mdi-star"></i>
                            <i class="mdi mdi-star"></i>
                            <i class="mdi mdi-star-outline"></i>`
                            $("#starResultadoI").html(html);
                            var htmlButtom = `<button class="btn-detalle card-footer btnVerArea" data-imagen="assets/img/resultados/ingenieriasLike.png" data-id="5">VER DETALLES</button>`
                            $("#buttonResultadoI").html(htmlButtom);
                    break;
                case 4:
                  resultadoI= "Alto";
                  $("#resultadoS").text(resultadoI);
                  $("#imagenResultadoI").slideDown();
                  $("#imagenResultadoDislikeI").slideUp();
                  var html = `<i class="mdi mdi-star"></i>
                            <i class="mdi mdi-star"></i>
                            <i class="mdi mdi-star"></i>
                            <i class="mdi mdi-star"></i>`
                            $("#starResultadoI").html(html);
                            var htmlButtom = `<button class="btn-detalle card-footer btnVerArea" data-imagen="assets/img/resultados/ingenieriasLike.png" data-id="5">VER DETALLES</button>`
                            $("#buttonResultadoI").html(htmlButtom);
                    break;
            }

            switch (resultado.d) 
            {
                case 0:
                  resultadoD= "Muy bajo";
                  $("#resultadoD").text(resultadoD);
                  $("#imagenResultadoD").slideUp();
                  $("#imagenResultadoDislikeD").slideDown();
                  var html = `<i class="mdi mdi-star-outline"></i>
                            <i class="mdi mdi-star-outline"></i>
                            <i class="mdi mdi-star-outline"></i>
                            <i class="mdi mdi-star-outline"></i>`
                            $("#starResultadoD").html(html);
                            var htmlButtom = `<button class="btn-detalle card-footer btnVerArea" data-imagen="assets/img/resultados/defensaDislike.png" data-id="6">VER DETALLES</button>`
                            $("#buttonResultadoD").html(htmlButtom);
                    break;
                case 1:
                  resultadoD= "Bajo";
                  $("#resultadoD").text(resultadoD);
                  $("#imagenResultadoD").slideUp();
                  $("#imagenResultadoDislikeD").slideDown();
                  var html = `<i class="mdi mdi-star"></i>
                            <i class="mdi mdi-star-outline"></i>
                            <i class="mdi mdi-star-outline"></i>
                            <i class="mdi mdi-star-outline"></i>`
                            $("#starResultadoD").html(html);
                            var htmlButtom = `<button class="btn-detalle card-footer btnVerArea" data-imagen="assets/img/resultados/defensaDislike.png" data-id="6">VER DETALLES</button>`
                            $("#buttonResultadoD").html(htmlButtom);
                    break;
                case 2:
                  resultadoD= "Medio Bajo";
                  $("#resultadoD").text(resultadoD);
                  $("#imagenResultadoD").slideUp();
                  $("#imagenResultadoDislikeD").slideDown();
                  var html = `<i class="mdi mdi-star"></i>
                            <i class="mdi mdi-star"></i>
                            <i class="mdi mdi-star-outline"></i>
                            <i class="mdi mdi-star-outline"></i>`
                            $("#starResultadoD").html(html);
                            var htmlButtom = `<button class="btn-detalle card-footer btnVerArea" data-imagen="assets/img/resultados/defensaDislike.png" data-id="6">VER DETALLES</button>`
                            $("#buttonResultadoD").html(htmlButtom);
                    break;
                case 3:
                  resultadoD= "Medio Alto";
                  $("#resultadoD").text(resultadoD);
                  $("#imagenResultadoD").slideDown();
                  $("#imagenResultadoDislikeD").slideUp();
                  var html = `<i class="mdi mdi-star"></i>
                            <i class="mdi mdi-star"></i>
                            <i class="mdi mdi-star"></i>
                            <i class="mdi mdi-star-outline"></i>`
                            $("#starResultadoD").html(html);
                            var htmlButtom = `<button class="btn-detalle card-footer btnVerArea" data-imagen="assets/img/resultados/agrariasLike.png" data-id="6">VER DETALLES</button>`
                            $("#buttonResultadoD").html(htmlButtom);
                    break;
                case 4:
                  resultadoD= "Alto";
                  $("#resultadoD").text(resultadoD);
                  $("#imagenResultadoD").slideDown();
                  $("#imagenResultadoDislikeD").slideUp();
                  var html = `<i class="mdi mdi-star"></i>
                            <i class="mdi mdi-star"></i>
                            <i class="mdi mdi-star"></i>
                            <i class="mdi mdi-star"></i>`
                            $("#starResultadoD").html(html);
                            var htmlButtom = `<button class="btn-detalle card-footer btnVerArea" data-imagen="assets/img/resultados/agrariasLike.png" data-id="6">VER DETALLES</button>`
                            $("#buttonResultadoD").html(htmlButtom);
                    break;
            }

            switch (resultado.e) 
            {
                case 0:
                  resultadoE= "Muy bajo";
                  $("#resultadoE").text(resultadoE);
                  $("#imagenResultadoE").slideUp();
                  $("#imagenResultadoDislikeE").slideDown();
                  var html = `<i class="mdi mdi-star-outline"></i>
                            <i class="mdi mdi-star-outline"></i>
                            <i class="mdi mdi-star-outline"></i>
                            <i class="mdi mdi-star-outline"></i>`
                            $("#starResultadoE").html(html);
                            var htmlButtom = `<button class="btn-detalle card-footer btnVerArea" data-imagen="assets/img/resultados/agrariasDisLike.png" data-id="7">VER DETALLES</button>`
                            $("#buttonResultadoE").html(htmlButtom);
                    break;
                case 1:
                  resultadoE= "Bajo";
                  $("#resultadoE").text(resultadoE);
                  $("#imagenResultadoE").slideUp();
                  $("#imagenResultadoDislikeE").slideDown();
                  var html = `<i class="mdi mdi-star"></i>
                            <i class="mdi mdi-star-outline"></i>
                            <i class="mdi mdi-star-outline"></i>
                            <i class="mdi mdi-star-outline"></i>`
                            $("#starResultadoE").html(html);
                            var htmlButtom = `<button class="btn-detalle card-footer btnVerArea" data-imagen="assets/img/resultados/agrariasDisLike.png" data-id="7">VER DETALLES</button>`
                            $("#buttonResultadoE").html(htmlButtom);
                    break;
                case 2:
                  resultadoE= "Medio Bajo";
                  $("#resultadoE").text(resultadoE);
                  $("#imagenResultadoE").slideUp();
                  $("#imagenResultadoDislikeE").slideDown();
                  var html = `<i class="mdi mdi-star"></i>
                            <i class="mdi mdi-star"></i>
                            <i class="mdi mdi-star-outline"></i>
                            <i class="mdi mdi-star-outline"></i>`
                            $("#starResultadoE").html(html);
                            var htmlButtom = `<button class="btn-detalle card-footer btnVerArea" data-imagen="assets/img/resultados/agrariasDisLike.png" data-id="7">VER DETALLES</button>`
                            $("#buttonResultadoE").html(htmlButtom);
                    break;
                case 3:
                  resultadoE= "Medio Alto";
                  $("#resultadoE").text(resultadoE);
                  $("#imagenResultadoE").slideDown();
                  $("#imagenResultadoDislikeE").slideUp();
                  var html = `<i class="mdi mdi-star"></i>
                            <i class="mdi mdi-star"></i>
                            <i class="mdi mdi-star"></i>
                            <i class="mdi mdi-star-outline"></i>`
                            $("#starResultadoE").html(html);
                            var htmlButtom = `<button class="btn-detalle card-footer btnVerArea" data-imagen="assets/img/resultados/agrariasLike.png" data-id="7">VER DETALLES</button>`
                            $("#buttonResultadoE").html(htmlButtom);
                    break;
                case 4:
                  resultadoE= "Alto";
                  $("#resultadoE").text(resultadoE);
                  $("#imagenResultadoE").slideDown();
                  $("#imagenResultadoDislikeE").slideUp();
                  var html = `<i class="mdi mdi-star"></i>
                            <i class="mdi mdi-star"></i>
                            <i class="mdi mdi-star"></i>
                            <i class="mdi mdi-star"></i>`
                            $("#starResultadoE").html(html);
                            var htmlButtom = `<button class="btn-detalle card-footer btnVerArea" data-imagen="assets/img/resultados/agrariasLike.png" data-id="7">VER DETALLES</button>`
                            $("#buttonResultadoE").html(htmlButtom);
                    break;
            }
            
            $("#loader").removeClass("active");
            
		},
		function(error)
		{
			$("#loader").removeClass("active");
            
			swal("", error, "error");
		}
    )

}

$(document).off("click", ".btnVerArea").on("click", ".btnVerArea", function(e)
{   
    var idAreaChaside = $(this).attr("data-id");
    
	$("#loader").addClass("active");

  
        var imagenArea = $(this).attr("data-imagen");
        Query.callAjax(
                "resultadoRoute/guardarIdArea",
                "POST",
                {idAreaChaside: idAreaChaside,imagenArea:imagenArea},
                function(resultado)
                {
                        window.open("/areaChasideRoute", "_self");
                        $("#loader").removeClass("active");
                },
                function(error)
                {
                        $("#loader").removeClass("active");
                
                        swal("", error, "error");
                }
        )

        
	
})