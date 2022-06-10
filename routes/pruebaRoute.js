var express = require("express");
var router = express.Router();
var express = require("express");
var router = express.Router();
var sG = require("./serviciosGenerales");
var validarSesion = require("./validarSesiones");
var multiparty = require("multiparty");
var fs = require("fs");

router.get("/", function (req, res) {
    validarSesion.validarSesionEstudiante(req.session, function (estado) {
        if (estado == false) {
            req.session.destroy();
            res.redirect("/");
        } else {
            var paramsRender = {
                nombreCompleto:
                    req.session.nombres,
                layout: "templateEstudiante.hbs",
                jsFile: '<script src="assets/js/estudiante/prueba.js" type="text/javascript"></script>',
                logoEmpresa: req.session.logoEmpresa,
                fotoUsuario: req.session.fotoUsuario,
            };
            res.render("estudiante/prueba", paramsRender);
        }
    });
});

router.post('/ConsulActualizacionDatos', function(req, res)
{
    req.session.idUsuario 
    
    var queryEstudiante = `SELECT 
                            estudiante.fechaActualizacion as fechaActualizacion
                            FROM estudiante
                            WHERE estudiante.fkUsuario = ${req.session.idUsuario};`

    sG.listarRegistros(queryEstudiante, function(resultado)
    {
        res.send(resultado);
        console.log(resultado)
    
    })

});

router.post('/ConsulPreguntaInicial', function(req, res)
{
    req.session.idUsuario 
    
    var queryEstudiantePrueba = `SELECT max(prueba.idPrueba) As idPrueba
    FROM estudiante
    INNER JOIN prueba ON prueba.fkEstudiante=estudiante.idEstudiante
    WHERE estudiante.idEstudiante = ${req.session.idEstudiante};`

    sG.listarRegistros(queryEstudiantePrueba, function(resultadoEstudinatePrueba)
    {
        var idConsultaPrueba = resultadoEstudinatePrueba.RESULT[0].idPrueba;

        if(idConsultaPrueba==null){

            var queryInsertPrueba=`SELECT insertarPrueba(${req.session.idEstudiante},null)AS idPrueba`;
                                            
            sG.listarRegistros(queryInsertPrueba, function(resultadoInsertarPrueba)
            {
                
                if(resultadoInsertarPrueba.STATE == "TRUE"){
                  
                    var idPrueba = resultadoInsertarPrueba.RESULT[0].idPrueba;
                    req.session.idPrueba=idPrueba;
                    req.session.posicionPregunta=1;

                    
        
                    var queryPreguntas = `SELECT pregunta,fotoPregunta,numPregunta
                                            FROM pregunta
                                            WHERE pregunta.numPregunta=${req.session.posicionPregunta};`
        
                    sG.listarRegistros(queryPreguntas, function(resultadoPregunta)
                    {
                        
                        res.send(resultadoPregunta);
                        
                        
                    
                    })

                }
                else{
                    res.send(resultadoInsertarPrueba);
                    
                }
            })
            
            
        }
        else{

            var queryEstudiante = `SELECT prueba.idPrueba As idPrueba,prueba.fechaFinalizacion AS fechaFinalizacion
            FROM estudiante
            INNER JOIN prueba ON prueba.fkEstudiante=estudiante.idEstudiante
            WHERE estudiante.idEstudiante = ${req.session.idEstudiante} AND prueba.idPrueba=${idConsultaPrueba};`

            sG.listarRegistros(queryEstudiante, function(resultado){
               
                var datosPrueba = resultado.RESULT[0];

                if(datosPrueba.fechaFinalizacion!=null){
                                                
                    var queryInsertPrueba=`SELECT insertarPrueba(${req.session.idEstudiante},null)AS idPrueba`;
                
                    sG.listarRegistros(queryInsertPrueba, function(resultadoInsertarPrueba)
                    {
                        
                        if(resultadoInsertarPrueba.STATE == "TRUE"){
                          
                            var idPrueba = resultadoInsertarPrueba.RESULT[0].idPrueba;
                            req.session.idPrueba=idPrueba;
                            req.session.posicionPregunta=1;
    
                           
                
                            var queryPreguntas = `SELECT pregunta,fotoPregunta,numPregunta
                                                    FROM pregunta
                                                    WHERE pregunta.numPregunta=${req.session.posicionPregunta};`
                
                            sG.listarRegistros(queryPreguntas, function(resultadoPregunta)
                            {
                               
                                res.send(resultadoPregunta);
                                
                                
                            
                            })
    
                        }
                        else{
                            res.send(resultadoInsertarPrueba);
                            
                        }
                    })

                }
                else{
                    req.session.idPrueba=datosPrueba.idPrueba;
                                
                    var queryBuscarPosicion = `SELECT max(respuestas.idRespuesta) AS idRespuesta,
                    max(respuestas.fkPregunta) AS idPregunta,
                    max(pregunta.numPregunta) AS posicionPregunta
                    FROM respuestas
                    INNER JOIN pregunta ON pregunta.idPregunta=respuestas.fkPregunta
                    WHERE respuestas.fkPrueba=${req.session.idPrueba};`
    
                    sG.listarRegistros(queryBuscarPosicion, function(resultadoBuscarPosicion)
                    {
                        
                        var datosPosicion = resultadoBuscarPosicion.RESULT[0];
                        req.session.posicionPregunta=datosPosicion.posicionPregunta;
                        req.session.posicionPregunta=req.session.posicionPregunta+1;
            
                        var queryPreguntas = `SELECT pregunta,fotoPregunta,numPregunta
                                                FROM pregunta
                                                WHERE pregunta.idPregunta=${req.session.posicionPregunta};`
            
                        sG.listarRegistros(queryPreguntas, function(resultadoPregunta)
                        {
            
                            
                            res.send(resultadoPregunta);
                            
                            
                        
                        })
                        
                    
                    })
                }
                

            })
                                    
        }

    })

    
});

