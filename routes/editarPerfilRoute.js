var express = require('express');
var router = express.Router();
var sG = require('./serviciosGenerales');
var validarSesion = require('./validarSesiones');
var md5 = require('md5');
var multiparty = require('multiparty');
var fs = require('fs');

router.get('/', function(req, res)
{
  validarSesion.validarSesionAdmin(req.session, function(estado)
  {
    if(estado == false)
    {
      
      validarSesion.validarSesionEstudiante(req.session, function(estado)
      {
        if(estado == false)
        {
          req.session.destroy();
          res.redirect('/');
        }
        else
        {
          var paramsRender = 
          {
            nombreCompleto: req.session.nombres,
            layout: 'templateEstudiante.hbs',
            jsFile: '<script src="assets/js/editarPerfil.js" type="text/javascript"></script>',
            logoEmpresa: req.session.logoEmpresa,
            fotoUsuario: req.session.fotoUsuario
          }
          res.render('editarPerfil', paramsRender);
        }
      })

    }

    else
    {
      var paramsRender = 
      {
        nombreCompleto: req.session.nombres,
        layout: 'templateAdmin.hbs',
        jsFile: '<script src="assets/js/editarPerfil.js" type="text/javascript"></script>',
        logoEmpresa: req.session.logoEmpresa,
        fotoUsuario: req.session.fotoUsuario
      }

      res.render('editarPerfilAdmin', paramsRender);
    }
  })
});

router.post('/datosUsuario', function(req, res)
{
  validarSesion.validarSesionAdmin(req.session, function(estado)
  {
    if(estado == false)
    {
      
      validarSesion.validarSesionEstudiante(req.session, function(estado)
      {
        if(estado == false)
        {
          req.session.destroy();
          res.redirect('/');
        }
        else
        {
          var idUsuario = req.session.idUsuario;

          var query = `SELECT * FROM estudiante
          INNER JOIN usuarios on estudiante.fkUsuario=usuarios.idUsuario
          INNER JOIN tipoDocumento on estudiante.tipo_documento=tipoDocumento.idDocumento
          INNER JOIN municipio on estudiante.id_municipio=municipio.id_municipio
          WHERE usuarios.idUsuario = ${idUsuario}`;

          sG.listarRegistros(query, function(resultado)
          { 
            res.send(resultado);
          })
        }
      })

    }

    else
    {
      var idUsuario = req.session.idUsuario;

      var query = `SELECT * FROM administrador
                    INNER JOIN usuarios on administrador.fkUsuario=usuarios.idUsuario
                    INNER JOIN tipoDocumento on administrador.tipo_documento=tipoDocumento.idDocumento
                    WHERE usuarios.idUsuario = ${idUsuario}`;

      sG.listarRegistros(query, function(resultado)
      { 
        res.send(resultado);
      })
    }
  })
})

router.post('/validarEmail', function(req, res)
{
  validarSesion.validarSesionAdmin(req.session, function(estado)
  {
    if(estado == false)
    {
       
      validarSesion.validarSesionEstudiante(req.session, function(estado)
      {
        if(estado == false)
        {
          req.session.destroy();
          res.redirect('/');
            
        }
    
        else
        {
          var email = req.body.email;
    
          var query = `SELECT * FROM usuarios WHERE email = '${email}'
                        AND borrado = 0 AND idUsuario != ${req.session.idUsuario}`;
    
          sG.listarRegistros(query, function(resultado)
          {
            res.send(resultado);
          })
        }
      }) 
    }

    else
    {
      var email = req.body.email;

      var query = `SELECT * FROM usuarios WHERE email = '${email}'
                    AND borrado = 0 AND idUsuario != ${req.session.idUsuario}`;

      sG.listarRegistros(query, function(resultado)
      {
        res.send(resultado);
      })
    }
  })  
})

