const taskInput = document.querySelector(".task-input input");
let todos = JSON.parse(localStorage.getItem("todo-list"));
taskBox = document.querySelector(".task-box");

filters = document.querySelectorAll(".filters span");
filters.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showTodo(btn.id);
    })
})

clearAll = document.querySelector(".clear-btn");
clearAll.addEventListener("click", () => {
    let filter = document.querySelector("span.active").id;

    if(filter == "all"){
        todos.splice(0, todos.length);
    }
    else {
        todos.forEach((todo, id) => {
            if(todo.status == filter){
                let i = 0;
                for(i = id + 1; i < todos.length && todos[i].status == filter; i++){}
                todos.splice(id, i - id);
            }
        })
    }
    
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo(filter);
})

checkAll = document.querySelector(".check-btn");
checkAll.addEventListener("click", () => {
    todos.forEach((todo, id) => {
        todo.status = "completed";
    })
    
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo(document.querySelector("span.active").id);
})

function showTodo(filter){
    let li = "";

    if(todos) {
        todos.forEach((todo, id) => {
            let isCompleted = todo.status == "completed" ? "checked" : "";
            if(filter == todo.status || filter == "all") {
                li += `<li class="task">
                            <label for="${id}">
                                <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${isCompleted}>
                                <p class="${isCompleted}">${todo.name}</p>
                            </label>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="task-menu">
                                    <li><i onclick="editTask(${id}, '${todo.name}')" class="uil uil-pen"> Edit</i></li>
                                    <li><i onclick="deleteTask(${id})" class="uil uil-trash"> Delete</i></li>
                                </ul>
                            </div>
                        </li>`;
            }
        });
    }

    taskBox.innerHTML = li || `<span>There are no tasks</span>`;
}

showTodo(document.querySelector("span.active").id);

function updateStatus(selectedTask){
    let taskName = selectedTask.parentElement.lastElementChild;

    if(selectedTask.checked) {
        taskName.classList.add("checked");
        todos[selectedTask.id].status = "completed";
    }
    else {
        taskName.classList.remove("checked");
        todos[selectedTask.id].status = "pending";
    }

    localStorage.setItem("todo-list", JSON.stringify(todos));
}

function showMenu(selectedTask){
    let taskMenu = selectedTask.parentElement.lastElementChild;
    taskMenu.classList.add("show");
    document.addEventListener("click", e => {
        if(e.target.tagName != "I" || e.target != selectedTask){
            taskMenu.classList.remove("show");
        }
    })
}

let editedId;
let isEditedTask = false;

function editTask(taskId, taskName) {
    editedId = taskId;
    isEditedTask = true;
    taskInput.value = taskName;
}

function deleteTask(deleteId) {
    todos.splice(deleteId, 1);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo(document.querySelector("span.active").id);
}

taskInput.addEventListener("keyup", e =>{
    let userTask = taskInput.value.trim();

    if(e.key == "Enter" && userTask){
        if(isEditedTask){
            todos[editedId].name = userTask;
            isEditedTask = false;
        }
        else{
            if(!todos){
                todos = [];
            }

            let taskInfo = {name: userTask, status: "pending"};
            todos.push(taskInfo);
        }

        taskInput.value = "";
        
        localStorage.setItem("todo-list", JSON.stringify(todos));
        showTodo(document.querySelector("span.active").id);
    }

    if(e.key == "Enter" && !userTask){
        alert("No task written");
    }
});

