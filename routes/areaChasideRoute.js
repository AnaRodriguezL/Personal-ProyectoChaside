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

            if(req.session.idAreaChaside==undefined){
                res.redirect("/resultadoRoute");
            }

            else{

                var paramsRender = {
                    nombreCompleto:
                        req.session.nombres,
                    layout: "templateEstudiante.hbs",
                    jsFile: '<script src="assets/js/estudiante/areaChaside.js" type="text/javascript"></script>',
                    logoEmpresa: req.session.logoEmpresa,
                    fotoUsuario: req.session.fotoUsuario,
                };
                res.render("estudiante/areaChaside", paramsRender);

            }
            
        }
    });
});

router.post("/verAreaChaside", function (req, res) {
    validarSesion.validarSesionEstudiante(req.session, function (estado) {
        if (estado == false) {
            req.session.destroy();
            res.send({ STATE: "FALSE" });
        } else {
            
            var query = `SELECT * from area
                 WHERE area.idArea=${req.session.idAreaChaside}`;
                             
            sG.listarRegistros(query, function (resultado) {
                
                res.send({STATE: "TRUE", RESULT: {area: resultado.RESULT[0], imagenArea: req.session.imagenArea}})
                
                
            });
        }
    });
});

router.post("/guardarBanderaBusqueda", function (req, res) {
    validarSesion.validarSesionEstudiante(req.session, function (estado) {
        if (estado == false) {
            req.session.destroy();
            res.send({ STATE: "FALSE" });
        } else {

            req.session.banderaBusqueda=2;
            res.send({STATE:"TRUE"}); 
        }
    });
});


module.exports = router;
