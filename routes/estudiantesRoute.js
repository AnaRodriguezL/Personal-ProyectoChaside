var express = require("express");
var router = express.Router();
var sG = require("./serviciosGenerales");
var validarSesion = require("./validarSesiones");
var multiparty = require("multiparty");
var fs = require("fs");
var xl = require('excel4node');

router.get("/", function (req, res) {
    validarSesion.validarSesionAdmin(req.session, function (estado) {
        if (estado == false) {
            req.session.destroy();
            res.redirect("/");
        } else {
            var paramsRender = {
                nombreCompleto:
                    req.session.nombres,
                layout: "templateAdmin.hbs",
                jsFile: '<script src="assets/js/admin/estudiantes.js" type="text/javascript"></script>',
                logoEmpresa: req.session.logoEmpresa,
                fotoUsuario: req.session.fotoUsuario,
            };
            res.render("admin/estudiantes", paramsRender);
        }
    });
});

router.post("/estudiantesDT", function (req, res) {
    validarSesion.validarSesionAdmin(req.session, function (estado) {
        if (estado == false) {
            req.session.destroy();
            res.send({ STATE: "FALSE" });
        } else {
            var params = req.body;
            var strFecha=params["columns[8][search][value]"]
            if(strFecha==""){
                strFechaVacio= "OR prueba.fechaFinalizacion IS NULL"
            }
            else{
                strFechaVacio="";
            }
            

            var queryCantidad = `
                            SELECT count(*) AS cantidad
                            FROM estudiante
                            INNER JOIN tipodocumento ON tipodocumento.idDocumento=estudiante.tipo_documento
                            INNER JOIN usuarios ON usuarios.idUsuario=estudiante.fkUsuario
                            INNER JOIN municipio ON municipio.id_municipio=estudiante.id_municipio
                            LEFT JOIN prueba ON prueba.fkEstudiante=estudiante.idEstudiante
                            WHERE estudiante.nombres LIKE '%${params["columns[0][search][value]"]}%' 
                             AND estudiante.documento LIKE '%${params["columns[1][search][value]"]}%'
                             AND municipio.nombre LIKE '%${params["columns[2][search][value]"]}%' 
                             AND estudiante.colegio LIKE '%${params["columns[3][search][value]"]}%'
                             AND estudiante.grado LIKE '%${params["columns[4][search][value]"]}%'
                             AND estudiante.telefono LIKE '%${params["columns[5][search][value]"]}%'
                             AND usuarios.email LIKE '%${params["columns[6][search][value]"]}%'
                             AND estudiante.tyc LIKE '%${params["columns[7][search][value]"]}%'
                             AND(prueba.fechaFinalizacion LIKE '%${params["columns[8][search][value]"]}%' ${strFechaVacio})
                             GROUP BY estudiante.idEstudiante`;

            sG.listarRegistros(queryCantidad, function (cantidad) {
                var cantidad = cantidad.RESULT.length;
              
               
                switch (parseInt(params["order[0][column]"])) {
                    case 0:
                        orden = `
                    ORDER BY
                    estudiante.nombres ${params["order[0][dir]"]}
                  `;
                        break;
                    case 1:
                        orden = `
                    ORDER BY
                    estudiante.documento ${params["order[0][dir]"]}
                    `;
                        break;
                    case 2:
                        orden = `
                    ORDER BY
                    municipio.nombre ${params["order[0][dir]"]}
                    `;
                        break;
                    case 3:
                        orden = `
                  ORDER BY
                    estudiante.colegio ${params["order[0][dir]"]}
                    `;
                        break;
                    case 4:
                        orden = `
                  ORDER BY
                    estudiante.grado ${params["order[0][dir]"]}
                    `;
                        break;
                    case 5:
                        orden = `
                  ORDER BY
                    estudiante.telefono ${params["order[0][dir]"]}
                    `;
                        break;
                    case 6:
                        orden = `
                ORDER BY
                  usuarios.email ${params["order[0][dir]"]}
                  `;
                        break;
                    case 7:
                        orden = `
                ORDER BY
                  estudiante.tyc ${params["order[0][dir]"]}
                  `;
                        break;
                    case 8:
                            orden = `
                ORDER BY
                   prueba.fechaFinalizacion ${params["order[0][dir]"]}
                      `;
                            break;
                    default:
                        res.send("");
                        return;
                }

                var limite = `LIMIT ${params.start},${params.length}`;
                if (parseInt(params.length) == -1) {
                    limite = "";
                }

                
                var query = `SELECT
                estudiante.idEstudiante AS idEstudiante,
                CONCAT(estudiante.nombres," ", estudiante.apellidos) AS nombres,
                estudiante.documento AS documento,
                municipio.nombre AS municipios,
                estudiante.colegio AS colegio,
                estudiante.grado AS grado,
                estudiante.telefono AS telefono,
                usuarios.email AS email,
                if(estudiante.tyc=1,'Si','No') AS tyc,
                if((MAX(prueba.fechaFinalizacion))IS NULL,'No tiene',MAX(prueba.fechaFinalizacion)) AS fechaPrueba,
                DATE_FORMAT(estudiante.fechaActualizacion, "%d-%m-%Y") AS fechaActualizacion
                FROM estudiante
                INNER JOIN tipodocumento ON tipodocumento.idDocumento=estudiante.tipo_documento
                INNER JOIN usuarios ON usuarios.idUsuario=estudiante.fkUsuario
                INNER JOIN municipio ON municipio.id_municipio=estudiante.id_municipio
                LEFT JOIN prueba ON prueba.fkEstudiante=estudiante.idEstudiante
                
                      WHERE (estudiante.nombres LIKE '%${params["columns[0][search][value]"]}%' OR estudiante.apellidos LIKE '%${params["columns[0][search][value]"]}%')
                             AND estudiante.documento LIKE '%${params["columns[1][search][value]"]}%'
                             AND municipio.nombre LIKE '%${params["columns[2][search][value]"]}%'
                             AND estudiante.colegio LIKE '%${params["columns[3][search][value]"]}%'
                             AND estudiante.grado LIKE '%${params["columns[4][search][value]"]}%'
                             AND estudiante.telefono LIKE '%${params["columns[5][search][value]"]}%'
                             AND usuarios.email LIKE '%${params["columns[6][search][value]"]}%'
                             AND estudiante.tyc LIKE '%${params["columns[7][search][value]"]}%'
                             AND(prueba.fechaFinalizacion LIKE '%${params["columns[8][search][value]"]}%' ${strFechaVacio})
                             AND estudiante.fechaActualizacion LIKE '%${params["columns[9][search][value]"]}%'
                             GROUP BY estudiante.idEstudiante
                             
                     ${orden}          
                     ${limite} `;

                sG.listarRegistros(query, function (resultado) {
                    
                    req.session.queryExcel =query;
                    var respuesta = {
                        draw: params.draw,
                        recordsTotal: cantidad,
                        recordsFiltered: cantidad,
                        data: resultado.RESULT,
                    };
                    console.log(respuesta)
                    res.send(respuesta);
                });
            });
        }
    });
});


