var express = require("express");
var bodyParser = require("body-parser");
var app = express();
var PORT = process.env.PORT || 7000;
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
var mysql = require("mysql");
var connection = mysql.createConnection({
  host: "localhost",
  port: 8889,
  user: "root",
  password: "root",
  database: "burgers_db"
});
connection.connect(function(err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
});
app.get("/", function(req, res) {
  connection.query("SELECT * FROM burgers;", function(err, data) {
    if (err) {
      return res.status(500).end();
    }
   res.render("index",{burgers:data});
  });
});
app.post("/burgers", function(req, res) {
  connection.query("INSERT INTO burgers (burger) VALUES (?)", [req.body.burger], function(err, result) {
    if (err) {
      return res.status(500).end();
    }
    res.json({ id: result.insertId });
    console.log({ id: result.insertId });
  });
});
app.get("/burgers", function(req, res) {
  connection.query("SELECT * FROM burgers;", function(err, data) {
    if (err) {
      return res.status(500).end();
    }
    res.json(data);
  });
});
app.put("/burgers/:id", function(req, res) {
  connection.query("UPDATE burgers SET devoured = ? WHERE id = ?", [1, req.params.id], function(err, result) {
    if (err) {
      return res.status(500).end();
    }
    else if (result.changedRows === 0) {
      return res.status(404).end();
    }
    res.status(200).end();
  });
});
app.listen(PORT, function() {
  console.log("Server listening on: http://localhost:" + PORT);
});

