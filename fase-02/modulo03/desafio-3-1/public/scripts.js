const modalOverlay = document.querySelector('.modal-overlay')
const modal = document.querySelector(".modal")
const cards = document.querySelectorAll('.card')

for(let card of cards) {
    card.addEventListener("click", function() {
        const moduloId = card.getAttribute("id")
        modalOverlay.classList.add('active')
        modalOverlay.querySelector("iframe").src = `https://rocketseat.com.br/${moduloId}`
    })
}

document.querySelector(".close-modal").addEventListener("click", function() {
    modalOverlay.classList.remove("active")
    modalOverlay.querySelector("iframe"). src =""
    modal.classList.remove("full")
})

document.querySelector(".maximize").addEventListener("click", function() {
    modal.classList.add("full")
})