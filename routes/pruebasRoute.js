var express = require("express");
var router = express.Router();
var sG = require("./serviciosGenerales");
var validarSesion = require("./validarSesiones");
var multiparty = require("multiparty");
var fs = require("fs");
var enviarEmail = require('./email');
var PdfPrinter = require('pdfmake');

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
                jsFile: '<script src="assets/js/admin/pruebas.js" type="text/javascript"></script>',
                logoEmpresa: req.session.logoEmpresa,
                fotoUsuario: req.session.fotoUsuario,
            };
            res.render("admin/pruebas", paramsRender);
        }
    });
});

router.post("/pruebasDT", function (req, res) {
    validarSesion.validarSesionAdmin(req.session, function (estado) {
        if (estado == false) {
            req.session.destroy();
            res.send({ STATE: "FALSE" });
        } else {
            var params = req.body;
            
            

            var queryCantidad = `
                            SELECT count(*) AS cantidad
                            FROM estudiante
                INNER JOIN prueba ON prueba.fkEstudiante=estudiante.idEstudiante
                INNER JOIN respuestas on respuestas.fkPrueba=prueba.idPrueba
                INNER JOIN pregunta ON pregunta.idPregunta=respuestas.fkPregunta
                
                      WHERE (estudiante.nombres LIKE '%${params["columns[0][search][value]"]}%' OR estudiante.apellidos LIKE '%${params["columns[0][search][value]"]}%')
                             AND estudiante.colegio LIKE '%${params["columns[1][search][value]"]}%'
                             AND prueba.fechaFinalizacion LIKE '%${params["columns[3][search][value]"]}%'
                             GROUP BY idPrueba`

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
                    estudiante.colegio ${params["order[0][dir]"]}
                    `;
                        break;
                    case 2:
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

                
                var query = `SELECT prueba.idPrueba AS idPrueba,
                CONCAT(estudiante.nombres," ", estudiante.apellidos) AS nombres,
                estudiante.colegio AS colegio,
                SUM(if(pregunta.fkArea=1,respuestas.respuesta,0)) AS c,
                SUM(if(pregunta.fkArea=2,respuestas.respuesta,0)) AS h,
                SUM(if(pregunta.fkArea=3,respuestas.respuesta,0)) AS a,
                SUM(if(pregunta.fkArea=4,respuestas.respuesta,0)) AS s,
                SUM(if(pregunta.fkArea=5,respuestas.respuesta,0)) AS i,
                SUM(if(pregunta.fkArea=6,respuestas.respuesta,0)) AS d,
                SUM(if(pregunta.fkArea=7,respuestas.respuesta,0)) AS e,
                DATE_FORMAT(prueba.fechaFinalizacion, "%d-%m-%Y") AS fecha
                FROM estudiante
                INNER JOIN prueba ON prueba.fkEstudiante=estudiante.idEstudiante
                INNER JOIN respuestas on respuestas.fkPrueba=prueba.idPrueba
                INNER JOIN pregunta ON pregunta.idPregunta=respuestas.fkPregunta
                
                      WHERE (estudiante.nombres LIKE '%${params["columns[0][search][value]"]}%' OR estudiante.apellidos LIKE '%${params["columns[0][search][value]"]}%')
                             AND estudiante.colegio LIKE '%${params["columns[1][search][value]"]}%'
                             AND prueba.fechaFinalizacion LIKE '%${params["columns[3][search][value]"]}%'
                             GROUP BY idPrueba
                             
                     ${orden}          
                     ${limite} `;

                sG.listarRegistros(query, function (resultado) {
                    
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

router.post('/generarPdf', function(req, res)
{
  validarSesion.validarSesionAdmin(req.session, function(estado)
  {
  	if(estado == false)
  	{
  		req.session.destroy();
  		res.redirect('/');
  	}

  	else
  	{
      var idPrueba = req.body.idPrueba;
      var query = `SELECT prueba.idPrueba AS idPrueba,
      CONCAT(estudiante.nombres," ", estudiante.apellidos) AS nombres,
      estudiante.documento AS documento,
      SUM(if(pregunta.fkArea=1,respuestas.respuesta,0)) AS c,
      SUM(if(pregunta.fkArea=2,respuestas.respuesta,0)) AS h,
      SUM(if(pregunta.fkArea=3,respuestas.respuesta,0)) AS a,
      SUM(if(pregunta.fkArea=4,respuestas.respuesta,0)) AS s,
      SUM(if(pregunta.fkArea=5,respuestas.respuesta,0)) AS i,
      SUM(if(pregunta.fkArea=6,respuestas.respuesta,0)) AS d,
      SUM(if(pregunta.fkArea=7,respuestas.respuesta,0)) AS e,
      DATE_FORMAT(prueba.fechaFinalizacion, "%d/%M/%Y") AS fechaPrueba,
      Date_format(now(),'%d/%M/%Y')AS fechaActual
      FROM estudiante
      INNER JOIN prueba ON prueba.fkEstudiante=estudiante.idEstudiante
      INNER JOIN respuestas on respuestas.fkPrueba=prueba.idPrueba
      INNER JOIN pregunta ON pregunta.idPregunta=respuestas.fkPregunta
      WHERE prueba.idPrueba=${idPrueba}`;
      
      sG.listarRegistros(query, function (resultado) {
        if(resultado.STATE == "TRUE")
        {
          var queryArea = `SELECT * FROM area`

          sG.listarRegistros(queryArea, function (resultadoArea) {
            if(resultadoArea.STATE == "TRUE")
            {
              var datosAreas = resultadoArea.RESULT;
              var datosPdf = resultado.RESULT[0];
              var resultadoC="";
              var resultadoH="";
              var resultadoA="";
              var resultadoS="";
              var resultadoI="";
              var resultadoD="";
              var resultadoE="";
              var resultadosLetras=[];
       
              switch (datosPdf.c) 
              {
                  case 0:
                    resultadoC= "Muy bajo";
                    resultadosLetras.push(resultadoC)
                      break;
                  case 1:
                    resultadoC= "Bajo";
                    resultadosLetras.push(resultadoC)
                      break;
                  case 2:
                    resultadoC= "Medio Bajo";
                    resultadosLetras.push(resultadoC)
                      break;
                  case 3:
                    resultadoC= "Medio Alto";
                    resultadosLetras.push(resultadoC)
                      break;
                  case 4:
                    resultadoC= "Alto";
                    resultadosLetras.push(resultadoC)
                      break;
              }
    
              switch (datosPdf.h) 
              {
                  case 0:
                    resultadoH= "Muy bajo";
                    resultadosLetras.push(resultadoH)
                      break;
                  case 1:
                    resultadoH= "Bajo";
                    resultadosLetras.push(resultadoH)
                      break;
                  case 2:
                    resultadoH= "Medio Bajo";
                    resultadosLetras.push(resultadoH)
                      break;
                  case 3:
                    resultadoH= "Medio Alto";
                    resultadosLetras.push(resultadoH)
                      break;
                  case 4:
                    resultadoH= "Alto";
                    resultadosLetras.push(resultadoH)
                      break;
              }
            
              switch (datosPdf.a) 
              {
                  case 0:
                    resultadoA= "Muy bajo";
                    resultadosLetras.push(resultadoA)
                      break;
                  case 1:
                    resultadoA= "Bajo";
                    resultadosLetras.push(resultadoA)
                      break;
                  case 2:
                    resultadoA= "Medio Bajo";
                    resultadosLetras.push(resultadoA)
                      break;
                  case 3:
                    resultadoA= "Medio Alto";
                    resultadosLetras.push(resultadoA)
                      break;
                  case 4:
                    resultadoA= "Alto";
                    resultadosLetras.push(resultadoA)
                      break;
              }
    
              switch (datosPdf.s) 
              {
                  case 0:
                    resultadoS= "Muy bajo";
                    resultadosLetras.push(resultadoS)
                      break;
                  case 1:
                    resultadoS= "Bajo";
                    resultadosLetras.push(resultadoS)
                      break;
                  case 2:
                    resultadoS= "Medio Bajo";
                    resultadosLetras.push(resultadoS)
                      break;
                  case 3:
                    resultadoS= "Medio Alto";
                    resultadosLetras.push(resultadoS)
                      break;
                  case 4:
                    resultadoS= "Alto";
                    resultadosLetras.push(resultadoS)
                      break;
              }
              
              switch (datosPdf.i) 
              {
                  case 0:
                    resultadoI= "Muy bajo";
                    resultadosLetras.push(resultadoI)
                      break;
                  case 1:
                    resultadoI= "Bajo";
                    resultadosLetras.push(resultadoI)
                      break;
                  case 2:
                    resultadoI= "Medio Bajo";
                    resultadosLetras.push(resultadoI)
                      break;
                  case 3:
                    resultadoI= "Medio Alto";
                    resultadosLetras.push(resultadoI)
                      break;
                  case 4:
                    resultadoI= "Alto";
                    resultadosLetras.push(resultadoI)
                      break;
              }
    
              switch (datosPdf.d) 
              {
                  case 0:
                    resultadoD= "Muy bajo";
                    resultadosLetras.push(resultadoD)
                      break;
                  case 1:
                    resultadoD= "Bajo";
                    resultadosLetras.push(resultadoD)
                      break;
                  case 2:
                    resultadoD= "Medio Bajo";
                    resultadosLetras.push(resultadoD)
                      break;
                  case 3:
                    resultadoD= "Medio Alto";
                    resultadosLetras.push(resultadoD)
                      break;
                  case 4:
                    resultadoD= "Alto";
                    resultadosLetras.push(resultadoD)
                      break;
              }
    
              switch (datosPdf.e) 
              {
                  case 0:
                    resultadoE= "Muy bajo";
                    resultadosLetras.push(resultadoE)
                      break;
                  case 1:
                    resultadoE= "Bajo";
                    resultadosLetras.push(resultadoE)
                      break;
                  case 2:
                    resultadoE= "Medio Bajo";
                    resultadosLetras.push(resultadoE)
                      break;
                  case 3:
                    resultadoE= "Medio Alto";
                    resultadosLetras.push(resultadoE)
                      break;
                  case 4:
                    resultadoE= "Alto";
                    resultadosLetras.push(resultadoE)
                      break;
              }
              var jsonResultadoArea = [];

              jsonResultadoArea.push(
                [ 
                  {
                    text: "LETRA",
                    alignment: "center",
                    fontSize: 11
                  },
                  {
                    text: "AREA DE DESEMPEÑO LABORAL O PROFESIONAL",
                    alignment: "center",
                    fontSize: 11
                  },
                  {
                    text: "RESULTADO",
                    alignment: "center",
                    fontSize: 11
                  }
                ]
                )

              for(var i = 0; i < datosAreas.length; i++){
                jsonResultadoArea.push(
                  [ 
                    {
                      text: datosAreas[i].letra,
                      alignment: "center",
                      fontSize: 11,
                      italics: true
                    },
                    {
                      text: datosAreas[i].area,
                      alignment: "center",
                      fontSize: 11,
                      italics: true
                    },
                    {
                      text: resultadosLetras[i],
                      alignment: "center",
                      fontSize: 11,
                      italics: true
                    }
                  ]
                  )
              }
              
              var jsonAreas = [];

              for(var j = 0; j < datosAreas.length; j++){
                jsonAreas.push(
                  {
                    margin: [ 0, 5, 0, 0 ],
                    layout: 'seccion',
                    table: {
                      widths: ["100%"],
                      body: [
                        [
                          {
                            text: datosAreas[j].letra+" - "+datosAreas[j].area,
                            fontSize: 11,
                            border: [false, false, false, false]
                          }
                        ],
                        [
                          { type: 'none',
                            ul:[
                            datosAreas[j].texto1,
                            datosAreas[j].texto2
                            ],
                            fontSize: 11,
                            border: [false, false, false, false],
                            style: {italics: true},
                            alignment: "justify"
                          },
                          
                        ]
                      ]
                    }
                  }
                )
              }
    
              var urlLogo = "";
              
              urlLogo = process.env.RUTA_LOGO_EMPRESA+"/"+"logo-ucp.png";
              var fonts = {
                Roboto: {
                  normal: process.env.RUTA_FUENTE_LETRA+"Ubuntu/Ubuntu-Medium.ttf",
                  bold: process.env.RUTA_FUENTE_LETRA+"Ubuntu/Ubuntu-Medium.ttf",
                  italics: process.env.RUTA_FUENTE_LETRA+"Ubuntu/Ubuntu-Light.ttf",
                  bolditalics: process.env.RUTA_FUENTE_LETRA+"Ubuntu/Ubuntu-Medium.ttf"
                }
              }
    
              var printer = new PdfPrinter(fonts);
              var docDefinition = {
                content: [
                  {
                    layout: 'seccion',
                    table: {
                      widths: ["auto", "*"],
                      body: [
                        [
                          {
                            image: urlLogo,
                            width: 150,
                            height: 70,
                            border: [true, true, false, true]
                          },
                          {
                            type: 'none',
                            ul: [
                              
                              "Cel:301 387 7446 ",
                              "PBX:(60)(06)312400",
                              'www.ucp.edu.co',
                              
                            ],
                            fontSize: 10,
                            alignment: 'right',
                            border: [false, true, true, true],
                            margin: [ 0, 5, 0, 0 ]
                          }
                        ]
                      ]
                    }
                  },
                  {
                    margin: [ 0, 5, 0, 0 ],
                    layout: 'seccion',
                    table: {
                      widths: ["*", "*"],
                      body: [
                        [
                          {
                            type: 'none',
                            ul: [
                              "Nombre: "+datosPdf.nombres,
                              'Documento: '+datosPdf.documento
                            ],
                            fontSize: 11,
                            border: [true, true, false, true],
                            style: {italics: true},
                            alignment: "left"
                          },
                          {
                            type: 'none',
                            ul: [
                              
                                "Fecha Generación: "+datosPdf.fechaActual,
                                'Fecha de la prueba: '+datosPdf.fechaPrueba
                              
                            ],
                            fontSize: 11,
                            alignment: 'right',
                            border: [false, true, true, true],
                            style: {italics: true}
                          }
                        ]
                      ]
                    }
                  },
                  {
                    margin: [ 0, 5, 0, 0 ],
                    layout: 'seccion',
                    table: {
                      widths: ["100%"],
                      body: [
                        [
                          {
                            text: "Resultado test vocacional CHASIDE",
                            fontSize: 11,
                            border: [false, false, false, false]
                          }
                        ],
                        [
                          {
                            text: "Para la Universidad Católica de Pereira es gratificante poder hacerle entrega de los resultados de la Prueba de Orientación Vocacional denominada CHASIDE, esperamos de antemano que este instrumento sea un apoyo para ayudarle a perfilar de acuerdo con sus intereses, habilidades y características personales, la tan importante toma de decisión con respecto al proyecto de vida Tenga en cuenta, que el instrumento le permite visualizar Áreas de desempeño Laboral o Profesional, y le invita a movilizarse, a indagar, consultar y obtener de manera amplia y suficiente toda la información relacionada con el programa a elegir. Recuerda, si su puntaje es de Alto o Medio Alto tiene talento y habilidad para esta área profesional y si es Medio Bajo, Bajo o Muy Bajo usted no posee esta actitud o habilidad.",
                            fontSize: 11,
                            border: [false, false, false, false],
                            style: {italics: true},
                            alignment: "justify"
                          }
                        ]
                      ]
                    }
                  },
                  {
                    margin: [ 0, 5, 0, 0 ],
                    layout: 'seccion',
                    table: {
                      widths: ["*"],
                      body: [
                        [
                          {
                            margin: [ 0, 5, 0, 0 ],
                            border: [false, false, false, false],
                            layout: 'tabla',
                            table: {
                              widths: ["20%", "60%", "20%"],
                              body: jsonResultadoArea,
                            },
                            alignment: "center"
                          }
                        ]
                      ]
                    }
                  },
                  jsonAreas
                ]
              };
    
              var myTableLayouts = {
                  seccion: {
                    hLineWidth: function(i, node) {
                      return (i === 0 || i === node.table.body.length) ? 2 : 1;
                    },
                    vLineWidth: function(i, node) {
                      return (i === 0 || i === node.table.widths.length) ? 2 : 1;
                    },
                    hLineColor: function(i, node) {
                        return (i === 0 || i === node.table.body.length) ? '#d6d4d4' : '#d6d4d4';
                    },
                    vLineColor: function(i, node) {
                        return (i === 0 || i === node.table.widths.length) ? '#d6d4d4' : '#d6d4d4';
                    },
                  },
                  tabla: {
                    hLineWidth: function(i, node) {
                      return (i === 0 || i === node.table.body.length) ? 1 : 1;
                    },
                    vLineWidth: function(i, node) {
                      return (i === 0 || i === node.table.widths.length) ? 1 : 1;
                    },
                    hLineColor: function(i, node) {
                        return (i === 0 || i === node.table.body.length) ? '#d6d4d4' : '#d6d4d4';
                    },
                    vLineColor: function(i, node) {
                        return (i === 0 || i === node.table.widths.length) ? '#d6d4d4' : '#d6d4d4';
                    },
                  }
              };
    
              var pdfDoc = printer.createPdfKitDocument(docDefinition, {tableLayouts: myTableLayouts});
    
              pdfDoc.end();
    
              var nombreArchivo = "PruebaCHASIDE.pdf";
    
              var stream = pdfDoc.pipe(fs.createWriteStream(process.env.RUTA_RESULTADO_PRUEBA+'/'+nombreArchivo));
    
              stream.on('finish', function() 
              {
                var url = '/assets/pdf/resultados/'+nombreArchivo;
                          req.session.nombrePdf = nombreArchivo;
                          res.send({STATE: "TRUE", RESULT: url})
              })
            }
        
            else
            {
              res.send(resultado);
            }
              
          });
        }
    
        else
        {
          res.send(resultado);
        }
          
      });
      
      
  	}
  })
});

router.post('/enviarEmail', function(req, res)
{

  validarSesion.validarSesionAdmin(req.session, function(estado)
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

        else
        { 
          var email = fields.emailDestino[0];
          var asunto = fields.asuntoEmail[0];
          var mensaje = fields.mensajeEmail[0];
          var urlArchivo = process.env.RUTA_RESULTADO_PRUEBA+"/"+req.session.nombrePdf;
          var empresa = "";

          enviarEmail.prueba(email, asunto, mensaje, urlArchivo, function(resultadoEmail){
              
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
                                                                            '${mensaje}'
                                        
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
          
          
        }
      })
    }
  })
})

module.exports = router;
