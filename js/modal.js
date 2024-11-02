const createModal = document.getElementById('create-modal')
const filterModal = document.getElementById('filter-modal')
const updateModal = document.getElementById('update-modal')

//open items for create modal
const openbtns = document.getElementsByClassName('openmd')

//open item for filters button
const filterbtn = document.getElementById('filter')

//open item for filters button
const updatebtns = document.getElementsByClassName('taskcard')
console.log(updatebtns)

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

//detect click on filter modal buttons to open and close

document.addEventListener('click', (e) => {
    const taskCards = document.querySelectorAll('.taskcard')
    taskCards.forEach(taskCard => {
        if(taskCard && (e.target == taskCard || taskCard.contains(e.target))){
            showModal(updateModal)
            const task = window.tasks.find(item => item.id == (e.target == taskCard ? e.target.id.split('k')[1] : e.target.parentElement.id.split('k')[1]))
            document.getElementById('uid').value = task.id
            document.getElementById('utitle').value = task.title
            document.getElementById('ustatus').value = task.status
            document.getElementById('upriority').value = task.priority
            document.getElementById('udate').value = task.date
            document.getElementById('udescription').value = task.description
        }
    })
})

updateModal.firstElementChild.lastElementChild.addEventListener('click', () => {
    hideModal(updateModal)
})