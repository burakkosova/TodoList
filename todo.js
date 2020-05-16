const form = document.querySelector('#todo-form');
const todoInput = document.querySelector('#todo');
const todoList = document.querySelector('.list-group');
const firstCardBody = document.querySelectorAll('.card-body')[0];
const secondCardBody = document.querySelectorAll('.card-body')[1];
const filter = document.querySelector('#filter');
const btnClear = document.getElementById('clear-todos');

eventListeners();

function eventListeners() {
  form.addEventListener('submit',addTodo);
  document.addEventListener('DOMContentLoaded',loadAllTodosToUI);
  secondCardBody.addEventListener('click',deleteTodo);
  filter.addEventListener('keyup',filterTodos);
  btnClear.addEventListener('click',clearTodos);
}

function clearTodos() {
  if(confirm('Tüm todoları silmek istediğinize emin misiniz?')) {
    while(todoList.firstElementChild != null) {
      todoList.removeChild(todoList.firstElementChild);
    }

    localStorage.removeItem('todos');
  }
}

function filterTodos(event) {
  const filterValue = event.target.value.toLowerCase();
  const listItems = document.querySelectorAll('.list-group-item');

  listItems.forEach(listItem => {
    const text = listItem.textContent.toLowerCase();

    if(text.indexOf(filterValue) === -1) {
      listItem.setAttribute('style','display: none !important;');
    }else {
      listItem.removeAttribute('style');
    }
  })
}

function deleteTodo(event) {
  if(event.target.className === 'fa fa-times') {
    event.target.parentElement.parentElement.remove();
    deleteTodoFromStorage(event.target.parentElement.parentElement.textContent);
    showAlert('info','Todo başarıyla silindi.');
  }
}

// Deleting Todos From storage
function deleteTodoFromStorage(todoDelete) {
  let todos = getTodosFromStorage();

  todos.forEach((todo,index) => {
    if(todo === todoDelete) {
      todos.splice(index,1);
    }
  })

  localStorage.setItem('todos',JSON.stringify(todos));
}

// Adding all todos to UI when page Loads
function loadAllTodosToUI() {
  let todos = getTodosFromStorage();

  todos.forEach(todo => {
    addTodoToUI(todo);
  });
}

//  Getting Value From input
function addTodo(event) {
  const newTodo = todoInput.value.trim();

  if(newTodo === "") {
    showAlert('danger','Lütfen bir todo girin!');
  }else if(isInTheList(newTodo)){
    showAlert('danger','Todo zaten listede var!');
  }else {
    addTodoToUI(newTodo);
    addTodoToStorage(newTodo);
    showAlert('success','Todo başarıyla eklendi.');
  }

  event.preventDefault();
}

function isInTheList(todo) {
  const lowerCaseTodo = todo.toLowerCase();
  const todos = getTodosFromStorage().map(element => element.toLowerCase());
  return todos.includes(lowerCaseTodo);
}

function getTodosFromStorage() {
  let todos;

  if(localStorage.getItem('todos') === null) {
    todos = [];
  }else {
    todos = JSON.parse(localStorage.getItem('todos'));
  }
  return todos;
}

function addTodoToStorage(newTodo) {
  let todos = getTodosFromStorage();
  todos.push(newTodo);
  localStorage.setItem('todos',JSON.stringify(todos));
}

function showAlert(type,message) {
  // Creating alert element
  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.setAttribute('role','alert');
  alert.textContent = message;

  // Adding alert element to the first card body
  firstCardBody.appendChild(alert);

  // Setting time out
  setTimeout(() => {
    alert.remove();
  }, 2000);

}

//  Adding the string value from addTodo() to the UI 
function addTodoToUI(newTodo) {
  // Creating list Item
  const listItem = document.createElement('li');
  listItem.className = 'list-group-item d-flex justify-content-between';
  // Creating Link
  const link = document.createElement('a');
  link.href  = '#';
  link.className = 'delete-item';
  link.innerHTML = '<i class="fa fa-times"></i>';

  // Adding text node and link to the list item
  listItem.appendChild(document.createTextNode(newTodo));
  listItem.appendChild(link);

  // Adding list item to the ul element
  todoList.appendChild(listItem);
  todoInput.value = '';

}
