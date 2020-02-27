const buttons = document.querySelectorAll(".show-hide")

for(let button of buttons) {
    const subtitles = button.querySelectorAll("h2")
    for(let subtitle of subtitles) {
        subtitle.addEventListener("click", function() {
            if(button.classList.contains("remove")) {
                button.classList.add("active")
                button.classList.remove("remove")
                subtitle.innerHTML = "ESCONDER"
            }else if(button.classList.contains("active")) {
                button.classList.add("remove")
                button.classList.remove("active")
               subtitle.innerHTML = "MOSTRAR"
            }
        })
    }
}

function addIngredient() {
    const ingredients = document.querySelector("#ingredients");
    const fieldContainer = document.querySelectorAll(".ingredient");
  
    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);
  
    if (newField.children[0].value == "") return false;
  
    newField.children[0].value = "";
    ingredients.appendChild(newField);
  }
  
document
.querySelector(".add-ingredient")
.addEventListener("click", addIngredient) ;

function addPrepare() {
    const prepare = document.querySelector("#prepare");
    const fieldContainer = document.querySelectorAll(".prepare");
  
    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);
  
    if (newField.children[0].value == "") return false;
  
    newField.children[0].value = "";
    prepare.appendChild(newField);
  }
  
document
.querySelector(".add-prepare")
.addEventListener("click", addPrepare) ;