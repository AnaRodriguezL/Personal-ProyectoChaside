$(document).ready(function () 
{

	$('#btnAbrirSidebar').toggleClass('active');

    $('#btnCerrarSidebar').on('click', function () 
    {

        $('#sidebar, #btnAbrirSidebar').toggleClass('active');

    });

    $('#btnAbrirSidebar').on('click', function () 
    {

    	$('#sidebar, #btnAbrirSidebar').toggleClass('active');

    });

});