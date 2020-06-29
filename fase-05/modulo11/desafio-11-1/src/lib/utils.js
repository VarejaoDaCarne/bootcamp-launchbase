module.exports = {
    age(timestamp) {
        const today = new Date
        const birthDate = new Date(timestamp)
    
        let age = today.getFullYear() - birthDate.getFullYear()
        const month = today.getMonth() - birthDate.getMonth() 
        
        if(month < 0 || 
            month == 0 && 
            today.getDate() <= birthDate.getDate()) {
            age = age - 1
        }
    
        return age
    },
    date(timestamp) {
        const date = new Date(timestamp)

        const year = date.getUTCFullYear()
        const month = `0${date.getUTCMonth() + 1}` .slice(-2)
        const day = `0${date.getUTCDate()}` .slice(-2)

        return {
            day,
            month,
            year,
            iso: `${year}-${month}-${day}`,
            birthDay: `${day}/${month}`,
            format: `${day}-${month}-${year}`
        }
    },
    graduation(value) {
        if(value == "Médio") {
            return "Ensino Médio Completo"
        }
        if(value == "Superior") {
            return "Ensino Superior Completo"
        }
        if(value == "Mestrado") {
            return "Mestrado e Doutorado"
        }
    },
    year(year) {
        if(year == "5EF") {
            return "5º ano do ensino fundamental"
        }
        if(year == "6EF") {
            return "6º ano do ensino fundamental"
        }
        if(year == "7EF") {
            return "7º ano do ensino fundamental"
        }
        if(year == "8EF") {
            return "8º ano do ensino fundamental"
        }
        if(year == "9EF") {
            return "9º ano do ensino fundamental"
        }
        if(year == "1EM") {
            return "1º ano do ensino médio"
        }
        if(year == "2EM") {
            return "2 ano do ensino médio"
        }
        if(year == "3EM") {
            return "3º ano do ensino médio"
        }
    }
}