//"inportando" as bibliotecas
const express = require("express");
const { Client } = require("pg");
const cors = require("cors");
const bodyparser = require("body-parser");
const config = require("./config");

//inicializando aplicação
const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyparser.json());

var conString = config.urlConnection;
var client = new Client(conString);

client.connect(function (err) {
  if (err) {
    return console.error("Não foi possível conectar ao banco.", err);
  }
  client.query("SELECT NOW()", function (err, result) {
    if (err) {
      return console.error("Erro ao executar a query.", err);
    }
    console.log(result.rows[0]);
  });
});

app.get("/", (req, res) => {
  console.log("Response ok.");
  res.send("Ok");
});

app.get("/user", (req, res) => {
  try {
    client.query("SELECT * from usuarios", function (err, result) {
      if (err) {
        return console.error("Erro ao executar a query.", err);
      }
      console.log("chamou get usuários");
      res.send(result.rows);
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/user/:id", (req, res) => {
  try {
    console.log("Chamou /:id " + req.params.id);

    client.query(
      "SELECT * from usuarios WHERE id = $1",
      [req.params.id],
      function (err, result) {
        if (err) {
          return console.error("Erro ao executar a query.", err);
        }
        console.log("chamou get usuários");
        res.send(result.rows);
      }
    );
  } catch (error) {
    console.log(error);
  }
});

app.delete("/user/:id", (req, res) => {
  try {
    console.log("Chamou /:id " + req.params.id);
    const id = req.params.id;
    client.query(
      "DELETE FROM usuarios WHERE id = $1",
      [id],
      function (err, result) {
        if (err) {
          return console.error("Erro ao executar a query.", err);
        } else if (result.rowCount == 0) {
          res.status(400).json({ info: "Registro não encontrado" });
        } else {
          res.status(200).json({ info: `Registro excluido com sucesso. Código: ${id}` });
        }
        console.log(result);
      }
    );
  } catch (error) {
    console.log(error);
  }
});

app.post("/user", (req, res) => {
  try {
    console.log("Chamou post " + req.body);
    const {nome, email} = req.body;
    client.query(
      "INSERT INTO usuarios (nome, email) VALUES ($1, $2) RETURNING * ",
      [nome, email],
      function (err, result) {
        if (err) {
          return console.error("Erro ao executar a query.", err);
        } 
        const {id} = result.rows[0];
        res.setHeader("id", `${id}`)
        res.status(201).json(result.rows[0] )
        console.log(result)
      }
    );
  } catch (error) {
    console.log(error);
  }
});

app.put("/user/:id", (req, res) => {
  try {
    console.log("Chamou update " + req.body);
    const id = req.params.id
    const {nome, email} = req.body;
    client.query(
      "UPDATE usuarios SET nome=$1, email=$2 WHERE id=$3",
      [nome, email, id],
      function (err, result) {
        if (err) {
          return console.error("Erro ao executar a query.", err);
        }else{
          res.setHeader("id", `${id}`)
          res.status(202).json({id: `${id}`})
        }
        console.log(result)
      }
    );
  } catch (error) {
    console.log(error);
  }
});


app.listen(config.port, () =>
  console.log("Servidor funcionando na porta " + config.port)
);