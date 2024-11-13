import { backend } from "declarations/backend";

const shoppingList = document.getElementById("shopping-list");
const addItemForm = document.getElementById("add-item-form");
const newItemInput = document.getElementById("new-item");
const loadingSpinner = document.getElementById("loading");

// Show/hide loading spinner
const setLoading = (loading) => {
    loadingSpinner.classList.toggle("d-none", !loading);
};

// Render a single shopping item
const renderItem = (item) => {
    const li = document.createElement("li");
    li.className = `list-group-item d-flex justify-content-between align-items-center ${
        item.completed ? "bg-light" : ""
    }`;

    const textSpan = document.createElement("span");
    textSpan.className = item.completed ? "text-decoration-line-through" : "";
    textSpan.textContent = item.text;

    const buttonsDiv = document.createElement("div");
    
    // Toggle button
    const toggleBtn = document.createElement("button");
    toggleBtn.className = "btn btn-sm btn-outline-primary me-2";
    toggleBtn.innerHTML = `<i class="fas fa-${item.completed ? "undo" : "check"}"></i>`;
    toggleBtn.onclick = async () => {
        setLoading(true);
        await backend.toggleItem(item.id);
        await loadItems();
        setLoading(false);
    };

    // Delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "btn btn-sm btn-outline-danger";
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    deleteBtn.onclick = async () => {
        setLoading(true);
        await backend.deleteItem(item.id);
        await loadItems();
        setLoading(false);
    };

    buttonsDiv.appendChild(toggleBtn);
    buttonsDiv.appendChild(deleteBtn);
    li.appendChild(textSpan);
    li.appendChild(buttonsDiv);

    return li;
};

// Load and render all items
const loadItems = async () => {
    const items = await backend.getItems();
    shoppingList.innerHTML = "";
    items.forEach(item => {
        shoppingList.appendChild(renderItem(item));
    });
};

// Handle form submission
addItemForm.onsubmit = async (e) => {
    e.preventDefault();
    const text = newItemInput.value.trim();
    if (text) {
        setLoading(true);
        await backend.addItem(text);
        newItemInput.value = "";
        await loadItems();
        setLoading(false);
    }
};

// Initial load
window.addEventListener("load", async () => {
    setLoading(true);
    await loadItems();
    setLoading(false);
});
