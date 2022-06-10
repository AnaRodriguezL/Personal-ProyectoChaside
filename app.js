//Variables de entorno locales al proyecto
process.env.RUTA_FOTO_USUARIO =__dirname + "/public/assets/img/imagenesUsuario";
process.env.RUTA_FUENTE_LETRA = __dirname + "/public/assets/fonts/";
process.env.RUTA_LOGO_EMPRESA = __dirname + "/public/assets/img/logoUcp";
process.env.RUTA_RESULTADO_PRUEBA = __dirname + "/public/assets/pdf/resultados";



var express = require("express");
var app = express();
var handlebars = require("express-handlebars");
var bodyParser = require("body-parser");
var session = require("express-session");
const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, ".env") });

app.engine("hbs", handlebars({ defaultLayout: "main", extname: ".hbs" }));
app.set("view engine", "hbs");

//RUTAS GENERALES
var index = require("./routes/index");
var loginRoute = require("./routes/loginRoute");
var tipoDocumentosRoute = require("./routes/tipoDocumentosRoute");
var cerrarSesionRoute = require("./routes/cerrarSesionRoute");
var editarPerfilRoute = require("./routes/editarPerfilRoute");
var introRoute = require("./routes/introRoute");


//RUTAS ADMIN
var pruebasRoute = require("./routes/pruebasRoute");
var estudiantesRoute = require("./routes/estudiantesRoute");

//RUTAS ESTUDIANTE
var pruebaRoute = require("./routes/pruebaRoute");
var areaChasideRoute = require("./routes/areaChasideRoute");
var carreraRoute = require("./routes/carreraRoute");
var carrerasRoute = require("./routes/carrerasRoute");
var contactenosRoute = require("./routes/contactenosRoute");
var facultadesRoute = require("./routes/facultadesRoute");
var resultadoRoute = require("./routes/resultadoRoute");
var resultadosRoute = require("./routes/resultadosRoute");



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static("public"));

//Manejo de sesiones

app.use(
    session({
        secret: "chaside!!_2021_!!",
        name: "sessionChaside",
        resave: true,
        saveUninitialized: true,
    })
);

//
//RUTAS GENERALES
app.use("/", index);
app.use("/loginRoute", loginRoute);
app.use("/tipoDocumentosRoute", tipoDocumentosRoute);
app.use("/cerrarSesionRoute", cerrarSesionRoute);
app.use("/editarPerfilRoute", editarPerfilRoute);
app.use("/introRoute", introRoute);


//RUTAS ADMIN
app.use("/pruebasRoute", pruebasRoute);
app.use("/estudiantesRoute", estudiantesRoute);

//RUTAS ESTUDIANTE
app.use("/pruebaRoute", pruebaRoute);
app.use("/areaChasideRoute", areaChasideRoute);
app.use("/carreraRoute", carreraRoute);
app.use("/carrerasRoute", carrerasRoute);
app.use("/contactenosRoute", contactenosRoute);
app.use("/facultadesRoute", facultadesRoute);
app.use("/resultadoRoute", resultadoRoute);
app.use("/resultadosRoute", resultadosRoute);


var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("App is running in: " + process.env.PORT);
});
module.exports = app;
