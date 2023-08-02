document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const formData = new FormData(loginForm);
        const userData = {
            username: formData.get('username'),
            password: formData.get('password'),
        };


        fetch('http://127.0.0.1:3000/login', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        })
        .then(response => response.json())
        .then(data => {

            if (data.success) {

                window.location.href = '/dashboard';
            } else {

                alert('Sorry the entered information does not match our records.');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred during login.');
        });
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const todoListContainer = document.getElementById('todo-list-container');
    const addListButton = document.getElementById('add-list');

    let listCounter = 1; // add another list 


 // Function to create a new to-do list container
 function createTodoListContainer(listName, items) {
    const listContainer = document.createElement('div');
    listContainer.classList.add('list-container');
    listContainer.dataset.listId = listCounter;

    const listNameInput = document.createElement('input');
    listNameInput.type = 'text';
    listNameInput.value = listName; 
    listNameInput.placeholder = 'First List';
    listContainer.appendChild(listNameInput);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete List';
    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener('click', () => {
        onDeleteButtonClick(listContainer);
    });
    listContainer.appendChild(deleteButton);

    const updateButton = document.createElement('button');
    updateButton.textContent = 'Update';
    updateButton.addEventListener('click', () => {
    onUpdateButtonClick(listContainer);
    });
    listContainer.appendChild(updateButton);
   
    const addItemButton = document.createElement('button');
    addItemButton.textContent = 'Add Item';
    addItemButton.addEventListener('click', () => {
        const itemContainer = document.createElement('div');
        itemContainer.classList.add('item-container');

        const itemInput = document.createElement('input');
        itemInput.type = 'text';
        itemInput.placeholder = 'Enter item name';
        itemContainer.appendChild(itemInput);

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `checkbox-${listCounter}`;
        itemContainer.appendChild(checkbox);

        const label = document.createElement('label');
        label.textContent = 'Completed';
        label.htmlFor = `checkbox-${listCounter}`;
        itemContainer.appendChild(label);

        listContainer.appendChild(itemContainer);
    });
    listContainer.appendChild(addItemButton);

    todoListContainer.appendChild(listContainer);
    listCounter++;
}

// new list button
addListButton.addEventListener('click', () => {
    const listName = 'Enter list name'; 
    const items = [];
    createTodoListContainer(listName, items); 
});

    // Function to check if all items in a list are checked
    function areAllItemsChecked(listContainer) {
        const checkboxes = listContainer.querySelectorAll('.item-container input[type="checkbox"]');
        for (const checkbox of checkboxes) {
            if (!checkbox.checked) {
                return false;
            }
        }
        return true;
    }

    function onUpdateButtonClick(listContainer) {
      const listNameInput = listContainer.querySelector('input[type="text"]');
      const listName = listNameInput.value.trim();

      const itemContainers = listContainer.querySelectorAll('.item-container');
      const items = [];
      for (const itemContainer of itemContainers) {
           const itemInput = itemContainer.querySelector('input[type="text"]');
           const itemName = itemInput.value.trim();
           const checkbox = itemContainer.querySelector('input[type="checkbox"]');
           const completed = checkbox.checked;

           items.push({
           item_name: itemName,
           completed: completed,
    });
    
    fetch('/update-list', {
        method: 'POST',
        headers: {
           'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            listName: listName,
            items: items,
        }),
    })
    .then(response => response.json())
    .then(data => {
// response from the server if needed
 })
 .catch(error => {
console.error('Error:', error);
alert('An error occurred while updating the list.');
});
}
}

    // Function to handle the delete button click
    function onDeleteButtonClick(listContainer) {
        if (areAllItemsChecked(listContainer)) {
            listContainer.remove();
        } else {
            // Show a message indicating that not all items are checked and cannot delete yet.
            alert('Please check all items before deleting the list.');
        }
    }

    // Add event listener to the "Add New List" button
    addListButton.addEventListener('click', () => {
        createTodoListContainer();
    });

    // Initial creation of one to-do list container
    createTodoListContainer();
});

//calendar functions 
document.addEventListener('DOMContentLoaded', () => {
    const currentMonthElement = document.getElementById('currentMonth');
    const datesContainer = document.getElementById('dates');
    const prevMonthButton = document.getElementById('prevMonth');
    const nextMonthButton = document.getElementById('nextMonth');
  
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
  
    function displayCalendar() {
      currentMonthElement.textContent = new Date(currentYear, currentMonth).toLocaleString('default', {
        month: 'long',
        year: 'numeric',
      });
  
      datesContainer.innerHTML = '';
  
      const firstDay = new Date(currentYear, currentMonth, 1).getDay();
      const lastDate = new Date(currentYear, currentMonth + 1, 0).getDate();
  
      for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.textContent = '';
        datesContainer.appendChild(emptyDay);
      }
      
      for (let i = 1; i <= lastDate; i++) {
        const dateElement = document.createElement('div');
        dateElement.textContent = i;
        dateElement.classList.add('date'); // Add the 'date' class
        dateElement.addEventListener('click', () => {
          const event = prompt('Enter event for this day:');
          if (event) {
            dateElement.textContent = `${i} - ${event}`;
          }
        });
        datesContainer.appendChild(dateElement);
      }
    }
  
    prevMonthButton.addEventListener('click', () => {
      currentMonth--;
      if (currentMonth < 0) {
        currentYear--;
        currentMonth = 11;
      }
      displayCalendar();
    });
  
    nextMonthButton.addEventListener('click', () => {
      currentMonth++;
      if (currentMonth > 11) {
        currentYear++;
        currentMonth = 0;
      }
      displayCalendar();
    });
  
    displayCalendar();
});