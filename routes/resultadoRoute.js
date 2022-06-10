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

            if(req.session.idPreubaResultado==undefined){
                res.redirect("/resultadosRoute");

            }else{

                var paramsRender = {
                    nombreCompleto:
                        req.session.nombres,
                    layout: "templateEstudiante.hbs",
                    jsFile: '<script src="assets/js/estudiante/resultado.js" type="text/javascript"></script>',
                    logoEmpresa: req.session.logoEmpresa,
                    fotoUsuario: req.session.fotoUsuario,
                };
                res.render("estudiante/resultado", paramsRender);

            }
            
        }
    });
});


router.post("/verResultadoPrueba", function (req, res) {
    validarSesion.validarSesionEstudiante(req.session, function (estado) {
        if (estado == false) {
            req.session.destroy();
            res.send({ STATE: "FALSE" });
        } else {
            
            var query = `SELECT prueba.idPrueba AS idPrueba,
                SUM(if(pregunta.fkArea=1,respuestas.respuesta,0)) AS c,
                SUM(if(pregunta.fkArea=2,respuestas.respuesta,0)) AS h,
                SUM(if(pregunta.fkArea=3,respuestas.respuesta,0)) AS a,
                SUM(if(pregunta.fkArea=4,respuestas.respuesta,0)) AS s,
                SUM(if(pregunta.fkArea=5,respuestas.respuesta,0)) AS i,
                SUM(if(pregunta.fkArea=6,respuestas.respuesta,0)) AS d,
                SUM(if(pregunta.fkArea=7,respuestas.respuesta,0)) AS e
                FROM estudiante
                INNER JOIN prueba ON prueba.fkEstudiante=estudiante.idEstudiante
                INNER JOIN respuestas on respuestas.fkPrueba=prueba.idPrueba
                INNER JOIN pregunta ON pregunta.idPregunta=respuestas.fkPregunta
                 WHERE prueba.idPrueba=${req.session.idPreubaResultado}
                             AND prueba.fkEstudiante=${req.session.idEstudiante}`;
                             console.log(query)

            sG.listarRegistros(query, function (resultado) {
                
                res.send(resultado);
                
                
            });
        }
    });
});

router.post("/guardarIdArea", function (req, res) {
    validarSesion.validarSesionEstudiante(req.session, function (estado) {
        if (estado == false) {
            req.session.destroy();
            res.send({ STATE: "FALSE" });
        } else {

            var idAreaChaside = req.body.idAreaChaside;
            req.session.imagenArea=req.body.imagenArea;
            req.session.idAreaChaside=idAreaChaside
            res.send({STATE:"TRUE"});
            
           
        }
    });
});

module.exports = router;
