'use strict'

var express = require ("express");
var app = express();
var cors = require('cors');

app.use(cors({origin: '*'}));

var MongoClient = require('mongodb').MongoClient;
var BBDD = "mongodb://localhost:27017";
var dbo;

// Conexión a MongoDB
MongoClient.connect(BBDD, function(err, db){
  if (err) throw err;
  dbo = db.db("test");
});

/*

restaurantes de la “8 Avenue” que hallan obtenido calificación A

*/

// Consulta
app.get("/query", function(req, res){
  var query = {"address.street": "8 Avenue",
              "grades.grade": {"$eq" : "A"}
};


// enviamos la consulta a MongoDB
dbo.collection("restaurants").find(query).toArray(function(err, result){
    if (err) throw err;
    res.send(result);
  });
});


// app.get("/all", function(req, res){
//   var query = {};
//
// dbo.collection("restaurants").find(query).toArray(function(err, result){
//     if (err) throw err;
//     res.send(result);
//   });
// });


app.listen(3000, () => {
  console.log("Conexión exitosa!")
});