router.post('/ConsultarInicioPrueba', function(req, res)
{
    req.session.idUsuario 
    
    var queryEstudiantePrueba = `SELECT max(prueba.idPrueba) As idPrueba
    FROM estudiante
    INNER JOIN prueba ON prueba.fkEstudiante=estudiante.idEstudiante
    WHERE estudiante.idEstudiante = ${req.session.idEstudiante};`

    sG.listarRegistros(queryEstudiantePrueba, function(resultadoEstudinatePrueba)
    {   
        

        if(resultadoEstudinatePrueba.RESULT[0].idPrueba==null){
           //////////--------------------------- puede
           var respuesta = {STATE: "TRUE"};
            res.send(respuesta);
          
            
        }
        else{
            
            var idConsultaPrueba = resultadoEstudinatePrueba.RESULT[0].idPrueba;
            var queryEstudiante = `SELECT prueba.idPrueba As idPrueba,prueba.fechaFinalizacion AS fechaFinalizacion
            FROM estudiante
            INNER JOIN prueba ON prueba.fkEstudiante=estudiante.idEstudiante
            WHERE estudiante.idEstudiante = ${req.session.idEstudiante} AND prueba.idPrueba=${idConsultaPrueba};`

            sG.listarRegistros(queryEstudiante, function(resultado){
               
                var datosPrueba = resultado.RESULT[0];

                if(datosPrueba.fechaFinalizacion!=null){

                    ///------------fecha de la ultima prueba----------------
                    var fechaFinalizacion = new Date(datosPrueba.fechaFinalizacion);
                    var dia = ("0" + fechaFinalizacion.getDate()).slice(-2);
                    var mes = ("0" + (fechaFinalizacion.getMonth() + 1)).slice(-2);
                    fechaActualizacion = fechaFinalizacion.getFullYear()+"-"+(mes)+"-"+(dia) ;

                    //--------------------datos para calcular la fecha actual menos 6 meses -------------
                    var fecha = new Date();
                    var dia = fecha.getDate();
                    var mes = fecha.getMonth()+1;
                    var year = fecha.getFullYear();

                    if(mes < 10)
                    {
                        mes = "0"+mes;
                    }

                    if(dia < 10)
                    {
                        dia = "0"+dia;
                    }


                    var fechaActual = new Date(year, mes, dia);
                
                    var fechaMenor = new Date(fechaActual.setMonth(fechaActual.getMonth()-7));

                    var dias = ("0" + fechaMenor.getDate()).slice(-2);
                    var mess = ("0" + (fechaMenor.getMonth() + 1)).slice(-2);
                    fechaMenor = fechaMenor.getFullYear()+"-"+(mess)+"-"+(dias) ;
                   
                
                    if(fechaActualizacion<fechaMenor){
                                                    
                        ///---------------------------------puede
                      var respuesta = {STATE: "TRUE"};
                      res.send(respuesta);
                     

                    }
                    else{
                        //-------NO PUEDE
                    
                        var respuesta = {STATE: "FALSE"};
                        res.send(respuesta);
                        
                    }
                }
                else{
                    ///---------------------------------puede
                    var respuesta = {STATE: "TRUE"};
                      res.send(respuesta);
                      

                }
                

            })
                                    
        }

    })

    
});


