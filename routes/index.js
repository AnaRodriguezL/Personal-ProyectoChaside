var express = require('express');
var router = express.Router();

router.get('/', function(req, res)
{
	var paramsRender = 
	{
		cssFile: '<link rel="stylesheet" type="text/css" href="assets/css/util.css"><link rel="stylesheet" type="text/css" href="assets/css/login.css">',
		jsFile: '<script src="assets/js/intro.js" type="text/javascript"></script>'
	}
    res.render('intro', paramsRender);

});



module.exports = router;