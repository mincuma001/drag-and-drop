// Elemente DOM
const dialogElem = document.getElementById("dialog");
const showBtn = document.querySelector(".show");
const closeBtn = document.querySelector(".close");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskInput = document.getElementById("taskInput");

const list1 = document.getElementById("lis1"); // lista "De facut"
const lists = document.querySelectorAll(".list"); // totate listele

const dialogLabel = document.getElementById("dialogLabel")
let editingCard = null;
let cardNumber = 4; // incepe de la 4 pentru task-urile noi


// functie pentru adaugarea butonului de stergere pe carduri
function addDeleteButton(card) {
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "×"; // | ceva simplu logo ..
    deleteBtn.classList.add("delete-btn"); // defineste stilul in CSS  
    deleteBtn.addEventListener("click", (e) => {

        e.stopPropagation(); 
        card.remove();       // sterge cardul
        saveToLocalStorage();
    });

    card.appendChild(deleteBtn);
}

// functie pentru adaugarea butonului de edit pe carduri
function addEditButton(card) {
    const editBtn = document.createElement("button");
    editBtn.textContent = "✎";
    editBtn.classList.add("edit-btn");

    editBtn.addEventListener("click", (e) => {
        e.stopPropagation(); 
        editingCard = card; // salvare card editat
        const cardText = card.querySelector(".card-text");
        taskInput.value = cardText.textContent; // iau text in input
        dialogLabel.textContent = "Editare task";
        dialogElem.showModal(); // deschidem dialog
    });

    card.appendChild(editBtn);
}

// functii Drag & Drop
function dragStart(e) {
    e.dataTransfer.effectAllowed = "move"; 
    e.dataTransfer.setData("text/plain", this.id);
}

function dragEnd() {}
function dragOver(e) {
    e.preventDefault();
}
function dragEnter(e) {
    e.preventDefault();
    this.classList.add("over");
}
function dragLeave(e) {
    this.classList.remove("over");
}
function dragDrop(e) {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    const card = document.getElementById(id);

    const cardsContainer = this.querySelector(".cards"); // containerul cardurilor
    cardsContainer.appendChild(card); 

    this.classList.remove("over");
    saveToLocalStorage();
}

// initializare evenimente pentru liste
lists.forEach(list => {
    list.addEventListener("dragover", dragOver);
    list.addEventListener("dragenter", dragEnter);
    list.addEventListener("dragleave", dragLeave);
    list.addEventListener("drop", dragDrop);
});

// deschidere dialog
showBtn.addEventListener("click", () => {
    editingCard = null;                 // reset modul edit
    taskInput.value = "";               // golim input-ul
    dialogLabel.textContent = "Adaugare task"; // titlu dialog
    dialogElem.showModal();
});


// inchidere dialog
closeBtn.addEventListener("click", () => {
    dialogElem.close();
    editingCard = null; // resetare modul editare
    taskInput.value = "";
});

// adauga task nou
addTaskBtn.addEventListener("click", () => {
    const text = taskInput.value.trim();
    if (!text) return;

    if (editingCard) {
        // actualizez card existent
        const cardText = editingCard.querySelector(".card-text");
        cardText.textContent = text;
        editingCard = null; // resetare modul editare
    } else {
        // creare card nou 
        const newCard = document.createElement("div");
        newCard.classList.add("card");
        newCard.setAttribute("draggable", "true");

        const cardText = document.createElement("span");
        cardText.classList.add("card-text");
        cardText.textContent = text;
        newCard.appendChild(cardText);

        newCard.id = "card" + cardNumber;
        cardNumber++;

        list1.querySelector(".cards").appendChild(newCard);

        addDeleteButton(newCard);
        addEditButton(newCard);

        newCard.addEventListener("dragstart", dragStart);
        newCard.addEventListener("dragend", dragEnd);
        newCard.addEventListener("dragover", e => e.preventDefault());
        
    }

    taskInput.value = "";
    dialogElem.close();
    saveToLocalStorage();
});

function saveToLocalStorage(){
    const cards = document.querySelectorAll(".card");
    const data = [];

    cards.forEach(card => {
        data.push({
            id: card.id,
            text: card.querySelector(".card-text").textContent,
            listId: card.closest(".list").id
        });
    });

    localStorage.setItem("tasks", JSON.stringify(data));
}


function loadFromLocalStorage() {
    const data = JSON.parse(localStorage.getItem("tasks"));
    if (!data) return;

    data.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.id = item.id;
        card.setAttribute("draggable", "true");

        const cardText = document.createElement("span");
        cardText.classList.add("card-text");
        cardText.textContent = item.text;

        card.appendChild(cardText);

        addDeleteButton(card);
        addEditButton(card);

        card.addEventListener("dragstart", dragStart);
        card.addEventListener("dragend", dragEnd);
        card.addEventListener("dragover", e => e.preventDefault());

        document
        .getElementById(item.listId)
        .querySelector(".cards")
        .appendChild(card);
    });
}

loadFromLocalStorage();