router.post('/ConsulSiguiente', function(req, res)
{
    var respuesta = req.body.respuesta;
    //consulta si si ya se tenia una respuesta almacenada 
    var queryRespuestaAlmacenada = `SELECT max(respuestas.idRespuesta) AS idRespuesta,
                        respuestas.fkPregunta AS idPregunta,
                        pregunta.numPregunta AS posicion
                        FROM respuestas
                        INNER join pregunta ON pregunta.idPregunta=respuestas.fkPregunta
                        WHERE respuestas.fkPrueba=${req.session.idPrueba} AND pregunta.numPregunta=${req.session.posicionPregunta};`

    sG.listarRegistros(queryRespuestaAlmacenada, function(resultadoRespuestaAlmacenada)
    {
        if(resultadoRespuestaAlmacenada.STATE == "TRUE"){

            var datosresultadoRespuestaAlmacenada = resultadoRespuestaAlmacenada.RESULT[0];

            
            if(datosresultadoRespuestaAlmacenada.idRespuesta==null){

                
                var InsertarRespuesta = `INSERT INTO respuestas(fkPregunta,respuesta,fkPrueba)
                VALUES (${req.session.posicionPregunta},${respuesta},${req.session.idPrueba})`;

                sG.insertarRegistro(InsertarRespuesta , function(resultadoInsertarRespuesta)
                {
                    if(resultadoInsertarRespuesta.STATE=="TRUE"){
                    //---------conuslta los datos de la seguiente pregunta
                        req.session.posicionPregunta=req.session.posicionPregunta+1;

                        var queryPreguntas = `SELECT pregunta,fotoPregunta,numPregunta
                                                FROM pregunta
                                                WHERE pregunta.idPregunta=${req.session.posicionPregunta};`

                        sG.listarRegistros(queryPreguntas, function(resultadoPregunta)
                        {
                    
                            res.send(resultadoPregunta);
                           
                        
                        })
                    }
                    else{
                        
                        res.send(resultadoInsertarRespuesta);
                        
                    }
                })
            }
            else{
                var idRespuesta=resultadoRespuestaAlmacenada.RESULT[0].idRespuesta;

                var queryUpdateRespuesta = `UPDATE respuestas SET respuesta = ${respuesta}
                                            WHERE respuestas.idRespuesta=${idRespuesta};`

                sG.actualizarRegistro(queryUpdateRespuesta, function(resultadoUpdateRespuesta)
                {
                   
                    if(resultadoUpdateRespuesta.STATE=="TRUE"){
                         //---------conuslta los datos de la seguiente pregunta
                        req.session.posicionPregunta=req.session.posicionPregunta+1;
                        var queryResPregunta = `SELECT max(respuestas.idRespuesta) AS idRespuesta
                        FROM respuestas
                        INNER join pregunta ON pregunta.idPregunta=respuestas.fkPregunta
                        WHERE respuestas.fkPrueba=${req.session.idPrueba} AND pregunta.numPregunta=${req.session.posicionPregunta};`

                        sG.listarRegistros(queryResPregunta, function(resultadoResPregunta)
                        {

                            var resultadoRes = resultadoResPregunta.RESULT[0];
                            if(resultadoRes.idRespuesta==null){
                                var queryPreguntas = `SELECT pregunta,fotoPregunta,numPregunta
                                                        FROM pregunta
                                                        WHERE pregunta.idPregunta=${req.session.posicionPregunta}`

                            }
                            else{
                                var queryPreguntas = `SELECT pregunta,fotoPregunta,numPregunta,respuestas.respuesta AS respuesta
                                                        FROM pregunta
                                                        INNER JOIN respuestas ON respuestas.fkPregunta=pregunta.idPregunta
                                                        WHERE pregunta.idPregunta=${req.session.posicionPregunta}
                                                        AND respuestas.fkPrueba=${req.session.idPrueba};`
                            }
                            
                            sG.listarRegistros(queryPreguntas, function(resultadoPregunta)
                            {
                                
                                res.send(resultadoPregunta);
                          
                            })
                            
                        })
                    }
                    else{
                        
                        res.send(resultadoUpdateRespuesta);
                      

                    }
                })

            }

        }
        else{
            
            res.send(resultadoRespuestaAlmacenada);
            
        }
        
    
    })
    
});

