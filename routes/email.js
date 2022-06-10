var email = require('emailjs');

var server = email.server.connect({
  user: "notificaciones.chaside@gmail.com",
  password: "chaside123",
  host: "smtp.gmail.com",
  port: 587,
  ssl: false,
  tls: true
});



function password(email, asunto, mensaje,callback) {
  var message = {
    text: "Nueva password",
    from: "CHASIDE"+"<av-tool@gmail.com>",
    to: email,
    subject: asunto,
    attachment: [{
        data:`<img src="https://www.ucp.edu.co/portal/wp-content/themes/UCatolica/images/logo-vigi-black.png" alt="img" style="width: 200px;">
        <h1>Hola!!</h1>
        <p>
            Recientemente has solicitado la generación  de una nueva contraseña.
        </p>
        <p>
          Acontinuación encontrarás la nueva contraseña para ingresar a el aplicativo.
          <br>Por favor da <a href="http://localhost:3000/">clic aqui</a> o ingresa a <a href="http://localhost:3000/">www.chaside.ucp.com</a> y usa la siguiente contraseña para ingresar:
        </p>
        <p>
          <b>Contraseña:</b>${mensaje}
        </p>
        <p><small>Recuerda que una vez ingreses el aplicativo te solicitara cambiar la contraseña.</small>
          <br><small><b>Por favor no contestar ni remitir mensajes a esta dirección de correo</b>.</small>
        </p>
        `,
        alternative: true
      }
    ]
  };

  server.send(message, function (err, message) 
  {
    console.log("RESPUESTA DEL SEND");
    console.log(err);
    console.log(message);
    if(err != null)
    {
      return callback(false);
    }
    if(err == null)
    {
      return callback(true)
    }
  });
}

function usuarios(email, asunto, mensaje, callback) {
  var message = {
    text: "Nuevo usuario",
    from: "CHASIDE"+"<av-tool@gmail.com>",
    to: email,
    subject: asunto,
    attachment: [{
        data:"Usuario: "+email+"<br>"+"Contraseña: "+mensaje,
        alternative: true
      }
    ]
  };

  server.send(message, function (err, message) 
  {
    console.log("RESPUESTA DEL SEND");
    console.log(err);
    console.log(message);
    if(err != null)
    {
      return callback(false);
    }
    if(err == null)
    {
      return callback(true)
    }
  });
}

function prueba(email, asunto, mensaje, url, callback) {
  var message = {
    text: "Resultado prueba CHASIDE",
    from: "CHASIDE"+"<av-tool@gmail.com>",
    to: email,
    subject: asunto,
    attachment: [{
        data: mensaje,
        alternative: true
      },
      {
        path:url, 
        type:"application/pdf", 
        name:"chaside.pdf"
      }
    ]
  };

  server.send(message, function (err, message) 
  {
    console.log("RESPUESTA DEL SEND");
    console.log(err);
    console.log(message);
    if(err != null)
    {
      return callback(false);
    }
    if(err == null)
    {
      return callback(true)
    }
  });
}

exports.password	= password;
exports.prueba	= prueba;
exports.usuarios	= usuarios;