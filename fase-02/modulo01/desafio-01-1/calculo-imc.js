const nome = 'Carlos';
const peso = 84;
const altura = 1.88;
const sexo = 'M';

const imc = peso / (altura * altura);

if(imc >= 30) {
    console.log(`${nome} você está acima do peso`);
} else {
    console.log(`${nome} você não está acima do peso`);
}