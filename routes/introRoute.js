var express = require("express");
var router = express.Router();

router.get("/ingresarLogin", function (req, res) {
    var paramsRender = {
        cssFile:
            '<link rel="stylesheet" type="text/css" href="assets/css/intro.css"><link rel="stylesheet" href="assets/css/buttons.css">',
        jsFile: '<script src="assets/js/intro.js" type="text/javascript"></script>',
    };
    res.render("intro", paramsRender);
});

module.exports = router;
