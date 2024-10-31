let tasks = []

const todoSection = document.getElementById('todo')
const doingSection = document.getElementById('doing')
const doneSection = document.getElementById('done')

const manageValidationErrors = (input, error) => {
    if(error != ""){
        console.log(input.classList)
        input.classList.add('inputError')
        console.log(input.classList)
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
        date.getFullYear()+'-'+date.getMonth()+1+'-'+date.getDate()
        if(data.date < date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()){
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

    titleInput.value = ''
    statusInput.value = ''
    priorityInput.value = ''
    dateInput.value = ''
    descriptionInput.value = ''

    return true
}


//add a new task function
const addTask = (e) => {
    e.preventDefault()
    const title = document.getElementById('ctitle').value.trim()
    const status = document.getElementById('cstatus').value.trim()
    const priority = document.getElementById('cpriority').value.trim()
    const date = document.getElementById('cdate').value.trim()
    const description = document.getElementById('cdescription').value.trim()

    const data = {
        title,
        status,
        priority,
        date,
        description
    }


    if(validation(data, 'create')){
        tasks.push(data)
        console.log(tasks)
        if(data.status == 'todo'){
            todoSection.innerHTML += `
                <div draggable="true" class="${data.priority} border taskcard bg-white border-l-4 rounded-md px-4 py-4 shadow cursor-pointer mb-4 *:break-all">
                    <div class="text-[10px] flex items-center gap-x-2 w-fit px-[10px] py-[4px] rounded-md font-medium">High Priority</div>
                    <h1 class="text-[14px] mt-3 font-medium">${ data.title }</h1>
                    <p class="text-[12px] text-gray-600 mt-1">${ data.description.length > 107 ? data.description.slice(0, 107)+'...' : data.description}</p>
                    <div class="flex -space-x-1 overflow-hidden mt-6">
                        <img class="inline-block h-6 w-6 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="member image">
                        <img class="inline-block h-6 w-6 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="member image">
                      </div>
                </div>
            `
        }else if(data.status == 'inprogress'){
            doingSection.innerHTML += `
                <div draggable="true" class="${data.priority} border taskcard bg-white border-l-4 rounded-md px-4 py-4 shadow cursor-pointer mb-4 *:break-all">
                    <div class="text-[10px] flex items-center gap-x-2 w-fit px-[10px] py-[4px] rounded-md font-medium">High Priority</div>
                    <h1 class="text-[14px] mt-3 font-medium">${ data.title }</h1>
                    <p class="text-[12px] text-gray-600 mt-1">${ data.description.length > 107 ? data.description.slice(0, 107)+'...' : data.description}</p>
                    <div class="flex -space-x-1 overflow-hidden mt-6">
                        <img class="inline-block h-6 w-6 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="member image">
                        <img class="inline-block h-6 w-6 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="member image">
                      </div>
                </div>
            `
        }else{
            doneSection.innerHTML += `
                <div draggable="true" class="${data.priority} border taskcard bg-white border-l-4 rounded-md px-4 py-4 shadow cursor-pointer mb-4 *:break-all">
                    <div class="text-[10px] flex items-center gap-x-2 w-fit px-[10px] py-[4px] rounded-md font-medium">High Priority</div>
                    <h1 class="text-[14px] mt-3 font-medium">${ data.title }</h1>
                    <p class="text-[12px] text-gray-600 mt-1">${ data.description.length > 107 ? data.description.slice(0, 107)+'...' : data.description}</p>
                    <div class="flex -space-x-1 overflow-hidden mt-6">
                        <img class="inline-block h-6 w-6 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="member image">
                        <img class="inline-block h-6 w-6 rounded-full ring-2 ring-white" src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="member image">
                      </div>
                </div>
            `
        }
    }
}

//add a new task listener
document.getElementById('createtask').addEventListener('click', addTask)