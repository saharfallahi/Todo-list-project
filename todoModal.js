// variables

const todoForm=document.querySelector(".todo-form");
const todoInput=document.querySelector(".todo-input");
const todoList=document.querySelector(".todolist");
const selectFilter=document.querySelector(".filter-todos");
const modal=document.querySelector(".modal-container");
const backdrop=document.querySelector(".backdrop");
const editInput=document.querySelector(".edit-input");
const editForm=document.querySelector(".edit-form");

let filterValue = "all";

//events

document.addEventListener("DOMContentLoaded",(e)=>{
    const todos=getAllTodos();
    createTodos(todos);
})
todoForm.addEventListener("submit",addNewTodo);
selectFilter.addEventListener("change",(e)=>{
    filterValue=e.target.value;
    filterTodos();
});

// functions

function addNewTodo(e){
    e.preventDefault();
    if(!todoInput.value) return null;
    const newTodo={
        id:Date.now(),
        title:todoInput.value,
        createdAt:new Date().toISOString(),
        isCompleted:false,
    }
    
    saveTodo(newTodo);
    filterTodos();    
};

function createTodos(todos){
    let result="";
    todos.forEach((todo)=>{
        result+=`<li class="todo">
        <p class="todo__title ${todo.isCompleted && "completed"}">${todo.title}</p>
        <span class="todo__createdAt">${new Date(todo.createdAt).toLocaleDateString("fa-IR")}</span>
        <button class="todo__edit" data-todo-id="${todo.id}">edit</button>
        <button class="todo__check" data-todo-id="${todo.id}"><i class="far fa-check-square"></i></button>
        <button class="todo__remove" data-todo-id="${todo.id}"><i class="far fa-trash-alt"></i></button>
        </li>`;
    })
    todoList.innerHTML=result;
    todoInput.value="";

    const removeBtns=[...document.querySelectorAll(".todo__remove")];
    removeBtns.forEach(btn=>btn.addEventListener("click",removeTodo));

    const checkBtns=[...document.querySelectorAll(".todo__check")];
    checkBtns.forEach(btn=>btn.addEventListener("click",checkTodo));

    const editBtns=[...document.querySelectorAll(".todo__edit")];
    editBtns.forEach(btn=>btn.addEventListener("click",editTodo));
};

function filterTodos(){
    // const filter=e.target.value;
    const todos=getAllTodos();
    switch (filterValue) {
        case "all":{
            createTodos(todos);
            break;
        }
        case "completed":{
            const filteredTodos=todos.filter(todo=>todo.isCompleted);
            createTodos(filteredTodos);
            break;
        }
        case "uncompleted":{
            const filteredTodos=todos.filter(todo=>!todo.isCompleted);
            createTodos(filteredTodos);
            break;
        }
        default:
            createTodos(todos);
            break;
    }
}

function editTodo(e){
    let todos=getAllTodos();
    const todoId=Number(e.target.dataset.todoId);
    const todo=todos.find(t=>t.id===todoId);
    todo.title=todo.title.replace(`<span class="edited">edited</span>`,"");
    modal.classList.remove("hidden");
    backdrop.classList.remove("hidden");
    editInput.value=todo.title;
    editForm.addEventListener("submit",(e)=>{
        if(!editInput.value) return null;
        if(todo.title!==editInput.value) todo.title=`${editInput.value} <span class="edited">edited</span>`;
        saveAllTodos(todos);
        filterTodos();
    });
}

function checkTodo(e){
    let todos=getAllTodos();
    const todoId=Number(e.target.dataset.todoId);
    const todo=todos.find(t => t.id===todoId);
    todo.isCompleted = !todo.isCompleted;
    saveAllTodos(todos);
    filterTodos();
}

function removeTodo(e){
    let todos=getAllTodos();
    const todoId=Number(e.target.dataset.todoId);
    todos=todos.filter(t => t.id!==todoId);
    saveAllTodos(todos);
    filterTodos();
}

function getAllTodos(){
   const savedTodos=JSON.parse(localStorage.getItem("todos")) || [];
   return savedTodos;
}

function saveTodo(todo){
    const savedTodos=getAllTodos();
    savedTodos.push(todo);
    localStorage.setItem("todos",JSON.stringify(savedTodos));
    return savedTodos;
}

function saveAllTodos(todos){
    localStorage.setItem("todos",JSON.stringify(todos));
}