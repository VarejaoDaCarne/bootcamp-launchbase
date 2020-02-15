const modalOverlay = document.querySelector(".modal-overlay")
const receipts = document.querySelectorAll(".receipt")

for(let receipt of receipts) {
    receipt.addEventListener("click", function() {
    const imgId = receipt.getAttribute("id")
    const receiptContent = receipt.querySelector(".receipt__content-receipt").innerHTML
    const receiptChef = receipt.querySelector(".receipt__content-chef").innerHTML
    modalOverlay.classList.add("active")
    modalOverlay.querySelector(".modal-img").src = `../Foodfy/layouts/assets/${imgId}`
    modalOverlay.querySelector(".modal-receipt").innerHTML = `${receiptContent}`
    modalOverlay.querySelector(".modal-receipt-chef").innerHTML = `${receiptChef}`
    })
}

document.querySelector(".close-modal").addEventListener("click", function() {
    modalOverlay.classList.remove("active")
    modalOverlay.querySelector(".modal-img"). src =""
})
console.log(modalOverlay)