// let tasks = []

const todoSection = document.getElementById('todo')
const doingSection = document.getElementById('doing')
const doneSection = document.getElementById('done')

const taskounter = document.getElementsByClassName('counter')

const manageValidationErrors = (input, error) => {
    if(error != ""){
        input.classList.add('inputError')
        input.setAttribute('title', error)
    }else{
        if(input.classList.contains('inputError')){
            input.classList.remove('inputError')
            input.removeAttribute('title')
        }
    }
}

const validation = (data, type) => {
    const titleInput = type == 'create' ? document.getElementById('ctitle') : document.getElementById('utitle')
    const statusInput = type == 'create' ? document.getElementById('cstatus') : document.getElementById('ustatus')
    const priorityInput = type == 'create' ? document.getElementById('cpriority') : document.getElementById('upriority')
    const dateInput = type == 'create' ? document.getElementById('cdate') : document.getElementById('udate')
    const descriptionInput = type == 'create' ? document.getElementById('cdescription') : document.getElementById('udescription')

    const titleRegex = /^[A-Za-z0-9\s]{5,}$/
    const descriptionRegex = /^[A-Za-z0-9\s.,!@#$%^&*()_+\-=\[\]{};:']{10,}$/

    if(!titleRegex.test(data.title)){
        //validation error style
        manageValidationErrors(titleInput, 'Please Enter a valid title it only can contain letters, numbers, spaces with a min length of 5')
        return false
    }else{
        //clear validation error style
        manageValidationErrors(titleInput, '')
    }

    if(data.status == ""){
        manageValidationErrors(statusInput, 'Please select a value')
        return false
    }else{
        manageValidationErrors(statusInput, '')
    }

    if(data.priority == ""){
        manageValidationErrors(priorityInput, 'Please select priority')
        return false
    }else{
        manageValidationErrors(priorityInput, '')
    }

    if(!data.date){
        manageValidationErrors(dateInput, 'Please enter a due date')
        return false
    }else{
        manageValidationErrors(dateInput, '')
    }

    if(type != 'update'){
        const date = new Date()
        date.setHours(0, 0, 0, 0)
        if(new Date(data.date) < date){
            manageValidationErrors(dateInput, 'The due date must be greater or equals to today')
            return false
        }else{
            manageValidationErrors(dateInput, '')
        }
    }

    if(!descriptionRegex.test(data.description)){
        //validation error style
        manageValidationErrors(descriptionInput, 'Please Enter a valid description, it only can contain letters, numbers, spaces with a min length of 10')
        return false
    }else{
        //clear validation error style
        manageValidationErrors(descriptionInput, '')
    }

    if(type == 'create'){
        titleInput.value = ''
        statusInput.value = ''
        priorityInput.value = ''
        dateInput.value = ''
        descriptionInput.value = ''
    }

    return true
}

//Task statistics
const displayStatistics = () => {
    const groupedTasks = Object.groupBy(window.tasks, item => item.status)
    taskounter[0].textContent = groupedTasks.todo ? groupedTasks.todo.length : 0 
    taskounter[1].textContent = groupedTasks.inprogress ? groupedTasks.inprogress.length : 0 
    taskounter[2].textContent = groupedTasks.done ? groupedTasks.done.length : 0
}

/* operation functions */

//add a new task function
const addTask = (e) => {
    e.preventDefault()
    const title = document.getElementById('ctitle').value.trim()
    const status = document.getElementById('cstatus').value.trim()
    const priority = document.getElementById('cpriority').value.trim()
    const date = document.getElementById('cdate').value.trim()
    const description = document.getElementById('cdescription').value.trim()

    const data = {
        id: window.tasks.length == 0 ? 1 : window.tasks[window.tasks.length-1].id + 1,
        title,
        status,
        priority,
        date,
        description
    }


    if(validation(data, 'create')){
        window.tasks.push(data)
        //display statistics
        displayStatistics()
        //display a card
        displayCard(data)
        //hide modal
        const createModal = document.getElementById('create-modal')
        createModal.classList.remove('showModal')
        createModal.classList.add('hideModal')
    }
}

//edit a task
const editTask = (e) => {
    e.preventDefault()

    const id = document.getElementById('uid').value.trim()
    const title = document.getElementById('utitle').value.trim()
    const status = document.getElementById('ustatus').value.trim()
    const priority = document.getElementById('upriority').value.trim()
    const date = document.getElementById('udate').value.trim()
    const description = document.getElementById('udescription').value.trim()

    const data = {
        id,
        title,
        status,
        priority,
        date,
        description
    }
    const taskIndex = window.tasks.findIndex(item => item.id == id)

    if(validation(data, 'update')){
        const isStatusChange = window.tasks[taskIndex].status != data.status
        window.tasks[taskIndex] = data
        displayStatistics()
        updateCardInfo(data)
        if(isStatusChange)
            changeStatusPlace(data)
    }
}

//change task place when status change

const changeStatusPlace = (data) => {
    document.getElementById(`task${data.id}`).remove()
    displayCard(data)
}

//change card info when details change
const updateCardInfo = (data) => {
    const element = document.getElementById(`task${data.id}`)
    element.classList.remove('p1', 'p2', 'p3')
    element.classList.add(data.priority)
    element.firstElementChild.textContent = data.priority == 'p1' ? 'High priority' :  data.priority == 'p2' ? 'Medium priority' : 'Low priority'
    element.children[1].textContent = data.title
    element.children[2].textContent = data.description.length > 107 ? data.description.slice(0, 107)+'...' : data.description
}

//display
const displayCard = (data) => {
    const item = document.createElement('div')
    item.innerHTML = `
        <div id="task${data.id}" draggable="true" class="${data.priority} growcard border taskcard bg-white border-l-4 rounded-md px-4 py-4 shadow cursor-pointer mb-4 *:break-all">
            <div class="text-[10px] flex items-center gap-x-2 w-fit px-[10px] py-[4px] rounded-md font-medium">${data.priority == 'p1' ? 'High priority' :  data.priority == 'p2' ? 'Medium priority' : 'Low priority'}</div>
            <h1 class="text-[14px] mt-3 font-medium">${ data.title }</h1>
            <p class="text-[12px] text-gray-600 mt-1">${ data.description.length > 107 ? data.description.slice(0, 107)+'...' : data.description }</p>
            <div class="flex -space-x-1 overflow-hidden mt-6">
                <img class="inline-block h-6 w-6 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="member image">
                <img class="inline-block h-6 w-6 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="member image">
              </div>
        </div>
    `
    if(data.status == 'todo'){
        todoSection.appendChild(item)
    }else if(data.status == 'inprogress'){
        doingSection.appendChild(item)
    }else{
        doneSection.appendChild(item)
    }
}

/* listeners */

//add a new task listener
document.getElementById('createtask').addEventListener('click', addTask)
document.getElementById('updatetask').addEventListener('click', editTask)