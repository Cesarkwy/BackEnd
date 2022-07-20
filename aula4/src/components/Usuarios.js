import React, { useEffect, useState } from "react";
import axios from "axios";
import imgEdit from "../img/edit.ico";
import imgDelete from "../img/delete.ico";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [id, setId] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [tipo, setTipo] = useState("");

  const url = "http://localhost:8081/";

  useEffect(() => {
    fetch(url + "user")
      .then((response) => response.json())
      .then((data) => setUsuarios(data))
      .catch((err) => console.log(err));
  }, [url]);

  function novosDados() {
    setTipo("novo");
  }

  function cancelarDados() {
    setId("");
    setNome("");
    setEmail("");
    setTipo("");
  }

  function editarDados(cod) {
    console.log(cod);
    let usuario = usuarios.find(item => item.id === cod);
    const { id, nome, email } = usuario;
    console.log(usuario);
    setTipo("editar");
    setId(id);
    setNome(nome);
    setEmail(email);

  }

  function gravaDados() {
    if (nome !== "" && email !== "") {
      if (tipo === "novo") {
        axios
          .post(url + "user", {
            nome: nome,
            email: email,
          })
          .then((response) => atualizaListaNovoUsuario(response))
          .catch((err) => console.log(err));
      } else if (tipo === "editar") {
        axios.put(url + "user/" + id, {
          id: id,
          nome: nome,
          email: email,
        })
          .then(response => atualizaListaUsuariosEditado(response))
          .catch((err) => console.log(err));
      }
    } else {
      console.log("Preencha os campos");
    }
  }

  function atualizaListaNovoUsuario(response){
    let {id, nome, email} = response.data;
    let obj = {id: id, nome: nome, email: email};
    let users = usuarios;
    users.push(obj);
    setUsuarios(users);
    cancelarDados("");
  }
  
  function atualizaListaUsuariosEditado(response){
    let {id} = response.data;
    const index = usuarios.findIndex( item => item.id == id); //eslint-disable-line
    let users = usuarios;
    users[index].nome = nome;
    users[index].email = email;
    setUsuarios(users);
    cancelarDados("");
  }

function deletaDados(cod){
axios.delete(url + "user/" + cod).then(() => {
  setUsuarios(usuarios.filter((item) => item.id !==cod))
})
}

  return (
    <div>
      <button type="button" onClick={novosDados}>
        Novo
      </button>
      {tipo ? (
        <>
          <input
            type="text"
            name="txtNome"
            value={nome}
            onChange={(e) => {
              setNome(e.target.value);
            }}
          />
          <input
            type="text"
            name="txtEmail"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <button type="button" onClick={cancelarDados}>
            Cancelar
          </button>
          <button type="button" onClick={gravaDados}>
            Gravar
          </button>
        </>
      ) : (
        false
      )}

      {usuarios
        ? usuarios.map((item) => {
          return (
            <div key={item.id}>
              <div>
                {" "}
                {item.id} - {item.nome} - {item.email}{" "}
                <img
                  alt="Editar"
                  src={imgEdit}
                  id={item.id}
                  height={20}
                  width={20}
                  onClick={(e) => editarDados(item.id)}
                />
                {" "}
                <img
                  alt="Deletar"
                  src={imgDelete}
                  id={item.id}
                  height={20}
                  width={20}
                  onClick={(e) => deletaDados(item.id)}
                />
              </div>
            </div>
          );
        })
        : false}
    </div>
  );
}