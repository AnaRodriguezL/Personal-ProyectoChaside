var db = require('../db/db');

function listarRegistros(query, callback){

	db.connect(function(connection){

		db.query(connection, query, function(error, response){
			//console.log(response);
			if(error){

			  var respuesta = 	{		STATE: "FALSE",
			  							RESULT: error
			  					};
			  callback(respuesta);
			}
			else{

			  	if(response.length == 0){
					var respuesta = 	{		STATE: "FALSE",
												MESSAGE: "No se encontraron registros!",
												RESULT:[]
										};
			  	}else{
					var respuesta = 	{		STATE: "TRUE",
												RESULT: response
										};
			  	}
				callback(respuesta);
			}

			db.disconnect(connection);
		});

	});
	
}

function actualizarRegistro(query, callback){

	db.connect(function(connection){

		db.query(connection, query, function(error, response){
			if(error){
			  	var respuesta = 	{	STATE: "FALSE",
			  							RESULT: error
			  						};
			  	callback(respuesta);
			}
			else{
				var respuesta = 	{	STATE: "TRUE",
										RESULT: "Se ha actualizado correctamente el registro!"
									};
				callback(respuesta);
			}

			db.disconnect(connection);
		});
	})
}

function deleteRegistro(query, callback){

	db.connect(function(connection){

		db.query(connection, query, function(error, response){
			if(error){
			  	var respuesta = 	{	STATE: "FALSE",
			  							RESULT: error
			  						};
			  	callback(respuesta);
			}
			else{
				var respuesta = 	{	STATE: "TRUE",
										RESULT: "Se ha eliminado correctamente el registro!"
									};
				callback(respuesta);
			}

			db.disconnect(connection);
		});
	});
}

function insertarRegistro(query, callback){

	db.connect(function(connection){

		db.query(connection, query, function(error, response){
			if(error){
			  	var respuesta = 	{	
			  							STATE: "FALSE",
			  							RESULT: error,
			  							RESPONSE: response
			  						};
			  	callback(respuesta);
			}else{
				var respuesta = 	{	
										STATE: "TRUE",
										RESULT: "Se ha insertado correctamente el registro!",
										RESPONSE: response
									};
				callback(respuesta);
			}

			db.disconnect(connection);
		});
	})
}

exports.listarRegistros 		= listarRegistros;
exports.actualizarRegistro 	= actualizarRegistro;
exports.insertarRegistro  	= insertarRegistro;
exports.deleteRegistro 			= deleteRegistro;
