<h1 align="center">
    <img alt="Launchbase" src="https://storage.googleapis.com/golden-wind/bootcamp-launchbase/logo.png" width="400px" />
</h1>

<h3 align="center">
  Desafio 5-1: Refatorando aplicação e configurando o BD
</h3>

<blockquote align="center">“Querer vencer significa já ter percorrido metade do caminho.”</blockquote>

<p align="center">

  <a href="https://rocketseat.com.br">
    <img alt="Made by Rocketseat" src="https://img.shields.io/badge/made%20by-Rocketseat-%23F8952D">
  </a>

</p>

<p align="center">
  <a href="#rocket-sobre-o-desafio">Sobre o desafio</a>&nbsp;&nbsp;&nbsp;
</p>

## :rocket: Sobre o desafio

Esse é o primeiro desafio de uma sequência que irá implementar o banco de dados na aplicação desenvolvida no módulo anterior.

Nessa etapa, você deve refatorar o código da sua aplicação e preparar o seu ambiente para trabalhar com banco de dados.

### Criando Banco de dados

Utilizando a ferramenta postbird, crie **através de queries** um banco de dados chamado **my_teacher** e uma tabela com o nome de **teachers** que possua os seguintes campos:

- id: INT e PRIMARY KEY;
- name: TEXT e NOT NULL;
- birth_date: TIMESTAMP e NOT NULL;
- education_level: TEXT e NOT NULL;
- class_type: TEXT e NOT NULL;
- subjects_taught: TEXT e NOT NULL;
- created_at: TIMESTAMP e NOT NULL.

_Dicas: Para criar a tabela a partir de uma query, basta selecionar o banco no postbird e na aba **Query** rodar o comando **CREATE TABLE** espeficando o nome da tabela e em seguida as colunas, por exemplo:_

```sql
CREATE TABLE TEST(
   ID INT PRIMARY KEY,
   NAME TEXT NOT NULL
);
```

_Para mais informações, dê uma olhada nesse [link](https://www.postgresqltutorial.com/postgresql-create-table/)_

### Refatorando o Código

Após preparar o banco de dados, é preciso refatorar a sua aplicação para utilizá-lo. Você deve fazer as seguintes alterações:

- Utilizar a nova estrutura de pastas (src, app e lib);
- Corrija nos arquivos os caminhos relativos que precisar;
- Utilize nos arquivos da pasta `controllers` a nova forma de exportar.

### Configurando BD na aplicação

Por fim, instale a biblioteca `pg` e crie o arquivo de configuração do seu banco de dados (em uma pasta **config**) utilizando o `Pool`. Não esqueça de passar os dados necessários (**user, password, host, port e database**) na hora de instanciar (**new**) o Pool.

---

Feito com :black_heart: by [Gabriel Rios](https://www.linkedin.com/in/grioos/)