router.post('/ConsulAnterior', function(req, res)
{
    var respuesta = req.body.respuesta;
    //consulta si si ya se tenia una respuesta almacenada 
    var queryRespuestaAlmacenada = `SELECT max(respuestas.idRespuesta) AS idRespuesta,
                        respuestas.fkPregunta AS idPregunta,
                        pregunta.numPregunta AS posicion
                        FROM respuestas
                        INNER join pregunta ON pregunta.idPregunta=respuestas.fkPregunta
                        WHERE respuestas.fkPrueba=${req.session.idPrueba} AND pregunta.numPregunta=${req.session.posicionPregunta};`

    sG.listarRegistros(queryRespuestaAlmacenada, function(resultadoRespuestaAlmacenada)
    {
        if(resultadoRespuestaAlmacenada.STATE == "TRUE"){

            var datosresultadoRespuestaAlmacenada = resultadoRespuestaAlmacenada.RESULT[0];
            
            if(datosresultadoRespuestaAlmacenada.idRespuesta==null){

                var InsertarRespuesta = `INSERT INTO respuestas(fkPregunta,respuesta,fkPrueba)
                VALUES (${req.session.posicionPregunta},${respuesta},${req.session.idPrueba})`;

                sG.insertarRegistro(InsertarRespuesta , function(resultadoInsertarRespuesta)
                {
                    if(resultadoInsertarRespuesta.STATE=="TRUE"){
                    //---------conuslta los datos de la seguiente pregunta
                        req.session.posicionPregunta=req.session.posicionPregunta-1;

                        var queryPreguntas = `SELECT pregunta,fotoPregunta,numPregunta,respuestas.respuesta AS respuesta
                                                FROM pregunta
                                                INNER JOIN respuestas ON respuestas.fkPregunta=pregunta.idPregunta
                                                WHERE pregunta.idPregunta=${req.session.posicionPregunta}
                                                AND respuestas.fkPrueba=${req.session.idPrueba};`

                        sG.listarRegistros(queryPreguntas, function(resultadoPregunta)
                        {
                            
                            res.send(resultadoPregunta);
                        
                            
                        
                        })
                    }
                    else{
                        
                        res.send(resultadoInsertarRespuesta);
                        
                    }
                })
            }
            else{
                var idRespuesta=resultadoRespuestaAlmacenada.RESULT[0].idRespuesta;

                var queryUpdateRespuesta = `UPDATE respuestas SET respuesta = ${respuesta}
                                            WHERE respuestas.idRespuesta=${idRespuesta};`

                sG.actualizarRegistro(queryUpdateRespuesta, function(resultadoUpdateRespuesta)
                {
                   
                    if(resultadoUpdateRespuesta.STATE=="TRUE"){
                         //---------conuslta los datos de la seguiente pregunta
                        req.session.posicionPregunta=req.session.posicionPregunta-1;
                        var queryPreguntas = `SELECT pregunta,fotoPregunta,numPregunta,respuestas.respuesta AS respuesta
                                                FROM pregunta
                                                INNER JOIN respuestas ON respuestas.fkPregunta=pregunta.idPregunta
                                                WHERE pregunta.idPregunta=${req.session.posicionPregunta}
                                                AND respuestas.fkPrueba=${req.session.idPrueba};`

                        sG.listarRegistros(queryPreguntas, function(resultadoPregunta)
                        {
                            
                            res.send(resultadoPregunta);
                            
                            
                        
                        })
                    }
                    else{
                        
                        res.send(resultadoUpdateRespuesta);
                        

                    }
                })

            }

        }
        else{
           
            res.send(resultadoRespuestaAlmacenada);
            
        }
        
    
    })
    
});

