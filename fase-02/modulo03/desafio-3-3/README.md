<h1 align="center">
    <img alt="Launchbase" src="https://storage.googleapis.com/golden-wind/bootcamp-launchbase/logo.png" width="400px" />
</h1>

<h3 align="center">
  Desafio 3-3: Página de descrição do curso
</h3>

<blockquote align="center">“Não se perca tentando ser melhor que ninguém, esforce-se apenas por ser e dar o melhor de você.”</blockquote>

<p align="center">

  <a href="https://rocketseat.com.br">
    <img alt="Made by Rocketseat" src="https://img.shields.io/badge/made%20by-Rocketseat-%23F8952D">
  </a>

</p>

<p align="center">
  <a href="#rocket-sobre-o-desafio">Sobre o desafio</a>&nbsp;&nbsp;&nbsp;
</p>

## :rocket: Sobre o desafio

Nesse desafio você deve criar uma página de descrição do curso que deve ser chamada no lugar da modal quando o usuário clicar no card do curso.

### Rota

A rota também será a `/courses`, porém o id do curso será passado via route params (ex.: `/courses/id_do_curso`). Dica: utilize o req.params para recuperar o id fornecido na rota.

```js
server.get("/courses/:id", function(req, res) {
  const id = req.params.id;

  return res.send(`O id fornecido na rota é: ${id}`);
});
```

### Informações

- Layout padrão
- Card do curso
- Link que redireciona para a página do curso

---

Feito com :black_heart: by [Gabriel Rios](https://www.linkedin.com/in/grioos/)

