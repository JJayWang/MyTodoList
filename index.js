let todoArray = [];
        let selectedId = '';

        const wrapper = document.querySelector('.wrapper');
        const dateInput = document.querySelector('#date-input');
        const timeInput = document.querySelector('#time-input');
        const todoInput = document.querySelector('#todo-input');
        const checkBtn = document.querySelector('#check-todo');
        const todoList = document.querySelector('#todo-container');
        const toListBtn = document.querySelector('#to-list');
        const toFormBtn = document.querySelector('#to-form');

        getLocalItem();
        drawList();

        checkBtn.addEventListener('click', async function (event) {
            event.preventDefault();
            if (dateInput.value !== '' && timeInput.value !== '' && todoInput.value !== '') {
                let data = { todo: todoInput.value, date: dateInput.value, time: timeInput.value }
                if (selectedId !== '') {
                    let updateData = todoArray.find(item => item.id === selectedId);
                    updateData.todo = data.todo;
                    updateData.date = data.date;
                    updateData.time = data.time;

                    document.querySelector(`#item-${selectedId}`).classList.remove('active');
                    selectedId = '';
                    displayNotification('Update success!')
                } else {
                    let id = await fetch("https://www.uuidtools.com/api/generate/v4").then(resp => resp.json());
                    data.id = id[0];
                    todoArray.push(data);
                    displayNotification('Insert success!')
                }

                setLocalItem();
                drawList();
                dateInput.value = '';
                timeInput.value = '';
                todoInput.value = '';
            } else {
                displayNotification('Please set todo value');
            }
        });

        toListBtn.addEventListener('click', function () {
            wrapper.classList.toggle('hidden');
        })

        toFormBtn.addEventListener('click', function () {
            wrapper.classList.toggle('hidden');
        });

        function drawList() {
            let html = '';
            if (todoArray.length > 0) {
                todoArray.forEach((element) => {
                    html += `<li id='item-${element.id}' title='${element.date} ${element.time}'>
                        <span>${element.todo}</span>
                        <div class="icons">
                            <i class="fa-solid fa-pen" onclick="updateTodo('${element.id}')"></i>
                            <i class="fa-solid fa-trash-can" onclick="deleteTodo('${element.id}')"></i>
                        </div>
                    </li>`;
                });
            }
            todoList.innerHTML = html
        }

        function updateTodo(id) {
            selectedId = id;
            let selectedTodo = todoArray.find((item) => item.id === selectedId);
            dateInput.value = selectedTodo.date;
            timeInput.value = selectedTodo.time;
            todoInput.value = selectedTodo.todo;
            document.querySelector(`#item-${id}`).classList.add('active');
            toFormBtn.click();
        }

        function deleteTodo(id) {
            let selectedTodo = todoArray.find((item) => item.id === id);
            if (selectedTodo) {
                if (confirm(`Check to delete ${selectedTodo.todo}?`)) {
                    todoArray = todoArray.filter((item) => item.id === id);
                    drawList();
                    selectedId = '';
                }
            }
        }

        function setLocalItem() {
            localStorage.setItem('todoData', JSON.stringify(todoArray));
        }

        function getLocalItem() {
            let json = localStorage.getItem('todoData');
            if (json && json !== '') {
                todoArray = JSON.parse(json);
            }
        }

        const effectWrap = document.querySelector('#notification-wrap');
        const effectMsg = document.querySelector('#notification-msg');
        const closeEffect = document.querySelector('#close-btn');
        closeEffect.addEventListener('click', () => {
            effectWrap.classList.add('hide');
            effectWrap.classList.remove('show');
            effectWrap.classList.remove('displaing');
        })

        function displayNotification(message) {
            effectMsg.textContent = message;
            if(!effectWrap.classList.contains('displaing')){
                effectWrap.classList.add('displaing');
                effectWrap.classList.add('show');
                effectWrap.classList.remove('hide');
                setTimeout(() => {
                    effectWrap.classList.remove('show');
                    effectWrap.classList.add('hide');
                    effectWrap.classList.remove('displaing');
                }, 3000)
            }
            
        }