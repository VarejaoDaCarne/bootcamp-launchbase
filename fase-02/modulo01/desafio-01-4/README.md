<h1 align="center">
    <img alt="Launchbase" src="https://storage.googleapis.com/golden-wind/bootcamp-launchbase/logo.png" width="400px" />
</h1>

<h3 align="center">
  Desafio 1-4: Aplicação: Operações bancárias 
</h3>

<blockquote align="center">“Não compare o seu bastidor com o palco do outro!”</blockquote>

<p align="center">

  <a href="https://rocketseat.com.br">
    <img alt="Made by Rocketseat" src="https://img.shields.io/badge/made%20by-Rocketseat-%23F8952D">
  </a>

</p>

<p align="center">
  <a href="#rocket-sobre-o-desafio">Sobre o desafio</a>&nbsp;&nbsp;&nbsp;
</p>

## :rocket: Sobre o desafio

Desafios para fortalecer alguns conceitos, entre eles:

- **Booleanos**;
- **Organização**;
- **Padronização**;
- **Escrita**.

### Intro

Crie um programa para realizar operações bancárias na conta de um usuário.

Comece criando um objeto com o nome do usuário, suas transações e saldo.

As transações (transactions) devem iniciar como um array vazio `[]` e o saldo (balance) em `0` (zero).

```js
const user = {
  name: "Mariana",
  transactions: [],
  balance: 0
};
```

### Adicionar transações

Crie uma função `createTransaction` para adicionar uma nova transação no array de transações de um usuário, essa função deve receber como parâmetro um objeto de transação que tem o seguinte formato:

```js
{
  type: 'credit',
  value: 50.5
}
```

O `type` pode ser `credit` para créditos e `debit` para débitos da conta do usuário.

Quanto uma transação for do tipo `credit` ela deve também somar o valor do crédito no saldo (balance) do usuário.

Se for uma transação do tipo `debit` ela deve subtrair o valor do débito no saldo (balance) do usuário.

_Dica.: Você pode usar o método `user.transactions.push(transaction)` para adicionar um novo item no array de transações._

### Relatórios

- Crie uma função chamada `getHigherTransactionByType` que recebe como parâmetro o tipo de transação `credit/debit`, percorre as transações do usuário e retorna o **objeto** da transação de maior valor com aquele tipo:

```js
getHigherTransactionByType("credit"); // { type: 'credit', value: 120 }
```

- Crie uma função chamada `getAverageTransactionValue` que retorna o valor médio das transações de um usuário independente do seu tipo:

```js
getAverageTransactionValue(); // 83.3
```

- Crie uma função chamada `getTransactionsCount` que retorna o número de transações de cada tipo `credit/debit`, o retorno da função deve ser um objeto e seguir exatamente como o modelo apresentado abaixo:

```js
getTransactionsCount(); // { credit: 5, debit: 3 }
```

### Exemplo de resultado final do projeto:

```js
createTransaction({ type: "credit", value: 50 });
createTransaction({ type: "credit", value: 120 });
createTransaction({ type: "debit", value: 80 });
createTransaction({ type: "debit", value: 30 });

console.log(user.balance); // 60

getHigherTransactionByType("credit"); // { type: 'credit', value: 120 }
getHigherTransactionByType("debit"); // { type: 'debit', value: 80 }

getAverageTransactionValue(); // 70

getTransactionsCount(); // { credit: 2, debit: 2 }
```

---

Feito com :black_heart: by [Gabriel Rios](https://www.linkedin.com/in/grioos/)
