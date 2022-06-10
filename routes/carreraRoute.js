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

            if( req.session.idCarrera==undefined){

                res.redirect("/carrerasRoute");

            }
            else{
                var paramsRender = {
                    nombreCompleto:
                        req.session.nombres,
                    layout: "templateEstudiante.hbs",
                    jsFile: '<script src="assets/js/estudiante/carrera.js" type="text/javascript"></script>',
                    logoEmpresa: req.session.logoEmpresa,
                    fotoUsuario: req.session.fotoUsuario,
                };
                res.render("estudiante/carrera", paramsRender);
            }
            
        }
    });
});

router.post("/verCarrera", function (req, res) {
    validarSesion.validarSesionEstudiante(req.session, function (estado) {
        if (estado == false) {
            req.session.destroy();
            res.send({ STATE: "FALSE" });
        } else {
            
            var query = `SELECT * from carreras
                 WHERE carreras.idCarrera=${req.session.idCarrera}`;
                             
            sG.listarRegistros(query, function (resultado) {
                
                res.send(resultado);
                
            });
        }
    });
});

module.exports = router;
