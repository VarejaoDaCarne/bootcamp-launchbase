const buttons = document.querySelectorAll(".show-hide")
const menuItems = document.querySelectorAll("header a")
const ingredientAdd = document.querySelector(".add-ingredient")
const prepareAdd = document.querySelector(".add-prepare")
const pagination = document.querySelector(".pagination")
const currentPage = location.pathname

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
    const ingredients = document.querySelector("#ingredients")
    const fieldContainer = document.querySelectorAll(".ingredient")
  
    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true)
  
    if (newField.children[0].value == "") return false
  
    newField.children[0].value = ""
    ingredients.appendChild(newField)
  }

if(ingredientAdd) {
    ingredientAdd.addEventListener("click", addIngredient) 
}

function addPrepare() {
    const prepare = document.querySelector("#preparation")
    const fieldContainer = document.querySelectorAll(".prepare")
  
    const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true)
  
    if (newField.children[0].value == "") return false
  
    newField.children[0].value = ""
    prepare.appendChild(newField)
  }

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

    if(!pages[0]) alert(`Filter: ${filter}, not found!`)

    pagination.innerHTML = elements
}

if(pagination) {
    createPagination(pagination)
}

const PhotosUpload = {
    input: "",
    preview: document.querySelector('#photos-preview'),
    uploadLimit: 5,
    files: [],
    handleFileInputChefs(event) {
        const { files: fileList } = event.target
        PhotosUpload.input = event.target

        if(PhotosUpload.chefHasLimit(event)) {
            PhotosUpload.updateInputFiles()
            return
        }

        Array.from(fileList).forEach(file => {
            PhotosUpload.files.push(file)

            const reader = new FileReader()

            reader.onload = () => {
                const image = new Image()
                image.src = String(reader.result)

                const div = PhotosUpload.getContainer(image)
                PhotosUpload.preview.appendChild(div)
            }

            reader.readAsDataURL(file)
        })

        PhotosUpload.updateInputFiles()
    },
    handleFileInputRecipes(event) {
        const { files: fileList } = event.target
        PhotosUpload.input = event.target

        if(PhotosUpload.hasLimit(event)) {
            PhotosUpload.updateInputFiles()
            return
        } 

        Array.from(fileList).forEach(file => {
            
            PhotosUpload.files.push(file)

            const reader = new FileReader()

            reader.onload = () => {
                const image = new Image()
                image.src = String(reader.result)

                const div = PhotosUpload.getContainer(image)
                PhotosUpload.preview.appendChild(div)
            }

            reader.readAsDataURL(file)
        })

        PhotosUpload.updateInputFiles()
    },
    hasLimit(event) {
        const { uploadLimit, input, preview } = PhotosUpload
        const { files: fileList} = input


        if(fileList.length > uploadLimit) {
            alert(`Envie no máximo ${uploadLimit} fotos`)
            event.preventDefault()
            return true
        }

        const photosDiv = []
        preview.childNodes.forEach( item => {
            if(item.classList && item.classList.value == "photo")
            photosDiv.push(item)
        })

        const totalPhotos = fileList.length + photosDiv.length
        if(totalPhotos > uploadLimit) {
            alert("Você atingiu o limite máximo de fotos")
            event.preventDefault()
            return true
        }
        return false
    },
    chefHasLimit(event) {
        const { input, preview } = PhotosUpload
        const { files: fileList} = input


        if(fileList.length > 1) {
            alert(`Envie no máximo ${1} fotos`)
            event.preventDefault()
            return true
        }

        const photosDiv = []
        preview.childNodes.forEach( item => {
            if(item.classList && item.classList.value == "photo")
            photosDiv.push(item)
        })

        const totalPhotos = fileList.length + photosDiv.length
        if(totalPhotos > 1) {
            alert("Você atingiu o limite máximo de fotos")
            event.preventDefault()
            return true
        }
        return false
    },
    getAllFiles() {
        const dataTransfer = new ClipboardEvent("").clipboardData || new DataTransfer()

        PhotosUpload.files.forEach(file => dataTransfer.items.add(file))
    
        return dataTransfer.files
    },
    getContainer(image) {
        const div = document.createElement('div')
        div.classList.add('photo')

        div.onclick =  PhotosUpload.removePhoto

        div.appendChild(image)

        div.appendChild(PhotosUpload.getRemoveButton())
        return div
    },
    getRemoveButton() {
        const button = document.createElement('i')
        button.classList.add('material-icons')
        button.innerHTML = "close"
        return button
    },
    removePhoto(event) {
        const photoDiv = event.target.parentNode
        const newFiles = Array.from(PhotosUpload.preview.children).filter(function(file) {
            if(file.classList.contains('photo') && !file.getAttribute('id')) return true
        })

        const index = newFiles.indexOf(photoDiv)

        PhotosUpload.files.splice(index, 1)
        PhotosUpload.updateInputFiles()

        photoDiv.remove()
    },
    removeOldPhoto(event) {
        const photoDiv = event.target.parentNode

        if(photoDiv.id) {
            const removedFiles = document.querySelector('input[name="removed_files"]')

            if(removedFiles) {
                removedFiles.value += `${photoDiv.id},`
            }
        }

        photoDiv.remove()
    },
    updateInputFiles() {
        PhotosUpload.input.files = PhotosUpload.getAllFiles()
    }
}

const ImageGallery = {
    highlight: document.querySelector('.banner-container .receipt__image > img'),
    previews: document.querySelectorAll('.gallery-preview img'),
    setImage(e) {
        const { target } = e
    
        ImageGallery.previews.forEach(preview => preview.classList.remove('active'))
        target.classList.add('active')
    
        ImageGallery.highlight.src = target.src
        Lightbox.image.src = target.src
    }
}

const Lightbox = {
    target: document.querySelector('.lightbox-target'),
    image: document.querySelector('.lightbox-target img'),
    closeButton: document.querySelector('.lightbox-target a.lightbox-close'),
    open() {
        Lightbox.target.style.opacity = 1
        Lightbox.target.style.top = 0
        Lightbox.target.style.bottom = 0
        Lightbox.closeButton.style.top = 0
    },
    close() {
        Lightbox.target.style.opacity = 0
        Lightbox.target.style.top = "-100%"
        Lightbox.target.style.bottom = "initial"
        Lightbox.closeButton.style.top = "-80px"
    }
}

const Validate = {
    apply(input, func) {
        Validate.clearErrors(input)
        
        let results = input.value = Validate[func] (input.value)
        input.value = results.value

        if(results.error) {
            Validate.displayError(input, results.error)
        }
    },
    displayError(input, error) {
        const div = document.createElement('div')
        div.classList.add('error')
        div.innerHTML = error
        input.parentNode.appendChild(div)
        input.focus()
    },
    clearErrors(input) {
        const errorDiv = input.parentNode.querySelector(".error")

        if(errorDiv)
            errorDiv.remove()
    },
    isEmail(value) {
        let error = null

        const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/

            if(!value.match(mailFormat)) {
                error = "Email inválido"
            }

        return {
            error,
            value
        }
    }
}