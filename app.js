
function saveExpensesToLocalStorage(expenses) {
    localStorage.setItem('expenses', JSON.stringify(expenses));
}
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
    const totalExpenseDisplay = document.getElementById('total-expenses');
    totalExpenseDisplay.textContent = `$${calculateTotalExpenses(expenses)}`;
}
function calculateTotalExpenses(expenses) {
    return expenses.reduce((total, expense) => total + parseFloat(expense.amount), 0).toFixed(2);
}
function deleteExpense(index) {
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    expenses.splice(index, 1);
    saveExpensesToLocalStorage(expenses);
    renderExpenses(expenses);
}
function editExpense(index) {
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    const expense = expenses[index];
    const expenseAmountInput = document.getElementById('expense-amount');
    const expenseDescriptionInput = document.getElementById('expense-description');
    const expenseCategoryInput = document.getElementById('expense-category');

    expenseAmountInput.value = expense.amount;
    expenseDescriptionInput.value = expense.description;
    expenseCategoryInput.value = expense.category;
    const addExpenseBtn = document.getElementById('add-expense');
    addExpenseBtn.textContent = 'Save Edit';
    addExpenseBtn.dataset.index = index;
}

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
        const newExpense = {
            amount,
            description,
            category,
        };

        let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        expenses.push(newExpense);
        saveExpensesToLocalStorage(expenses);
    } else {
        updateExpense(index, amount, description, category);
        const addExpenseBtn = document.getElementById('add-expense');
        addExpenseBtn.textContent = 'Add Expense';
        addExpenseBtn.dataset.index = '';
    }
    document.getElementById('expense-amount').value = '';
    document.getElementById('expense-description').value = '';

    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    renderExpenses(expenses);
});

function updateExpense(index, amount, description, category) {
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
    expenses[index] = {
        amount,
        description,
        category,
    };
    saveExpensesToLocalStorage(expenses);
}

let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
renderExpenses(expenses);
