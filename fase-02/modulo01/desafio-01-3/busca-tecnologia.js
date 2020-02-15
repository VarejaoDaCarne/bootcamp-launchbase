const usuarios = [
    { 
         nome: 'Carlos', 
         tecnologias: ['HTML', 'CSS'] 
     },
    { 
         nome: 'Jasmine', 
         tecnologias: ['JavaScript', 'CSS'] 
     },
    { 
         nome: 'Tuane', 
         tecnologias: ['HTML', 'Node.js'] 
     }
  ]

  function checaSeUsuarioUsaCSS(usuario){
    for (let i = 0; i < usuario.tecnologias.length; i++){
         if(usuario.tecnologias[i] == 'CSS'){
              return  true
         } 
    }
    return false 
}

for (let i = 0; i < usuarios.length; i++) {
     const usuarioUsaCss = checaSeUsuarioUsaCSS(usuarios[i])
     if(usuarioUsaCss) {
          console.log(`O usuário ${usuarios[i].nome} trabalha com CSS`)
     }
}
