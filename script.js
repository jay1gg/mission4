let currentUser = localStorage.getItem('currentUser') || 'default';
let currentUserName = currentUser.name || '';
let currentUserPosition = currentUser.position || '';

document.getElementById('currentUserName').textContent = currentUserName;
document.getElementById('currentUserPosition').textContent = currentUserPosition;
document.getElementById('userInput').value = currentUserName;
document.getElementById('userPosition').value = currentUserPosition;

function loadTodoList() {
    document.getElementById('myUL').innerHTML = '';
    let todoList = JSON.parse(localStorage.getItem(currentUserName + '_todoList')) || [];
    todoList.forEach(item => addTodoElement(item.text, item.dueDate,item.priorityLevel, item.checked));
}

function saveTodoList() {
    let todoList = [];
    let items = document.querySelectorAll('ul li');
    items.forEach(item => {
        todoList.push({
            text: item.childNodes[0].nodeValue,
            dueDate: item.querySelector('.due-date').textContent,
            priorityLevel: item.querySelector('.priority-level').textContent,
            checked: item.classList.contains('checked')
        });
    });
    localStorage.setItem(currentUserName + '_todoList', JSON.stringify(todoList));
}

function loadUserList() {
    let userListContainer = document.getElementById('userListContainer');
    userListContainer.innerHTML = '';
    let users = JSON.parse(localStorage.getItem('users')) || ['default'];
    users.forEach(user => {
        let userDiv = document.createElement('div');
        userDiv.className = 'user-list';
        userDiv.textContent = user.name;
        userDiv.onclick = function () {
            currentUser = user;
            currentUserName = currentUser.name;
            currentUserPosition = currentUser.position;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            loadTodoList();
            updateDeleteUserButton();
            document.getElementById('currentUserName').textContent = currentUserName;
            document.getElementById('currentUserPosition').textContent = currentUserPosition;
            // toggleSidebar();
        };
        userListContainer.appendChild(userDiv);
    });
}

function addUser() {
    let newUserName = document.getElementById('userInput').value.trim();
    let newUserPosition = document.getElementById('userPosition').value.trim(); // Get position input
    if (newUserName && newUserName !== currentUserName) {
        let users = JSON.parse(localStorage.getItem('users')) || [];
        if (!users.find(user => user.name === newUserName)) {
            // Create an object with user details
            let newUser = {
                name: newUserName,
                position: newUserPosition
            };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            loadUserList();
        }
        document.getElementById('userInput').value = '';
        document.getElementById('userPosition').value = ''; // Clear position input after adding user
    }
}

function deleteUser() {
    let users = JSON.parse(localStorage.getItem('users')) || ['default'];
    if (users.length > 1) {
        let index = users.findIndex(user => user.name === currentUserName);
        if (index > -1) {
            users.splice(index, 1);
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.removeItem(currentUserName + '_todoList');
            currentUser = users[0];
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            currentUserName = currentUser.name;
            currentUserPosition = currentUser.position;
            loadUserList();
            loadTodoList();
            updateDeleteUserButton();
            document.getElementById('currentUserName').textContent = currentUserName;
            document.getElementById('currentUserPosition').textContent = currentUserPosition;
        }
    } else {
        alert("You cannot delete the last user.");
    }
}

function updateDeleteUserButton() {
    let deleteUserButton = document.querySelector('.deleteUserBtn');
    if (currentUserName === 'default') {
        deleteUserButton.style.display = 'none';
    } else {
        deleteUserButton.style.display = 'block';
    }
}

function addCloseButton(li) {
    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    li.appendChild(span);
    span.onclick = function () {
        var div = this.parentElement;
        div.style.display = "none";
        var todoText = div.childNodes[0].nodeValue;
        var todoList = JSON.parse(localStorage.getItem(currentUserName + '_todoList')) || [];
        var index = todoList.findIndex(item => item.text === todoText);
        if (index > -1) {
            todoList.splice(index, 1);
            localStorage.setItem(currentUserName + '_todoList', JSON.stringify(todoList));
        }
    }
}

function addTodoElement(text, dueDate, priorityLevel, checked = false) {
    var li = document.createElement("li");
    var t = document.createTextNode(text);
    var dateSpan = document.createElement("span");
    dateSpan.className = "due-date";
    dateSpan.textContent = dueDate;
    var prioritySpan = document.createElement("span");
    prioritySpan.className = "priority-level";
    prioritySpan.textContent = priorityLevel;
    li.appendChild(t);
    li.appendChild(prioritySpan);
    li.appendChild(dateSpan);    
    if (checked) {
        li.classList.add('checked');
    }
    document.getElementById("myUL").appendChild(li);
    addCloseButton(li);
}

var list = document.querySelector('ul');
list.addEventListener('click', function (ev) {
    if (ev.target.tagName === 'LI') {
        ev.target.classList.toggle('checked');
        saveTodoList();
    }
}, false);

function newElement() {
    var inputValue = document.getElementById("myInput").value;
    var dueDate = document.getElementById("myDate").value;
    var priorityLevel = document.getElementById("priorityLevel").value;
    if (inputValue === '') {
        alert("You must write something!");
    } else if (dueDate === '') {
        alert("You must select a due date!");
    } else {
        addTodoElement(inputValue, dueDate, priorityLevel);
        saveTodoList();
    }
    document.getElementById("myInput").value = "";
    document.getElementById("myDate").value = "";
}

function clearAllTasks() {
    document.getElementById('myUL').innerHTML = '';
    saveTodoList();
}

loadUserList();
// loadTodoList();
updateDeleteUserButton();

// Sidebar toggle
function toggleSidebar() {
    var sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('show-sidebar');
}

// Clock
function updateClock() {
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();
    var day = now.getDate();
    var month = now.getMonth() + 1;
    var year = now.getFullYear();
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    day = day < 10 ? '0' + day : day;
    month = month < 10 ? '0' + month : month;
    var currentTime = hours + ":" + minutes + ":" + seconds + " " + day + "/" + month + "/" + year;
    document.getElementById('clock').textContent = currentTime;
}
updateClock(); // Updateclock immediately
setInterval(updateClock, 1000); // Update clock every second