router.post('/FinalizarQuestionario', function(req, res)
{
    var respuesta = req.body.respuesta;
    //consulta si si ya se tenia una respuesta almacenada 
    var queryRespuestaAlmacenada = `SELECT max(respuestas.idRespuesta) AS idRespuesta,
                        respuestas.fkPregunta AS idPregunta,
                        pregunta.numPregunta AS posicion
                        FROM respuestas
                        INNER join pregunta ON pregunta.idPregunta=respuestas.fkPregunta
                        WHERE respuestas.fkPrueba=${req.session.idPrueba} AND pregunta.numPregunta=${req.session.posicionPregunta};`

    sG.listarRegistros(queryRespuestaAlmacenada, function(resultadoRespuestaAlmacenada)
    {
        if(resultadoRespuestaAlmacenada.STATE == "TRUE"){

            var datosresultadoRespuestaAlmacenada = resultadoRespuestaAlmacenada.RESULT[0];
            
            if(datosresultadoRespuestaAlmacenada.idRespuesta==null){

                var InsertarRespuesta = `INSERT INTO respuestas(fkPregunta,respuesta,fkPrueba)
                VALUES (${req.session.posicionPregunta},${respuesta},${req.session.idPrueba})`;

                sG.insertarRegistro(InsertarRespuesta , function(resultadoInsertarRespuesta)
                {
                    if(resultadoInsertarRespuesta.STATE=="TRUE"){
                    
                         
                        var fecha = new Date();
                        var dia = ("0" + fecha.getDate()).slice(-2);
                        var mes = ("0" + (fecha.getMonth() + 1)).slice(-2);
                        fecha= fecha.getFullYear()+"-"+(mes)+"-"+(dia) ;
                        

                        var queryUpdatePrueba = `UPDATE prueba SET fechaFinalizacion = '${fecha}'
                                                    WHERE prueba.idPrueba=${req.session.idPrueba};`
                        
                        sG.actualizarRegistro(queryUpdatePrueba, function(RespuestaUpdatePrueba)
                        {
                            req.session.idPreubaResultado=req.session.idPrueba
                            
                            res.send(RespuestaUpdatePrueba);
                           
                            
                        
                        })
                    }
                    else{
                        
                        res.send(resultadoInsertarRespuesta);
                        
                    }
                })
            }
            else{
                var idRespuesta=resultadoRespuestaAlmacenada.RESULT[0].idRespuesta;

                var queryUpdateRespuesta = `UPDATE respuestas SET respuesta = ${respuesta}
                                            WHERE respuestas.idRespuesta=${idRespuesta};`

                sG.actualizarRegistro(queryUpdateRespuesta, function(resultadoUpdateRespuesta)
                {
                   
                    if(resultadoUpdateRespuesta.STATE=="TRUE"){
                         //---------conuslta finalid pruebva cambiar la feha

                         var fecha = new Date();
                         var dia = ("0" + fecha.getDate()).slice(-2);
                         var mes = ("0" + (fecha.getMonth() + 1)).slice(-2);
                         fecha= fecha.getFullYear()+"-"+(mes)+"-"+(dia) ;
                         
                        

                        var queryUpdatePrueba = `UPDATE prueba SET fechaFinalizacion = ${fecha}
                                                    WHERE prueba.idPrueba=${req.session.idPrueba};`
                        
                        sG.actualizarRegistro(queryUpdatePrueba, function(RespuestaUpdatePrueba)
                        {
                            
                            res.send(RespuestaUpdatePrueba);
                     
                        
                        })
                    }
                    else{
                       
                        res.send(resultadoUpdateRespuesta);
                       

                    }
                })

            }

        }
        else{
            
            res.send(resultadoRespuestaAlmacenada);
            
        }
        
    
    })
    
});





module.exports = router;
