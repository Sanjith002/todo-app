// Shared script for login, register, and todos pages
const SERVER_URL = "https://todo-app-lv02.onrender.com";
const token = localStorage.getItem("token");

// Login page logic
async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const res = await fetch(`${SERVER_URL}/auth/login`,{
            method: "POST",
            headers: {
                "Content-type":"application/json"
            },
            body: JSON.stringify({email,password}) 
        })
        if(!res.ok){
            const message = await res.text();
            throw new Error(message);
        }
        const data = await res.json();
        localStorage.setItem("token", data.token);
        alert("Login successful!")
        window.location.href = "todos.html";
    } catch (error) {
        alert(error.message);
    }
}

// Register page logic
async function register() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
        const res = await fetch(`${SERVER_URL}/auth/register`,{
            method: "POST",
            headers: {
                "Content-type":"application/json"
            },
            body: JSON.stringify({email,password}) 
        })
        const message = await res.text();
        if (res.ok) {
            alert(message);
            window.location.href = "login.html";
        } else {
            throw new Error(message);
        }
    } catch (error) {
        
        alert(error.message || "Unknown Error");
    }
}

// Todos page logic
function createTodoCard(todo) {
        const card =  document.createElement("div")
        card.className = "todo-card"
        const checkbox = document.createElement("input")
        checkbox.type = "checkbox"
        checkbox.className = "todo-checkbox";
        checkbox.checked = todo.isCompleted
        checkbox.addEventListener("change", function (){
            const updatedTodo = {...todo, isCompleted: checkbox.checked}
            updateTodoStatus(updatedTodo)
        })
        const span =  document.createElement("span")
        span.textContent = todo.title
        if(todo.isCompleted){
            span.style.textDecoration = "line-through"
            span.style.color = "#aaa"
        }
        const deleteBtn =  document.createElement("button")
        deleteBtn.textContent = "X"
        deleteBtn.addEventListener("click", function (){
            deleteTodo(todo.id)
        })
        card.appendChild(checkbox)
        card.appendChild(span)
        card.appendChild(deleteBtn)

        return card;
}

async function loadTodos() {
    if(!token){
        alert("Please Login First")
        window.location.href = "login.html";
        return
    }
    try {
        const res = await fetch(`${SERVER_URL}/api/todo/get`, {
            method: "GET",
            headers: {
                "Authorization":`Bearer ${token}`
            },
        })
        if(!res.ok){
            const errorData = await res.json();
            throw new Error(errorData.message || "Failed to get todo");
        }
        const todos = await res.json();
        todos.sort((a, b) => b.id - a.id);
        const todoList = document.getElementById("todo-list");
        todoList.innerHTML = "";

        if (!todos || todos.length === 0) {
            todoList.innerHTML =
                '<p id="empty-message">No Todos yet. Add one below!</p>';
        } else {
            todos.forEach(todo => {
                const card = createTodoCard(todo);
                todoList.appendChild(card);
            });
        }
    } catch (error) {
        console.error(error);
        document.getElementById("todo-list").innerHTML =
            '<p style="color:red">Failed to load Todos!</p>';
    }
}

async function addTodo() {
    const input = document.getElementById("new-todo")
    const todoText = input.value.trim();
    if(!todoText) return;
    try {
        const res = await fetch(`${SERVER_URL}/api/todo/create`, {
            method: "POST",
            headers: {
                "Authorization":`Bearer ${token}`,
                "Content-type":"application/json"
            },
            body: JSON.stringify({title: todoText, isCompleted: false})
        })
        if(!res.ok){
            const message  = await res.text();
            throw new Error(message || "Failed to create todo");
        }
        input.value = ""
        loadTodos();
    } catch (error) {
        alert(error.message)
    }
}

async function updateTodoStatus(todo) {
    try {
        const res = await fetch(`${SERVER_URL}/api/todo`, {
            method: "PUT",
            headers: {
                "Authorization":`Bearer ${token}`,
                "Content-type":"application/json"
            },
            body: JSON.stringify(todo)
        })
        if(!res.ok){
            const errorData = await res.json();
            throw new Error(errorData.message || "Failed to update todo")
        } 
        const updatedTodo = await res.json();
        loadTodos();
        return updatedTodo;
    } catch (error) {
        alert(error.message)
    }
}

async function deleteTodo(id) {
    try {
        const res = await fetch(`${SERVER_URL}/api/todo/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization":`Bearer ${token}`
            }
        })
        if (!res.ok) {
            throw new Error("Failed to delete todo");
        }
        loadTodos();
        alert("Todo deleted successfully!");
    } catch (error) {
        alert(error.message)
    }
}

// Page-specific initializations
document.addEventListener("DOMContentLoaded", function () {
    if (document.getElementById("todo-list")) {
        loadTodos();
    }
});