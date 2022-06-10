var express = require('express');
var router = express.Router();
var sG = require('./serviciosGenerales');
var validarSesion = require('./validarSesiones');
var multiparty = require('multiparty');

router.get('/', function(req, res)
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
      var paramsRender = 
      {
        nombreCompleto: req.session.nombres,
        layout: 'templateAdmin.hbs',
        jsFile: '<script src="assets/js/admin/formatos.js" type="text/javascript"></script>',
        logoEmpresa: req.session.logoEmpresa,
        fotoUsuario: req.session.fotoUsuario
      }
      res.render('admin/formatos', paramsRender);
    }
  })
})


module.exports = router;