router.get('/excel', function(req, res)
{
  validarSesion.validarSesionAdmin(req.session, function(estado)
  {
    if(estado == false)
    {
      req.session.destroy();
      res.redirect("/");
    }
    else
    {  
        var query = req.session.queryExcel;

      sG.listarRegistros(query, function(resultado)
      {
        var datos = resultado.RESULT;

        var options = {
            sheetFormat: {
              baseColWidth: 20
            },
        };

        var wb = new xl.Workbook();
        var hoja1 = wb.addWorksheet('Sheet 1', options);
        var color = "e6f9cf";
        var colorLetra='#000000';

        hoja1.cell(1, 1).string("Nombre").style({fill: {type: 'pattern', patternType: 'solid', fgColor: color}});
        hoja1.cell(1, 2).string("Documento").style({fill: {type: 'pattern', patternType: 'solid', fgColor: color}});
        hoja1.cell(1, 3).string("Municipio").style({fill: {type: 'pattern', patternType: 'solid', fgColor: color}});
        hoja1.cell(1, 4).string("Colegio").style({fill: {type: 'pattern', patternType: 'solid', fgColor: color}});
        hoja1.cell(1, 5).string("Grado").style({fill: {type: 'pattern', patternType: 'solid', fgColor: color}});
        hoja1.cell(1, 6).string("Telefono").style({fill: {type: 'pattern', patternType: 'solid', fgColor: color}});
        hoja1.cell(1, 7).string("Email").style({fill: {type: 'pattern', patternType: 'solid', fgColor: color}});
        hoja1.cell(1, 8).string("TyC").style({fill: {type: 'pattern', patternType: 'solid', fgColor: color}});
        hoja1.cell(1, 9).string("Fecha Ultima Prueba").style({fill: {type: 'pattern', patternType: 'solid', fgColor: color}});
        hoja1.cell(1, 10).string("Fecha Actualización").style({fill: {type: 'pattern', patternType: 'solid', fgColor: color}});

        datos.forEach( function(element, index) 
        {
          
          colorLetra='#000000';

         
          hoja1.cell(index+2, 1).string(element.nombres).style({font:{color:colorLetra}});
          hoja1.cell(index+2, 2).string(element.documento).style({font:{color:colorLetra}});
          hoja1.cell(index+2, 3).string(element.municipios).style({font:{color:colorLetra}});
          hoja1.cell(index+2, 4).string(element.colegio).style({font:{color:colorLetra}});
          hoja1.cell(index+2, 5).string(element.grado).style({font:{color:colorLetra}});
          hoja1.cell(index+2, 6).string(element.telefono).style({font:{color:colorLetra}});
          hoja1.cell(index+2, 7).string(element.email).style({font:{color:colorLetra}});
          hoja1.cell(index+2, 8).string(element.tyc).style({font:{color:colorLetra}});
          hoja1.cell(index+2, 9).string(element.fechaPrueba).style({font:{color:colorLetra}});
          hoja1.cell(index+2, 10).string(element.fechaActualizacion).style({font:{color:colorLetra}});
          
        });

        wb.write('Excel.xlsx', res);
        
      })
    }
  })
})
module.exports = router;
