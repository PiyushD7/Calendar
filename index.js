const daysTag = document.querySelector(".days"),
    currentDate = document.querySelector(".current-date"),
    prevNextIcon = document.querySelectorAll(".icons span");
const noteInput = document.getElementById("noteInput");
const successMessageContainer = document.getElementById("successMessageContainer");
const successMessage = document.getElementById("successMessage");

let date = new Date(),
    currYear = date.getFullYear(),
    currMonth = date.getMonth();
let notes = {};

const months = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"
];

function getStorageKey() {
    return `notes_${currYear}_${currMonth}`;
}

function renderNotes() {
    const key = getStorageKey();
    const storedNotes = localStorage.getItem(key);
    notes = storedNotes ? JSON.parse(storedNotes) : {};

    // Display the notes under the dates
    const days = daysTag.querySelectorAll(".days li");
    days.forEach(day => {
        // Check if the day has the "active" class
        if (day.classList.contains("active")) {
            const dayNumber = day.textContent;
            const noteContainer = day.querySelector(".notes");

            console.log("dayNumber:", dayNumber);
            console.log("noteContainer:", noteContainer);

            if (notes[key] && notes[key][dayNumber]) {
                const notesArray = notes[key][dayNumber];
                if (Array.isArray(notesArray)) {
                    noteContainer.innerHTML = notesArray.map(note => `<div class="note">${note}</div>`).join('');
                } else {
                    noteContainer.innerHTML = `<div class="note">${notesArray}</div>`;
                }
            } else {
                noteContainer.innerHTML = '';
            }
            
        }
    });
}

function selectDate(selectedDate) {
    console.log("Date selected:", selectedDate.textContent);
    const allDays = daysTag.querySelectorAll("li");
    allDays.forEach(day => {
        day.classList.remove("active");
    });

    selectedDate.classList.add("active");

    renderNotesDisplay(selectedDate.textContent); // Call renderNotesDisplay with the selected date

    const key = getStorageKey();
    const note = notes[key] ? notes[key][selectedDate.textContent] : '';

    if (note) {
        alert(`Note for ${months[currMonth]} ${currYear}, ${selectedDate.textContent}: ${note}`);
    }
}

function renderNotesDisplay() {
    const notesDisplayContainer = document.getElementById("notesDisplayContainer");
    notesDisplayContainer.innerHTML = ''; // Clear previous content

    const key = getStorageKey();
    const storedNotes = localStorage.getItem(key);
    const allNotes = storedNotes ? JSON.parse(storedNotes) : {};

    Object.keys(allNotes).forEach(day => {
        const notesArray = allNotes[day];

        const dayNotesContainer = document.createElement("div");
        dayNotesContainer.classList.add("day-notes");

        const dateLabel = document.createElement("div");
        dateLabel.classList.add("date-label");
        dateLabel.textContent = `${months[currMonth]} ${currYear}, ${day}:`;
        dayNotesContainer.appendChild(dateLabel);

        const noteContainer = document.createElement("div");
        noteContainer.classList.add("note-container");

        notesArray.forEach(note => {
            const noteElement = document.createElement("div");
            noteElement.classList.add("note");
            noteElement.textContent = note;
            noteContainer.appendChild(noteElement);
        });

        dayNotesContainer.appendChild(noteContainer);
        notesDisplayContainer.appendChild(dayNotesContainer);
    });

    // Highlight the active date
    const allDays = document.querySelectorAll(".days li");
    allDays.forEach(day => {
        day.classList.remove("active");
    });

    const activeDay = document.querySelector(`.days li.active`);
    if (activeDay) {
        activeDay.classList.add("active");
    }
}



function addNote() {
    console.log("Adding note...");
    const dayElement = daysTag.querySelector(".active");
    if (!dayElement) {
        alert("Please select a date to add a note.");
        return;
    }

    const day = dayElement.textContent;
    const key = getStorageKey();
    const note = noteInput.value.trim();

    if (note !== "") {
        if (!notes[key]) {
            notes[key] = {};
        }

        notes[key][day] = note;

        localStorage.setItem(key, JSON.stringify(notes));

        // Clear the input field
        noteInput.value = '';
         // Render the updated notes
        renderNotes();
        renderNotesDisplay();

        // Show success message
        const successMessageContainer = document.getElementById("successMessageContainer");
        const successMessageElement = document.createElement("div");
        successMessageElement.classList.add("success-message");
        successMessageElement.innerText = "Note added successfully!";
        console.log("Before appending success message");
        successMessageContainer.appendChild(successMessageElement);
        console.log("After appending success message");

        setTimeout(() => {
            try {
                successMessageElement.remove();
            } catch (error) {
                console.error("Error removing success message:", error);
            }
        }, 3000); // Remove the message after 3 seconds
        
    }
    renderNotesDisplay();
}

const renderCalendar = () => {
    console.log("Rendering calendar...");
    let date = new Date();
    let firstDayofMonth = new Date(currYear, currMonth, 1).getDay(),
        lastDateofMonth = new Date(currYear, currMonth + 1, 0).getDate(),
        lastDayofMonth = new Date(currYear, currMonth, lastDateofMonth).getDay(),
        lastDateofLastMonth = new Date(currYear, currMonth, 0).getDate();
    let liTag = "";

    for (let i = firstDayofMonth; i > 0; i--) {
        liTag += `<li class="inactive">${lastDateofLastMonth - i + 1}</li>`;
    }

    for (let i = 1; i <= lastDateofMonth; i++) {
        let isToday = i === date.getDate() && currMonth === new Date().getMonth() &&
            currYear === new Date().getFullYear() ? "active" : "";

        liTag += `<li class="${isToday}" onclick="selectDate(this)">
            ${i}<div class="notes"></div></li>`;
    }

    for (let i = lastDayofMonth; i < 6; i++) {
        liTag += `<li class="inactive">${i - lastDayofMonth + 1}</li>`;
    }
    currentDate.innerText = `${months[currMonth]} ${currYear}`;
    daysTag.innerHTML = liTag;
    renderNotesDisplay();
}

prevNextIcon.forEach(icon => {
    icon.addEventListener("click", () => {
        currMonth = icon.id === "prev" ? currMonth - 1 : currMonth + 1;

        if (currMonth < 0 || currMonth > 11) {
            date = new Date(currYear, currMonth, new Date().getDate());
            currYear = date.getFullYear();
            currMonth = date.getMonth();
        } else {
            date = new Date();
        }
        renderCalendar();
    });
});

renderCalendar();