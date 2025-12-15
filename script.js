// Elemente DOM
const dialogElem = document.getElementById("dialog");
const showBtn = document.querySelector(".show");
const closeBtn = document.querySelector(".close");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskInput = document.getElementById("taskInput");

const list1 = document.getElementById("lis1"); // lista "De facut"
const lists = document.querySelectorAll(".list"); // totate listele

const dialogLabel = document.getElementById("dialogLabel")
//let editingCard = null;

let cardNumber = 4; // incepe de la 4 pentru task-urile noi

// functie pentru adaugarea butonului de stergere pe carduri
function addDeleteButton(card) {
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "×"; // | ceva simplu logo ..
    deleteBtn.classList.add("delete-btn"); // defineste stilul in CSS  
    deleteBtn.addEventListener("click", (e) => {

        e.stopPropagation(); 
        card.remove();       // sterge cardul
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
    const id = e.dataTransfer.getData("text/plain");
    const card = document.getElementById(id);
    this.appendChild(card);
    this.classList.remove("over");
}

// initializare evenimente drag & drop &delete &eddit pentru cardurile existente
document.querySelectorAll(".card").forEach(card => {
    //text existent pe carduri
    const text = card.textContent.trim();
    // sterg text/continut existent
    card.textContent = ""; 
    // adaug textul inapoi intr-un span pentru a putea edita ulterior
    const cardText = document.createElement("span");
    cardText.classList.add("card-text");
    cardText.textContent = text;

    card.appendChild(cardText);

    // butoane delete si edit
    addDeleteButton(card);  
    addEditButton(card);    

    card.addEventListener("dragstart", dragStart);
    card.addEventListener("dragend", dragEnd);
});

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

        list1.appendChild(newCard);

        addDeleteButton(newCard);
        addEditButton(newCard);

        newCard.addEventListener("dragstart", dragStart);
        newCard.addEventListener("dragend", dragEnd);
    }

    taskInput.value = "";
    dialogElem.close();
});

