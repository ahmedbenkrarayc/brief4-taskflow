let draggedElement, dragparent
let multipleData = []

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
    const titleInput = type == 'create' ? document.getElementById('ctitle') : type == 'update' ? document.getElementById('utitle') : document.getElementById('mtitle')
    const statusInput = type == 'create' ? document.getElementById('cstatus') : type == 'update' ? document.getElementById('ustatus') : document.getElementById('mstatus')
    const priorityInput = type == 'create' ? document.getElementById('cpriority') : type == 'update' ? document.getElementById('upriority') : document.getElementById('mpriority')
    const dateInput = type == 'create' ? document.getElementById('cdate') : type == 'update' ? document.getElementById('udate') : document.getElementById('mdate')
    const descriptionInput = type == 'create' ? document.getElementById('cdescription') : type == 'update' ? document.getElementById('udescription') : document.getElementById('mdescription')

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

    if(type != 'update'){
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
        filterTasks()
        //hide modal
        closeModal('create-modal')
    }
}

const closeModal = (id) => {
    const modal = document.getElementById(id)
    modal.classList.remove('showModal')
    modal.classList.add('hideModal')
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
        // updateCardInfo(data)
        if(isStatusChange)
            document.getElementById(`task${data.id}`).remove()
        filterTasks()
        closeModal('update-modal')
    }
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
        <div id="task${data.id}" draggable="true" class="${data.priority} draggable growcard border taskcard bg-white border-l-4 rounded-md px-4 py-4 shadow cursor-pointer mb-4 *:break-all">
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

//Delete a task
const deleteTask = (e) => {
    e.preventDefault()
    const id = document.getElementById('uid').value
    const sure = confirm('Are you sure you want to delete this task ?')
    if(sure){
        const taskIndex = window.tasks.findIndex(item => item.id == id)
        window.tasks.splice(taskIndex,1)
        document.getElementById(`task${id}`).remove()
        displayStatistics()
        closeModal('update-modal')
    }
}

/* filters */

//filter by keyword
const filterTasks = () => {
    const dataClone = [...window.tasks]
    const keyword = document.getElementById('searchInput').value
    const prioritySort = document.getElementById('prioritySort').value
    const dateSort = document.getElementById('dateSort').value

    const data = dataClone.filter(item => item.title.toLowerCase().includes(keyword.toLowerCase()) || item.description.toLowerCase().includes(keyword.toLowerCase()))

    if(prioritySort != "" && dateSort != ""){
        data.sort((a, b) => {
            if(a.priority != b.priority){
                return prioritySort == "asc" ? b.priority.localeCompare(a.priority) : a.priority.localeCompare(b.priority)
            }

            return dateSort == "asc" ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date)
        })
    }else{
        if(prioritySort != ""){
            data.sort((a, b) => prioritySort == "asc" ? b.priority.localeCompare(a.priority) : a.priority.localeCompare(b.priority))
        }
    
        if(dateSort != ""){
            data.sort((a, b) => dateSort == "asc" ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date))
        }
    }


    window.tasks.forEach(item => {
        document.getElementById(`task${item.id}`)?.remove()
    })


    data.forEach(item => {
        displayCard(item)
    })
}

//clear filters
const clear = () => {
    document.getElementById('prioritySort').value = ""
    document.getElementById('dateSort').value = ""
    document.getElementById('searchInput').value = ""
    filterTasks()
}

//drag and drop
const dragDrop = () => {
    const dropzones = document.querySelectorAll('.dropzone')

    document.addEventListener('dragstart', (e) => {
        if(e.target && e.target.classList.contains('draggable')){
            draggedElement = e.target
            dragparent = draggedElement.parentElement.parentElement
        }
    })

    dropzones.forEach(item => {
        item.addEventListener('dragover', (e) => {
            e.preventDefault()
        })

        item.addEventListener('drop', (e) => {
            e.preventDefault()
            if(e.currentTarget != dragparent){
                const id = draggedElement.id.split('k')[1]
                const index = window.tasks.findIndex(task => task.id == id)
                window.tasks[index].status = e.currentTarget.id != 'doing' ? e.currentTarget.id : 'inprogress'
                filterTasks()
                displayStatistics()
            }
        })
    })
}

dragDrop()

//create multiple

const createMultiple = (e) => {
    e.preventDefault()
    
    const multidisplay = document.getElementById('multidisplay')
    
    const title = document.getElementById('mtitle').value.trim()
    const status = document.getElementById('mstatus').value.trim()
    const priority = document.getElementById('mpriority').value.trim()
    const date = document.getElementById('mdate').value.trim()
    const description = document.getElementById('mdescription').value.trim()

    const data = {
        id: new Date().getTime(),
        title, 
        status,
        priority,
        date,
        description
    }

    
    if(validation(data, 'multiple')){
        multipleData.push(data)
        multidisplay.innerHTML += `
            <div id="multi${data.id}" class="flex justify-between items-center mb-4 pb-4 border-b">
                <h1 class="text-[14px] font-medium">${data.title}</h1>
                <i onclick="deleteTempTask(${data.id})" class="deletetmp fa-solid fa-x text-[12px] cursor-pointer"></i>
            </div>
        `
    }
}

const deleteTempTask = (id) => {
    const index = multipleData.findIndex(item => item.id == id)
    multipleData.splice(index, 1)
    document.getElementById("multi"+id).remove()
}

const multiSave = (e) => {
    e.preventDefault()
    if(multipleData.length > 0){
        multipleData.forEach(item => {
            item.id = window.tasks.length != 0 ? window.tasks[window.tasks.length - 1].id + 1 : 1
            window.tasks.push(item)
        })
        filterTasks()
        displayStatistics()
        const children = document.getElementById('multidisplay').children
        Array.from(children).forEach(item => item.remove())
        multipleData = []
        closeModal('multiple-modal')
    }
}

/* listeners */

//add a new task listener
document.getElementById('createtask').addEventListener('click', addTask)
document.getElementById('updatetask').addEventListener('click', editTask)
document.getElementById('deletetask').addEventListener('click', deleteTask)
document.getElementById('searchInput').addEventListener('input', filterTasks)
document.getElementById('apply').addEventListener('click', (e) => {
    e.preventDefault()
    filterTasks()
})
document.getElementById('cancelfilters').addEventListener('click', (e) => {
    e.preventDefault()
    clear()
})
document.getElementById('addMulti').addEventListener('click', createMultiple)
document.getElementById('multipletask').addEventListener('click', multiSave)