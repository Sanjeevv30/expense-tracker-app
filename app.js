// Function to save expenses to local storage
function saveExpensesToLocalStorage(expenses) {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}

// Function to render expenses and total expenses
function renderExpenses(expenses) {
    const expenseList = document.getElementById('expense-list');
    expenseList.innerHTML = '';

    expenses.forEach((expense, index) => {
        const item = document.createElement('li');
        item.className = 'list-group-item d-flex justify-content-between align-items-center';
        item.innerHTML = `
            <span>${expense.description} - $${expense.amount} on ${expense.category}</span>
            <div>
                <button class="btn btn-sm btn-danger mr-2" onclick="deleteExpense(${index})">Delete</button>
                <button class="btn btn-sm btn-primary" onclick="editExpense(${index})">Edit</button>
            </div>
        `;
        expenseList.appendChild(item);
    });

    // Update total expenses display
    const totalExpenseDisplay = document.getElementById('total-expenses');
    totalExpenseDisplay.textContent = `$${calculateTotalExpenses(expenses)}`;
}

// Function to calculate the total expenses
function calculateTotalExpenses(expenses) {
    return expenses.reduce((total, expense) => total + parseFloat(expense.amount), 0).toFixed(2);
}

// Function to delete an expense
function deleteExpense(index) {
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    expenses.splice(index, 1);
    saveExpensesToLocalStorage(expenses);
    renderExpenses(expenses);
}

// Function to edit an expense
function editExpense(index) {
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const expense = expenses[index];

    // Store references to the input elements
    const expenseAmountInput = document.getElementById('expense-amount');
    const expenseDescriptionInput = document.getElementById('expense-description');
    const expenseCategoryInput = document.getElementById('expense-category');

    expenseAmountInput.value = expense.amount;
    expenseDescriptionInput.value = expense.description;
    expenseCategoryInput.value = expense.category;

    // Change the "Add Expense" button to act as "Save Edit" button temporarily
    const addExpenseBtn = document.getElementById('add-expense');
    addExpenseBtn.textContent = 'Save Edit';
    addExpenseBtn.dataset.index = index;
}

// Event listener for the "Add Expense" button
document.getElementById('add-expense').addEventListener('click', () => {
    const amount = parseFloat(document.getElementById('expense-amount').value);
    const description = document.getElementById('expense-description').value;
    const category = document.getElementById('expense-category').value;

    if (isNaN(amount) || amount <= 0 || description.trim() === '' || category.trim() === '') {
        alert('Please fill in all fields with valid values.');
        return;
    }

    const index = parseInt(document.getElementById('add-expense').dataset.index);

    if (isNaN(index)) {
        // If no "data-index" attribute, we're adding a new expense
        const newExpense = {
            amount,
            description,
            category,
        };

        let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        expenses.push(newExpense);
        saveExpensesToLocalStorage(expenses);
    } else {
        // If "data-index" attribute exists on the button, it means we're saving an edit
        updateExpense(index, amount, description, category);

        // Reset the "Add Expense" button to its original state after saving the edit
        const addExpenseBtn = document.getElementById('add-expense');
        addExpenseBtn.textContent = 'Add Expense';
        addExpenseBtn.dataset.index = '';
    }

    // Clear input fields after adding an expense
    document.getElementById('expense-amount').value = '';
    document.getElementById('expense-description').value = '';

    // Render expenses after adding/editing
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    renderExpenses(expenses);
});

// Function to update an expense by index
function updateExpense(index, amount, description, category) {
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    expenses[index] = {
        amount,
        description,
        category,
    };
    saveExpensesToLocalStorage(expenses);
}

// Initial render on page load
let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
renderExpenses(expenses);
