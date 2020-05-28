const nome = 'Silvana';
const sexo = 'F';
const idade = 60;
const contribuicao = 35;

const contribuicaoMinimaHomem = 35
const contribuicaoMinimaMulher = 30
const tempoContribuicao = idade + contribuicao;

if (sexo == 'M' && contribuicaoMinimaHomem && tempoContribuicao >= 95 ||  sexo == 'F' && contribuicaoMinimaMulher && tempoContribuicao >= 85 ) {
        console.log(`${nome}, você pode se aposentar!`);
} else {
    console.log(`${nome}, você ainda não pode se aposentar!`);
}