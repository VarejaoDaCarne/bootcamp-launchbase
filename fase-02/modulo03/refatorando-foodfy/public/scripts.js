const receipts = document.querySelectorAll(".receipt")
const buttons = document.querySelectorAll(".show-hide")

for(let i = 0; i < receipts.length; i++) {
    receipts[i].addEventListener("click", function() {
        window.location.href = `/recipes/${i}`
    })
}

for(let button of buttons) {
    const subtitles = button.querySelectorAll("h2")
    for(let subtitle of subtitles) {
        subtitle.addEventListener("click", function() {
            if(button.classList.contains("remove")) {
                button.classList.add("active")
                button.classList.remove("remove")
                subtitle.innerHTML = "MOSTRAR"
            }else if(button.classList.contains("active")) {
                button.classList.add("remove")
                button.classList.remove("active")
               subtitle.innerHTML = "ESCONDER"
            }
        })
    }
}