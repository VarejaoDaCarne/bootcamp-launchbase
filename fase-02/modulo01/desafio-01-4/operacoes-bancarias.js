function createTransaction(transaction) {
    if(transaction.type == 'credit') {
        user.balance = user.balance + transaction.value
    }
    if(transaction.type == 'debit') {
        user.balance = user.balance - transaction.value
    }
    return user.transactions.push(transaction)
}

function getHigherTransactionByType(type) {
    let higherValue = 0
    let higherTransaction = []

    for(let i = 0; i < user.transactions.length; i++) {
        if(type == user.transactions[i].type && user.transactions[i].value > higherValue ) {
            higherValue = user.transactions[i].value 
            higherTransaction = user.transactions[i]
        }
    }
    console.log(higherTransaction)
    return higherTransaction
}

function getAverageTransactionValue() {
    let value = 0
    let transactions = 0

    for(let i = 0; i < user.transactions.length; i++) {
        value = value + user.transactions[i].value
        transactions++
    }
    console.log(`${user.name}, your average transaction value is, $${value / transactions}`)
    return value / transactions
}

function getTransactionsCount()  {
    let creditTransactions = 0
    let debitTransactions = 0

    for(let i = 0; i < user.transactions.length; i++) {
        if(user.transactions[i].type == 'credit') {
            creditTransactions++
        }
        if(user.transactions[i].type == 'debit') {
            debitTransactions++
        }
    }

    const answer = {
        credit: creditTransactions,
        debit: debitTransactions
    }
    console.log(answer)
}

const user = {
    name: 'Mariana',
    transactions: [],
    balance: 0
}

createTransaction({ type: 'credit', value: 50.5 })
createTransaction({ type: 'credit', value: 120 })
createTransaction({ type: 'debit', value: 80 })
createTransaction({ type: 'debit', value: 30 })


console.log(`${user.name}, your balance is, $${user.balance}`)

getHigherTransactionByType('credit')
getHigherTransactionByType('debit')

getAverageTransactionValue()

getTransactionsCount()