router.post('/editarDatos', function(req, res)
{
  validarSesion.validarSesionAdmin(req.session, function(estado)
  {
    if(estado == false)
    {
      validarSesion.validarSesionEstudiante(req.session, function(estado)
      {
        if(estado == false)
        {
            req.session.destroy();
            res.redirect('/');
        }
    
        else
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
    
            var tipoDocumento= fields.selectTipoDocumentoFormEditar[0];
            var documento= fields.inputDocumentoFormEditar[0];
            var nombres= fields.inputNombreFormEditar[0];
            var apellidos= fields.inputApellidoFormEditar[0];
            var telefono= fields.inputTelefonoFormEditar[0];
            var correo= fields.inputEmailFormEditar[0];
            var municipio= fields.selectMunicipioFormEditar[0];
            var colegio= fields.inputColegioFormEditar[0];
            var grado= fields.selectGradoFormEditar[0];

            
            //var tyc= fields.tyc;

            var fecha = new Date();
                        var dia = ("0" + fecha.getDate()).slice(-2);
                        var mes = ("0" + (fecha.getMonth() + 1)).slice(-2);
                        var hora=fecha.getHours();
                        var minutos=fecha.getMinutes();
                        var segundos=fecha.getSeconds();
                        fecha= fecha.getFullYear()+"-"+(mes)+"-"+(dia)+" "+(hora)+":"+(minutos)+":"+(segundos);
    
            
              var query = `UPDATE usuarios INNER JOIN estudiante 
                             ON usuarios.idUsuario=estudiante.fkUsuario 
                             SET documento = ${documento},
                             tipo_documento=${tipoDocumento},
                             nombres = '${nombres}',
                             apellidos = '${apellidos}',
                             telefono = ${telefono},
                             id_municipio= ${municipio},
                             colegio= '${colegio}',
                             grado= '${grado}',
                             email = '${correo}',
                             estudiante.fechaActualizacion='${fecha}'
                             WHERE idUsuario = '${req.session.idUsuario}'
                             `;
    
              sG.actualizarRegistro(query, function(resultado)
              {
                req.session.nombres = nombres;
                req.session.apellidos = apellidos;
                req.session.email = correo;
                req.session.telefono = telefono;
                res.send(resultado);
                
              })
            
    
           
    
          })
    
        }
      })  
    }

    else
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

        var tipoDocumento= fields.selectTipoDocumentoFormEditar[0];
        var documento= fields.inputDocumentoFormEditar[0];
        var nombres= fields.inputNombreFormEditar[0];
        var apellidos= fields.inputApellidoFormEditar[0];
        var telefono= fields.inputTelefonoFormEditar[0];
        var correo= fields.inputEmailFormEditar[0];
        //var tyc= fields.tyc;

        
          var query = `UPDATE usuarios INNER JOIN administrador 
                         ON usuarios.idUsuario=administrador.fkUsuario 
                         SET documento = ${documento},
                         tipo_documento=${tipoDocumento},
                         nombres = '${nombres}',
                         apellidos = '${apellidos}',
                         telefono = ${telefono},
                         email = '${correo}'
                         WHERE idUsuario = '${req.session.idUsuario}'
                         `;

          sG.actualizarRegistro(query, function(resultado)
          {
            req.session.nombres = nombres;
            req.session.apellidos = apellidos;
            req.session.email = correo;
            req.session.telefono = telefono;
            res.send(resultado);
          })
        

       

      })

    }
  })  
})

router.post('/editarContrasena', function(req, res)
{
  validarSesion.validarSesionAdmin(req.session, function(estado)
  {
    if(estado == false)
    {
      validarSesion.validarSesionEstudiante(req.session, function(estado)
      {
        if(estado == false)
        {
          req.session.destroy();
          res.redirect('/');
        }
    
        else
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
    
            var contrasenaAnterior = md5(fields.inputContrasenaAnterior[0]);
            var contrasenaNueva = md5(fields.inputContrasenaNueva[0]);
    
            var queryContrasenaAnterior = `SELECT * FROM 
                                            usuarios
                                            WHERE idUsuario = ${req.session.idUsuario}
                                            AND password = '${contrasenaAnterior}'`;
    
            sG.listarRegistros(queryContrasenaAnterior, function(resultadoContrasena)
            {
              if(resultadoContrasena.STATE == "TRUE")
              {
                var query = `UPDATE usuarios 
                                              SET password = '${contrasenaNueva}'
                                            WHERE idUsuario = ${req.session.idUsuario}`;
    
                sG.actualizarRegistro(query, function(resultado)
                {
                  res.send(resultado);
                })
              }
    
              else
              {
                res.send({STATE: "FALSE", MESSAGE: "No coincide la contraseña anterior"});
              }
            })
          })
        }
      })
    }

    else
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

        var contrasenaAnterior = md5(fields.inputContrasenaAnterior[0]);
        var contrasenaNueva = md5(fields.inputContrasenaNueva[0]);

        var queryContrasenaAnterior = `SELECT * FROM 
                                        usuarios
                                        WHERE idUsuario = ${req.session.idUsuario}
                                        AND password = '${contrasenaAnterior}'`;

        sG.listarRegistros(queryContrasenaAnterior, function(resultadoContrasena)
        {
          if(resultadoContrasena.STATE == "TRUE")
          {
            var query = `UPDATE usuarios 
                                          SET password = '${contrasenaNueva}'
                                        WHERE idUsuario = ${req.session.idUsuario}`;

            sG.actualizarRegistro(query, function(resultado)
            {
              res.send(resultado);
            })
          }

          else
          {
            res.send({STATE: "FALSE", MESSAGE: "No coincide la contraseña anterior"});
          }
        })
      })
    }
  })
})


module.exports = router;