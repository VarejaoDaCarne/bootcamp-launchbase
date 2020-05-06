<h1 align="center">
    <img alt="Launchbase" src="https://storage.googleapis.com/golden-wind/bootcamp-launchbase/logo.png" width="400px" />
</h1>

<h3 align="center">
  Desafio 7: Envio de imagens Foodfy 
</h3>

<blockquote align="center">“Quanto mais você estuda, mais aprende e se aproxima de realizar seu sonhos!”</blockquote>

<p align="center">

  <a href="https://rocketseat.com.br">
    <img alt="Made by Rocketseat" src="https://img.shields.io/badge/made%20by-Rocketseat-%23F8952D">
  </a>

</p>

<p align="center">
  <a href="#rocket-sobre-o-desafio">Sobre o desafio</a>&nbsp;&nbsp;&nbsp;
</p>

## :rocket: Sobre o desafio

Você irá criar um sistema de envio de imagem, conforme as especificações abaixo.

### Tabelas

Crie uma tabela de nome `files` com os campos

- `id SERIAL PRIMARY KEY`
- `name TEXT`
- `path TEXT NOT NULL`

Essa tabela acima irá receber todas as imagens do sistema.

Crie uma tabela de nome `recipe_files` com os campos

- `id SERIAL PRIMARY KEY`
- `recipe_id INTEGER REFERENCES recipes(id)`
- `file_id INTEGER REFERENCES files(id)`

Você vai precisar buscar as imagens de uma receita, criando um 
relacionamento entre as tabelas `recipe_files` com a tabela `files`

### Receitas

Adicionar imagens às receitas.

- No banco de dados, remova o campo `image`, pois não será mais necessário.
- Crie um campo de upload de imagens
- Coloque um limite de 5 imagens
- A receita deve ter pelo menos uma imagem

### Chefs

Adicionar a imagem de avatar para o chef

- Remova o campo `avatar_url` da tabela de chefs
- Adicione o campo `file_id INTEGER REFERENCES files(id)`

Você vai precisar criar um relacionamento entre `chefs` e `files`

Dica: Use `ALTER TABLE` para fazer as alterações da tabela de chefs.

### Apresentação

Mostrar as novas imagens de receitas e chefs que estarão cadastradas no banco de dados.

Na página de detalhe de uma receita, criar uma funcionalidade de troca de imagens.

**Não haverá alterações** visuais para os chefs.

### Novos conceitos

Aplique os conceitos de `async/await` e de `try/catch` que você aprendeu nas aulas.

---

Feito com :black_heart: by [Gabriel Rios](https://www.linkedin.com/in/grioos/)
