var database = require('mysql');

function connect(callback){

  var connection = database.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database : process.env.DB_NAME,
    connectTimeout: 120000,
    timezone: "-05:00"
  });

  connection.connect(function(err){
    if(!err) {
      callback(connection);
    } else {
      if(err){
        console.log(err);
      }
    }
  });

}

function disconnect(connection){
  connection.end();
}

function query(connection, str, callback){
  // connect();
  connection.query(str, function(err, rows, fields) {
    if (!err){
      return callback(null, rows);
      // disconnect();
    }else{
      return callback(err);
    }
  });
}

exports.connect = connect;
exports.disconnect = disconnect;
exports.query = query;
