import "../css/login.css";
import Dashboard from "./Dashboard";
import { useState,useEffect } from "react";
function Login() {
  const [isLogin, setIsLogin] = useState(false);
  const url_api ="https://unified-booster-392006.uc.r.appspot.com"
  // const url_api = "http://localhost:8080";

  function estalogado(){
    const login  = localStorage.getItem('login')
    if(login){
      console.log(login)
      setIsLogin(login)
    }else{
      console.log('Você esta sem token')
    }
  
  }

  async function getLogin(data,prefix) {
    const response = await fetch(`${url_api}${prefix}`, {
      headers: {
        "Content-Type": "application/json",
      }, method: 'post', body: data
    })
    const json = await response.json();
    return json
  }

  function handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    console.log("form", form);
    const formData = new FormData(form);
    console.log("formData", formData);

    var object = {};
    formData.forEach(function (value, key) {
      object[key] = value;
    });

    var json = JSON.stringify(object);
    console.log("json", json);

    getLogin(json,'/login').then((data) => {
      console.log("Resposta do Back-End: ", data);
      localStorage.setItem('login',data.login)
      localStorage.setItem('token',data.token)

      setIsLogin(data.login);
    });
  }
  
  useEffect(() => {
    estalogado();
  }, []);
  return isLogin ? (
    <Dashboard />
  ) : (
    <div className="login-page">
      <div className="login-form">
        <h2>Página de Login</h2>
        <form method="post" onSubmit={handleSubmit}>
          <label>
            <input type="text" placeholder="Usuário" name="user" required />
          </label>
          <label>
            <input
              type="password"
              placeholder="Senha"
              name="password"
              required
            />
          </label>
          <button type="submit">Entrar</button>
        </form>
      </div>
    </div>
  );
}
export default Login;
