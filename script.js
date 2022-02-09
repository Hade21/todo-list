const todos = [];
const RENDER_EVENT = "render-todo";


document.addEventListener('DOMContentLoaded', function() {
    const submitForm = document.getElementById("form");
    submitForm.addEventListener('submit', function(event) {
        event.preventDefault();
        addTodo();
    })
})


function generateId() {
    return +new Date();
}

function generateTodoObject(id, task, tanggal, isComplete) {
    return {
        id,
        task,
        tanggal,
        isComplete
    }
}

document.addEventListener(RENDER_EVENT, function() {
    const uncompleteTodo = document.getElementById("todos");
    uncompleteTodo.innerHTML = "";

    const completedTodo = document.getElementById("completed-todos");
    completedTodo.innerHTML = "";

    for (todoItem of todos){
        const todoElement = makeTodo(todoItem);
        if(todoItem.isComplete == false){
            uncompleteTodo.append(todoElement);
        } else {
            completedTodo.append(todoElement);
        }
    }
})

function addTodo() {
    const toDo = document.querySelector("#title").value;
    const tanggal = document.querySelector("#date").value;
    const generateID = generateId();
    const toDoObject = generateTodoObject(generateID, toDo, tanggal, false);
    todos.push(toDoObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeTodo(toDoObject) {
    const textTitle = document.createElement("h2");
    textTitle.innerText = toDoObject.task;

    const textTimeStamp = document.createElement("p");
    textTimeStamp.innerText = toDoObject.tanggal;

    const textContainer = document.createElement("div");
    textContainer.classList.add("inner");
    textContainer.append(textTitle, textTimeStamp);

    const container = document.createElement("div");
    container.classList.add("item", "shadow");
    container.append(textContainer);
    container.setAttribute("id", `todo-${toDoObject.id}`);

    if(toDoObject.isComplete) {
        const undoButton = document.createElement("button");
        undoButton.classList.add("undo-button");
        undoButton.addEventListener("click", function() {
            undoTask(toDoObject.id);
        });

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("trash-button");
        deleteButton.addEventListener("click", function() {
            removeTask(toDoObject.id);
        });
        container.append(undoButton, deleteButton);
    }
    else{
        const checkButton = document.createElement("button");
        checkButton.classList.add("check-button");
        checkButton.addEventListener("click", function() {
            addTaskComplete(toDoObject.id);
        });
        container.append(checkButton);
    }


    return container;
}

function addTaskComplete(todoId) {
    const todoTarget = findTodo(todoId);
    if(todoTarget == null) return;
    
    todoTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function findTodo(todoId) {
    for(todoItem of todos){
        if(todoItem.id === todoId){
            return todoItem;
        }
    }
    return null;
}

function undoTask(todoId) {
    const todoTarget = findTodo(todoId);
    if (todoTarget == null) return;

    todoTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function removeTask(todoId) {
    const todoTarget = findTodoIndex(todoId);
    if(todoTarget === -1) return;
    todos.splice(todoTarget, 1);

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function findTodoIndex(todoId) {
    for(index in todos){
        if(todos[index].id === todoId){
            return index;
        }
    }
    return -1;
}