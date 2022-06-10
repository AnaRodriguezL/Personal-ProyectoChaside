var sG = require('./serviciosGenerales');

function validarSesionAdmin(sesion, callback)
{
	//Validamos que el usuario exista en la bd

	var query = `SELECT * FROM usuarios 
				 WHERE idUsuario = ${sesion.idUsuario}
				 AND email = '${sesion.email}'
				 AND tipoUsuario = 1`;
	sG.listarRegistros(query, function(resultado)
	{
		if(resultado.STATE == "TRUE")
		{
			callback(true);
		}

		else
		{
			callback(false);
		}
	});

}


function validarSesionEstudiante(sesion, callback)
{
	//Validamos que el usuario exista en la bd

	var query = `SELECT * FROM usuarios 
				 WHERE idUsuario = ${sesion.idUsuario}
				 AND email = '${sesion.email}'
				 AND tipoUsuario = 2`;
	sG.listarRegistros(query, function(resultado)
	{
		if(resultado.STATE == "TRUE")
		{
			callback(true);
		}

		else
		{
			callback(false);
		}
	});

}

function validarSesionAdminSuperAdmin(sesion, callback)
{
	//Validamos que el usuario exista en la bd

	var query = `SELECT * FROM usuarios 
				 WHERE idUsuario = ${sesion.idUsuario}
				 AND nombres = '${sesion.nombres}'
				 AND apellidos = '${sesion.apellidos}'
				 AND email = '${sesion.email}'
				 AND telefono = ${sesion.telefono}
				 AND (tipoUsuario = 1 OR tipoUsuario = 2 OR tipoUsuario = 3)`;
	sG.listarRegistros(query, function(resultado)
	{
		if(resultado.STATE == "TRUE")
		{
			callback(true);
		}

		else
		{
			callback(false);
		}
	});

}


exports.validarSesionEstudiante = validarSesionEstudiante;
exports.validarSesionAdmin = validarSesionAdmin;
exports.validarSesionAdminSuperAdmin = validarSesionAdminSuperAdmin;
