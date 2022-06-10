var express = require('express');
var router = express.Router();
var sG = require('./serviciosGenerales');
var md5 = require('md5');
var enviarEmail = require('./email');
var multiparty = require('multiparty');
var fs = require('fs');

router.get('/', function(req, res)
{
	var paramsRender = 
	{
		cssFile: '<link rel="stylesheet" type="text/css" href="assets/css/util.css"><link rel="stylesheet" type="text/css" href="assets/css/login.css">',
		jsFile: '<script src="assets/js/login.js" type="text/javascript"></script>'
	}
    res.render('login', paramsRender);

});

router.post('/validarLogin', function(req, res)
{
    
    var email = req.body.email;
    var contrasena = req.body.contrasena;

    var query = `SELECT 
                    usuarios.idUsuario,
                    usuarios.email,
                    usuarios.tipoUsuario
                 FROM usuarios 
                 WHERE usuarios.email = '${email}' AND
    			       usuarios.password = '${md5(contrasena)}'
                 AND usuarios.borrado = 0;`
    
    sG.listarRegistros(query, function(resultadoUsuario)
    {
    	if(resultadoUsuario.STATE == "TRUE")
    	{

    		var datosUsuario = resultadoUsuario.RESULT[0];
        var idUsuario = datosUsuario.idUsuario;
    		var tipoUsuario = datosUsuario.tipoUsuario;
            
        if(tipoUsuario ==1){
          var queryAdmin = `SELECT 
                            administrador.idAdministrador,
                            administrador.nombres,
                            administrador.apellidos,
                            usuarios.idUsuario,
                            usuarios.email,
                            usuarios.tipoUsuario,
                            usuarios.cambiarPassword
                            FROM administrador
                            INNER JOIN usuarios
                            on administrador.fkUsuario= usuarios.idUsuario
                            WHERE administrador.fkUsuario = '${idUsuario}';`
          
          sG.listarRegistros(queryAdmin, function(resultado)
          {
            if(resultado.STATE == "TRUE")
            {

              var datosAdmin = resultado.RESULT[0];

              //Creamos la sesión
              req.session.idUsuario = datosAdmin.idUsuario;
              req.session.email = datosAdmin.email;
              req.session.tipoUsuario = datosAdmin.tipoUsuario;
              req.session.idAdmin = datosAdmin.idAdministrador;
              req.session.nombres = datosAdmin.nombres;
              req.session.apellidos = datosAdmin.apellidos;
                  
              res.send(resultado);
            }

            else
            {
              res.send(resultado);
            }

          })

        }
        else{
          var queryEstudiante = `SELECT 
                            estudiante.idEstudiante,
                            estudiante.nombres,
                            estudiante.apellidos,
                            usuarios.idUsuario,
                            usuarios.email,
                            usuarios.tipoUsuario,
                            usuarios.cambiarPassword
                            FROM estudiante
                            INNER JOIN usuarios
                            on estudiante.fkUsuario= usuarios.idUsuario
                            WHERE estudiante.fkUsuario = '${idUsuario}';`

          sG.listarRegistros(queryEstudiante, function(resultado)
          {
            if(resultado.STATE == "TRUE")
            {

              var datosEstudiante = resultado.RESULT[0];

              //Creamos la sesión
              req.session.idUsuario = datosEstudiante .idUsuario;
              req.session.email = datosEstudiante .email;
              req.session.tipoUsuario = datosEstudiante.tipoUsuario;
              req.session.idEstudiante = datosEstudiante.idEstudiante;
              req.session.nombres = datosEstudiante.nombres;
              req.session.apellidos = datosEstudiante.apellidos;
                  
              res.send(resultado);
            }

            else
            {
              res.send(resultado);
            }

          })
        }
    		
    	}

    	else
    	{
    		res.send(resultadoUsuario);
    	}

    })

});

router.post('/validarEmail', function(req, res)
{
    
    var email = req.body.email;
  

    var query = `SELECT 
                    idUsuario,
                    tipoUsuario
                    FROM usuarios 
                    WHERE email = '${email}'
                    AND borrado = 0;`
    
    sG.listarRegistros(query, function(resultado)
    {
    	if(resultado.STATE == "TRUE")
    	{ 
    		res.send(resultado);
    	}

    	else
    	{
    		res.send(resultado);
    	}

    })

});

router.post('/validarEstado', function(req, res)
{
  var email = req.body.email;
  var tipoUsuario = req.body.tipoUsuario;

  var query=""
  

    query = `SELECT 
                usuarios.idUsuario
                FROM usuarios 
                WHERE usuarios.email = '${email}' 
                AND usuarios.activo= 1
                AND usuarios.borrado = 0;`
  

  sG.listarRegistros(query, function(resultado)
  {
      console.log(resultado);
      res.send(resultado);
  })

});

router.post('/validarRecordarPass', function(req, res)
{
    
    var email = req.body.email;
    var documento = req.body.documento;

    var query = `SELECT 
                 idUsuario
                 FROM usuarios 
                 INNER JOIN administrador 
                 ON administrador.fkUsuario=usuarios.idUsuario
                 WHERE email = '${email}' AND
    			       documento = '${documento}'
                 AND borrado = 0;`
    
    sG.listarRegistros(query, function(resultado)
    {
    	if(resultado.STATE == "TRUE")
    	{

    		res.send(resultado);
    	}

    	else
    	{
    		var query = `SELECT 
                 idUsuario
                 FROM usuarios 
                 INNER JOIN estudiante 
                 ON estudiante.fkUsuario=usuarios.idUsuario
                 WHERE email = '${email}' AND
    			       documento = '${documento}'
                 AND borrado = 0;`

        sG.listarRegistros(query, function(resultado)
        {
          if(resultado.STATE == "TRUE")
          {

            res.send(resultado);
          }

          else  
          {
          res.send(resultado);
          }

        })

    	}

    })

});

