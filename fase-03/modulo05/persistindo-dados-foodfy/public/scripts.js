const buttons = document.querySelectorAll(".show-hide")
const currentPage = location.pathname
const menuItems = document.querySelectorAll("header a")

if(buttons) {
    for(let button of buttons) {
        const subtitles = button.querySelectorAll("h2")
        for(let subtitle of subtitles) {
            subtitle.addEventListener("click", function() {
                if(button.classList.contains("toggle")) {
                    button.classList.add("active")
                    button.classList.remove("toggle")
                    subtitle.innerHTML = "MOSTRAR"
                }else if(button.classList.contains("active")) {
                    button.classList.add("toggle")
                    button.classList.remove("active")
                   subtitle.innerHTML = "ESCONDER"
                }
            })
        }
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

const ingredientAdd = document.querySelector(".add-ingredient")
if(ingredientAdd) {
    ingredientAdd.addEventListener("click", addIngredient) 
}

function addPrepare() {
    const prepare = document.querySelector("#prepare");
    const fieldContainer = document.querySelectorAll(".prepare");
  
    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);
  
    if (newField.children[0].value == "") return false;
  
    newField.children[0].value = "";
    prepare.appendChild(newField);
  }

const prepareAdd = document.querySelector(".add-prepare")
if(prepareAdd) {
    prepareAdd.addEventListener("click", addPrepare)
}

for(item of menuItems) {
    if(currentPage.includes(item.getAttribute("href"))) {
        item.classList.add("active")
    }
}

function paginate(selectedPage, totalPages) {

    let 
    pages = [],
    oldPage

    for(let currentPage = 1; currentPage <= totalPages; currentPage++) {
        
        const firstAndLastPage = currentPage == 1 || currentPage == totalPages
        const pagesAfterSelectedPage = currentPage <= selectedPage + 2
        const pagesBeforeSelectedPage = currentPage >= selectedPage - 2

        if(firstAndLastPage || pagesBeforeSelectedPage && pagesAfterSelectedPage) {
            if(oldPage && currentPage - oldPage > 2) {
                pages.push("...")
            }

            if(oldPage && currentPage - oldPage == 2) {
                pages.push(oldPage + 1)
            }
            
            pages.push(currentPage)
            
            oldPage = currentPage
        }
    }

    return pages
}

const pagination = document.querySelector(".pagination")

function createPagination(pagination) {

    const filter = pagination.dataset.filter
    const page = +pagination.dataset.page
    const total = +pagination.dataset.total
    const pages = paginate(page, total)
    
    let elements = ""
    
    for(let page of pages) {
        if(String(page).includes("...")) {
            elements += `<span>${page}</span>`
        }else {
            if(filter) {
                elements += `<a href="?page=${page}&filter=${filter}">${page}</a>`
            }else {
                elements += `<a href="?page=${page}">${page}</a>`
            }
        }
    }
    
    pagination.innerHTML = elements

}

if(pagination) {
    createPagination(pagination)
}
