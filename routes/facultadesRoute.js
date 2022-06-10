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
                jsFile: '<script src="assets/js/estudiante/facultades.js" type="text/javascript"></script>',
                logoEmpresa: req.session.logoEmpresa,
                fotoUsuario: req.session.fotoUsuario,
            };
            res.render("estudiante/facultades", paramsRender);
        }
    });
});

router.post("/guardarIdFacultad", function (req, res) {
    validarSesion.validarSesionEstudiante(req.session, function (estado) {
        if (estado == false) {
            req.session.destroy();
            res.send({ STATE: "FALSE" });
        } else {

            var idFacultad= req.body.idFacultad;
            req.session.idFacultad=idFacultad;
            req.session.banderaBusqueda=1;
            res.send({STATE:"TRUE"});
            
           
        }
    });
});

module.exports = router;
