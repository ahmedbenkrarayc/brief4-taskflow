const createModal = document.getElementById('create-modal')
const filterModal = document.getElementById('filter-modal')

//open items for create modal
const openbtns = document.getElementsByClassName('openmd')
const closebtns = document.getElementsByClassName('closemd')

//open item for filters button
const filterbtn = document.getElementById('filter')

const showModal = (modal) => {
    if(modal.classList.contains('hideModal'))
        modal.classList.remove('hideModal')
    modal.classList.add('showModal')
}

const hideModal = (modal) => {
    if(modal.classList.contains('showModal'))
        modal.classList.remove('showModal')
    modal.classList.add('hideModal')
}

//detect click on create modal buttons to open and close

Array.from(openbtns).forEach(element => {
    element.addEventListener('click', () => {
        showModal(createModal)
    }) 
})

createModal.firstElementChild.lastElementChild.addEventListener('click', () => {
    hideModal(createModal)
})

//detect click on filter modal buttons to open and close

filterbtn.addEventListener('click', () => {
    showModal(filterModal)
})

filterModal.firstElementChild.lastElementChild.addEventListener('click', () => {
    hideModal(filterModal)
})