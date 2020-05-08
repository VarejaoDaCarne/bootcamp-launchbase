<h1 align="center">
    <img alt="Launchbase" src="https://storage.googleapis.com/golden-wind/bootcamp-launchbase/logo.png" width="400px" />
</h1>

<h3 align="center">
  Desafio 5-2: Interagindo com o BD
</h3>

<blockquote align="center">“Não basta saber, é preferível saber aplicar. Não é o bastante querer, é preciso saber querer.”</blockquote>

<p align="center">

  <a href="https://rocketseat.com.br">
    <img alt="Made by Rocketseat" src="https://img.shields.io/badge/made%20by-Rocketseat-%23F8952D">
  </a>

</p>

<p align="center">
  <a href="#rocket-sobre-o-desafio">Sobre o desafio</a>&nbsp;&nbsp;&nbsp;
 
</p>

## :rocket: Sobre o desafio

Nessa etapa, você deve refatorar os CRUDs dos professores e estudantes para que eles utilizem o banco de dados.

### Inserindo dados

No método `post`, construa uma query usando `INSERT` que crie um novo registro no banco de dados.

### Buscando dados

No método `index`, construa uma query usando `SELECT` que retorne todos os registros do banco de dados. Ordene esses resultados pelo nome de forma crescente.

### Criando Model

As operações com o banco de dados não devem ficar no controller, por isso crie um model que contenha os três métodos:

- `all`: Buscar todos os registros;
- `create`: Criar um registro;
- `find`: Buscar apenas um registro a partir do id informado;

### Atualizando dados

Crie um método `update` no model. Nesse método, construa uma query utilizando `UPDATE`, `SET` e `WHERE` que atualiza um registro do banco de dados a partir do id informado.

### Removendo dados

Crie um método `delete` no model. Nesse método, construa uma query utilizando `DELETE` e `WHERE` que remova um registro do banco de dados a partir do id informado.

### Refatorando students

Refatore o controller de estudantes utilizando as mesmas ideias aplicadas no controller de professores.

---

Feito com :black_heart: by [Gabriel Rios](https://www.linkedin.com/in/grioos/)
