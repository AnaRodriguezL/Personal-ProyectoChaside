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

            if(req.session.idFacultad==undefined && req.session.idAreaChaside==undefined){
                res.redirect("/facultadesRoute");
            }else
            {
                var paramsRender = {
                    nombreCompleto:
                        req.session.nombres,
                    layout: "templateEstudiante.hbs",
                    jsFile: '<script src="assets/js/estudiante/carreras.js" type="text/javascript"></script>',
                    logoEmpresa: req.session.logoEmpresa,
                    fotoUsuario: req.session.fotoUsuario,
                };
                res.render("estudiante/carreras", paramsRender);
            }
            
        }
    });
});

router.post("/verCarreras", function (req, res) {
    validarSesion.validarSesionEstudiante(req.session, function (estado) {
        if (estado == false) {
            req.session.destroy();
            res.send({ STATE: "FALSE" });
        } else {

            if(req.session.banderaBusqueda==2){
            var query = `SELECT * from carreras
                 WHERE carreras.fkArea=${req.session.idAreaChaside}`;
            }
            else{
                var query = `SELECT * from carreras
                 WHERE carreras.fkFacultad=${req.session.idFacultad}`;
            }
                             
            sG.listarRegistros(query, function (resultado) {
                
                res.send(resultado);
                
            });
        }
    });
});


router.post("/guardarIdCarrera", function (req, res) {
    validarSesion.validarSesionEstudiante(req.session, function (estado) {
        if (estado == false) {
            req.session.destroy();
            res.send({ STATE: "FALSE" });
        } else {

            var idCarrera = req.body.idCarrera;
            req.session.idCarrera=idCarrera
            res.send({STATE:"TRUE"});
            
           
        }
    });
});
module.exports = router;
