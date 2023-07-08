import { useEffect, useState } from "react";
import "../css/style.css";
const url_api ="https://unified-booster-392006.uc.r.appspot.com/"
//const url_api ="http://localhost:8080"


async function postGenericJson(data,prefix) {
  const response = await fetch(`${url_api}/${prefix}`, {
    headers: {
      "Content-Type": "application/json",
      "authorization":localStorage.getItem('token')
    }, method: 'post', body:(data)
  })
  return await response.json()
}

  
async function getProdutos() {
  const response = await fetch(`${url_api}/produtos`, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  const json = await response.json();
  return json;
}


export default function Mercado() {
  const [produtos, setProdutos] = useState([]);
  const [carrinho, setCarrinho] = useState([]);
  const [info, setInf] = useState({
    total: 0,
    desconto: 0,
    produtos: 0,
    produtos_dif: 0,
  });

  function adicionarProdutoAoCarrinho(produto) {
    let isContem = false;
    carrinho.forEach((item) => {
      if (item.id === produto.id) {
        item.estoque += 1;
        produto.estoque -= 1;
        isContem = true;
      }
    });
    if (!isContem) {
      let new_produto = { ...produto, estoque: 1 };
      produto.estoque -= 1;
      carrinho.push(new_produto);
    }
    atualizaDashboard("+", produto, carrinho);
  }

  function removeProdutoDoCarrinho(produto) {
    produtos.forEach((item) => {
      if (item.id === produto.id) {
        item.estoque += 1;
        produto.estoque -= 1;
      }
    });
    let newCarrinhoSemProduto = carrinho.filter((item) => item.estoque !== 0);
    atualizaDashboard("-", produto, newCarrinhoSemProduto);
  }
  function removeTudoDoCarrinho() {
    carrinho.forEach((produto) => {
      produtos.forEach((item) => {
        if (item.id === produto.id) {
          info.total -= item.valor * produto.estoque;
          item.estoque += produto.estoque;
          info.produtos -= produto.estoque;
          produto.estoque = 0;
        }
      });
      let newCarrinhoSemProduto = carrinho.filter((item) => item.estoque !== 0);
      setCarrinho(newCarrinhoSemProduto);
      info.produtos_dif = newCarrinhoSemProduto.length;
    });
    info.produtos = 0;
    atualizaDesconto();
  }

  function atualizaDashboard(operador, produto, carrinho) {
    setCarrinho([...carrinho]);
    info.produtos_dif = carrinho.length;
    if (operador === "+") {
      info.total = produto.valor + info.total;
      info.produtos += 1;
    } else if (operador === "-") {
      info.total = info.total - produto.valor;
      info.produtos -= 1;
    }
    if(info.produtos<1){
      info.total=0
    }
    atualizaDesconto();
   
  }

  function atualizaDesconto() {
    if (info.produtos_dif >= 3 && info.produtos_dif < 5) {
      info.desconto = info.total * 0.1;
    } else if (info.produtos_dif >= 5) {
      info.desconto = info.total * 0.2;
    } else {
      info.desconto = 0;
    }
    setInf({ ...info });
  }
  

  //function addProdutoNovo(){
    //const data={
    //id: 8,
    //nome: "Banana",
    //img: "https://mercadoorganico.com/6398-large_default/banana-prata-organica-600g-osm.jpg",
    //valor: 3.15,
    // estoque: 1023,
    // }
      
      
  
    //}

  useEffect(() => {
    getProdutos().then((data) => {
      setProdutos(data);
    });
  }, []);
  function formatarValor(valor) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor);
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
    object.valor = Number (object.valor)
    var json = JSON.stringify(object);
    console.log("json", json);

    postGenericJson(json,"produtos").then(data=>{console.log('Return:',data);produtos.push(data);setProdutos([...produtos])})
  }
  return (
    <>
      <div className="produtos">
        {produtos.map((produto) => (
          <div key={produto.id} className="card">
            <div className="cartao">
              <div className="cartao_top">
                <p>{produto.nome}</p>
              </div>
              <div className="cartao_main">
                <img src={produto.img} alt="" />
              </div>
              <div className="cartao_valor">
                <p>R$: {produto.valor}</p>
              </div>
              <div className="cartao_estoque">
                <p>Disponivel: {produto.estoque}</p>
              </div>
              <div className="cartao_botao">
                <button onClick={() => adicionarProdutoAoCarrinho(produto)}>
                  comprar
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="carrinho_page">
      <div className="carrinho_top_inf">
        <table>
          <tbody>
            <tr>
              <td>Total R$:</td>
              <td>
                <span>{formatarValor(info.total)}</span>
              </td>
            </tr>
            <tr>
              <td>Desconto R$:</td>
              <td>
                <span>{formatarValor(info.desconto)}</span>
              </td>
            </tr>
            <tr>
              <td>Produtos Qtd:</td>
              <td>
                <span>{info.produtos}</span>
              </td>
            </tr>
            <tr>
              <td>Produtos Diferentes:</td>
              <td>
                <span>{info.produtos_dif}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
        <div className="carrinho">
          {carrinho.map((produto) => (
            <div key={produto.id} className="card">
              <div className="cartao">
                <div className="cartao_top">
                  <p>{produto.nome}</p>
                </div>
                <div className="cartao_main">
                  <img src={produto.img} alt="" />
                </div>
                <div className="cartao_valor">
                  <p>R$:{produto.valor}</p>
                </div>
                <div className="cartao_estoque">
                  <p>Quantidade: {produto.estoque}</p>
                </div>
                <div className="cartao_botao">
                  <button onClick={() => removeProdutoDoCarrinho(produto)}>
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <form method="post" onSubmit={handleSubmit}>
          <div className="adicionar">
          <label/> id
          <input type="text" name="id"/>
          <label/> nome
          <input type="text" name="nome"/>
          <label/>imagem
          <input type="text" name="img"/>
          <label/> valor
          <input type="number" name="valor"/>
          <label/> estoque
          <input type="number" name="estoque"/>
          <label/>
          
          <button type="submit">Adicionar</button>
          </div>
        </form>
  
        <button onClick={removeTudoDoCarrinho}>Limpar</button>
        <button>Finalizar Conta</button>
       

      </div>
    </>
  );
}