router.post('/restablecerPass', function(req, res)
{
    
    var email = req.body.email;
    var documento = req.body.documento;


    var contrasenaNueva =passwordAletoria(8);

    var queryContrasenaAnterior = `SELECT * FROM 
                                    usuarios
                                    WHERE email = '${email}' 
                                    AND borrado = 0;`
    

    sG.listarRegistros(queryContrasenaAnterior, function(resultadoContrasena)
    {
      if(resultadoContrasena.STATE == "TRUE"){
            var query = `UPDATE usuarios 
                                        SET password = '${md5(contrasenaNueva)}',
                                        cambiarPassword=1
                                        WHERE email = '${email}'
                                        AND borrado = 0;`

            sG.actualizarRegistro(query, function(resultado)
            {   
                var asunto="Cambio contraseña";
                var mensaje=contrasenaNueva;
                enviarEmail.password(email, asunto, mensaje, function(resultadoEmail){
            
                    if(resultadoEmail == true)
                    {
                      //insertamos en la tabla de email
    
                      var queryInsertEmail = `INSERT INTO emailPassword(
                                                                            emailDestino,
                                                                            asunto,
                                                                            mensaje
                                                                           
                                                                          )
                                                                  VALUES  (
                                                                            '${email}',
                                                                            '${asunto}',
                                                                            '${md5(mensaje)}'
                                        
                                                                          )`;
    
                      sG.insertarRegistro(queryInsertEmail, function(resultadoEmail)
                      {                                                    
                        res.send(resultadoEmail);
                      })
                    }
    
                    else
                    { 
                      var respuesta = {STATE: "FALSE"};
                      res.send(respuesta);
                    }
                
                })
            })
        }  
      else{
            res.send(resultado);
        }
    })
    

});

router.post('/listarTipoDocumentos', function(req, res)
{
    
    var query = `SELECT * FROM tipoDocumento;`
    
    sG.listarRegistros(query, function(resultado)
    {   
    		res.send(resultado);
    })

});

router.post('/listarMunicipios', function(req, res)
{
    
    var query = `SELECT * FROM municipio`
    
    sG.listarRegistros(query, function(resultado)
    {   
    		res.send(resultado);
    })

});

router.post('/crearEstudiante', function(req, res)
{
    
    //Obtenemos los datos del formulario
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
      if(err){
        var respuesta = {
                          STATE: "FALSE",
                          RESULT: "Se ha presentado un problema"
                        };

        res.send(respuesta);
        return;
      }

      else
      {
        //Datos
        var tipoDocumento= fields.inputTipoDocumentoFormCrear[0];
        var documento= fields.inputDocumentoFormCrear[0];
        var nombres= fields.inputNombresFormCrear[0];
        var apellidos= fields.inputApellidoFormCrear[0];
        var municipio= fields.selectMunicipioFormCrear[0];
        var colegio= fields.inputColegioFormCrear[0];
        var grado= fields.inputGradoFormCrear[0];
        var telefono= fields.inputTelefonoFormCrear[0];
        var correo= fields.inputEmailFormCrear[0];
        var password= fields.inputContraseñaFormCrear[0];
        var tyc= fields.tyc;


        var queryInsert=`SELECT insertarUsuario('${correo}',
                                                '${md5(password)}',
                                                2)AS idUsuario`;
                                                

        sG.listarRegistros(queryInsert, function(resultado)
        {  
          if(resultado.STATE== "TRUE"){
            var idUsuario=resultado.RESULT[0].idUsuario;

            var queryInsertEstudiante=`SELECT insertarEstudiante('${documento}',
                                                '${nombres}',
                                                '${apellidos}',
                                                '${colegio}',
                                                '${grado}',
                                                '${telefono}',
                                                 ${tyc},
                                                 ${tipoDocumento},
                                                 ${idUsuario},
                                                 ${municipio})AS idEstudiante`;
                                                 

            sG.listarRegistros(queryInsertEstudiante, function(resultadoEstudiante)
            {
              var idEstudiante=resultadoEstudiante.RESULT[0].idEstudiante;
              //Creamos la sesión
              req.session.idUsuario = idUsuario;
              req.session.email = correo;
              req.session.tipoUsuario = 2;
              req.session.idEstudiante = idEstudiante;
              req.session.nombres = nombres;
              req.session.apellidos = apellidos;
              
              
    		      res.send(resultadoEstudiante);
            })

          }
          else{
            res.send({STATE: "FALSE"});
            
          }
        })

      }
    })

});

router.post('/cambiarContrasena', function(req, res)
{
    //Obtenemos los datos del formulario
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
      if(err){
        var respuesta = {
                          STATE: "FALSE",
                          RESULT: "Se ha presentado un problema"
                        };

        res.send(respuesta);
        return;
      }

      var contrasenaNueva = md5(fields.repetirNuevaPass[0]);

      var queryContrasenaAnterior = `SELECT * FROM 
                                      usuarios
                                      WHERE idUsuario = ${req.session.idUsuario}`;

      sG.listarRegistros(queryContrasenaAnterior, function(resultadoContrasena)
      {
        if(resultadoContrasena.STATE == "TRUE")
        {
          var query = `UPDATE usuarios 
                                        SET password = '${contrasenaNueva}',
                                        cambiarPassword = 0
                                      WHERE idUsuario = ${req.session.idUsuario}`;

          sG.actualizarRegistro(query, function(resultado)
          {
            res.send(resultado);
          })
        }

        else
        {
          res.send({STATE: "FALSE"})
        }
      })
    })
        
})

function passwordAletoria(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }
 
 
module.exports = router;