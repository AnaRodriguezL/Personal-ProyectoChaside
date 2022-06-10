var express = require('express');
var router = express.Router();
var sG = require('./serviciosGenerales');
var validarSesion = require('./validarSesiones');
var md5 = require('md5');

router.post('/tipoDocumentosDT', function(req, res)
{

  validarSesion.validarSesionAdmin(req.session, function(estado)
  {
  	if(estado == false)
  	{
  		// req.session.destroy();
      // res.send(false);
      
      validarSesion.validarSesionEstudiante(req.session, function(estado)
      {
        if(estado == false)
        {
          req.session.destroy();
          res.send(false);
          // res.redirect('/');
        }
        else
        {	
          var queryCantidad = `SELECT count(*) AS cantidad FROM tipoDocumentos 
                               WHERE borrado = 0
                               AND (
                                    fkEmpresa = ${req.session.idEmpresa}
                                    OR fkEmpresa IS NULL
                                   )`;
    
          sG.listarRegistros(queryCantidad, function(cantidad)
          {
            var cantidad = cantidad.RESULT[0].cantidad;
            var params = req.body;
    
            switch(parseInt(params["order[0][column]"])) 
            {
                case 0:
                    orden = `
                          ORDER BY
                          idTipoDocumento ${params["order[0][dir]"]}
                        `;
                    break;
                case 1:
                    orden = `
                          ORDER BY
                          nombre ${params["order[0][dir]"]}
                          `;
                        break;
                default:
                  res.send("");
                    return;
            }
    
            var limite = `LIMIT ${params.start},${params.length}`;
            if (parseInt(params.length) == -1) 
            {
              limite = "";
            }
    
            var query = `SELECT * FROM tipoDocumentos 
                         WHERE borrado = 0
                         AND (
                              fkEmpresa = ${req.session.idEmpresa}
                              OR fkEmpresa IS NULL
                             )
                         ${orden}          
                         ${limite} `;
    
            sG.listarRegistros(query, function(resultado)
            {
              var respuesta =   { draw: params.draw,
                                  recordsTotal: cantidad,
                                  recordsFiltered: cantidad,
                                  data: resultado.RESULT
                                };
    
              res.send(respuesta);
            })
          })
        }
      });
  	}

  	else
  	{	
      var queryCantidad = `SELECT count(*) AS cantidad FROM tipoDocumentos 
                           WHERE borrado = 0
                           AND (
                                fkEmpresa = ${req.session.idEmpresa}
                                OR fkEmpresa IS NULL
                               )`;

      sG.listarRegistros(queryCantidad, function(cantidad)
      {
        var cantidad = cantidad.RESULT[0].cantidad;
        var params = req.body;

        switch(parseInt(params["order[0][column]"])) 
        {
            case 0:
                orden = `
                      ORDER BY
                      idTipoDocumento ${params["order[0][dir]"]}
                    `;
                break;
            case 1:
                orden = `
                      ORDER BY
                      nombre ${params["order[0][dir]"]}
                      `;
                    break;
            default:
              res.send("");
                return;
        }

        var limite = `LIMIT ${params.start},${params.length}`;
        if (parseInt(params.length) == -1) 
        {
          limite = "";
        }

        var query = `SELECT * FROM tipoDocumentos 
                     WHERE borrado = 0
                     AND (
                          fkEmpresa = ${req.session.idEmpresa}
                          OR fkEmpresa IS NULL
                         )
                     ${orden}          
                     ${limite} `;

        sG.listarRegistros(query, function(resultado)
        {
          var respuesta =   { draw: params.draw,
                              recordsTotal: cantidad,
                              recordsFiltered: cantidad,
                              data: resultado.RESULT
                            };

          res.send(respuesta);
        })
      })
  	}
  })

});

router.post('/listarTipoDocumentos', function(req, res)
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
                res.send({STATE: "FALSE"});
                // res.redirect('/');
              }
              else
              { 
                var query = `SELECT * FROM tipoDocumentos WHERE borrado = 0
                             AND (
                                  fkEmpresa = ${req.session.idEmpresa}
                                  OR fkEmpresa IS NULL
                                 )`;
        
                sG.listarRegistros(query, function(resultado)
                {
                  res.send(resultado);
                })
              }
            });
        
      }

      else
      { 
        var query = `SELECT * FROM tipoDocumentos WHERE borrado = 0
                     AND (
                          fkEmpresa = ${req.session.idEmpresa}
                          OR fkEmpresa IS NULL
                         )`;

        sG.listarRegistros(query, function(resultado)
        {
          res.send(resultado);
        })
      }
    })

});

module.exports = router;