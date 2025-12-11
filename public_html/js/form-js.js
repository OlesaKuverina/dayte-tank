function validateEmail(email) {
    const emailRegex = /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/;
    return emailRegex.test(email);
}

function validateDate(date) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDate = new Date(date);
    return selectedDate >= today;
}

function validateForm() {
    let isValid = true;
    const name = document.getElementById("contactName").value.trim();
    const email = document.getElementById("contactEmail").value.trim();
    const date = document.getElementById("date").value;
    const concert = document.getElementById("concert").value;
    const selectedSeatsCount = document.querySelectorAll('.row .seat.selected').length;

    if (!name) {
        document.getElementById("nameError").textContent = "Пожалуйста, введите ваше имя.";
        isValid = false;
    } else {
        document.getElementById("nameError").textContent = "";
    }

    if (!validateEmail(email)) {
        document.getElementById("emailError").textContent = "Пожалуйста, введите корректный email.";
        isValid = false;
    } else {
        document.getElementById("emailError").textContent = "";
    }

    if (!validateDate(date)) {
        document.getElementById("dateError").textContent = "Пожалуйста, выберите корректную дату (не ранее сегодняшнего дня).";
        isValid = false;
    } else {
        document.getElementById("dateError").textContent = "";
    }

    if (!concert) {
        document.getElementById("concertError").textContent = "Пожалуйста, выберите концерт.";
        isValid = false;
    } else {
        document.getElementById("concertError").textContent = "";
    }

    if (selectedSeatsCount === 0) {
        alert("Пожалуйста, выберите хотя бы одно место");
        isValid = false;
    }

    return isValid;
}

function registerForConcert() {
    const name = document.getElementById("contactName").value.trim();
    const email = document.getElementById("contactEmail").value.trim();
    const date = document.getElementById("date").value;
    const concert = document.getElementById("concert");
    const concertText = concert.options[concert.selectedIndex].text;
    const selectedSeatsCount = document.querySelectorAll('.row .seat.selected').length;
    const totalPrice = selectedSeatsCount * ticketPrice;

    const registrationInfo = 
        `<h3>Регистрация на концерт прошла успешно!</h3>
         <p><strong>Имя:</strong> ${name}</p>
         <p><strong>Email:</strong> ${email}</p>
         <p><strong>Дата концерта:</strong> ${new Date(date).toLocaleDateString()}</p>
         <p><strong>Концерт:</strong> ${concertText}</p>
         <p><strong>Количество билетов:</strong> ${selectedSeatsCount}</p>
         <p><strong>Общая стоимость:</strong> $${totalPrice}</p>
         <p><strong>Ваши места:</strong> ${getSelectedSeatsInfo()}</p>
         <p>Билеты будут отправлены на ваш email. Ждём вас на концерте!</p>`;

    document.getElementById("result").innerHTML = registrationInfo;
}

function getSelectedSeatsInfo() {
    const selectedSeats = document.querySelectorAll('.row .seat.selected');
    const seatsInfo = [];
    
    selectedSeats.forEach(seat => {
        const row = seat.closest('.row');
        const rowIndex = Array.from(row.parentNode.children).indexOf(row) + 1;
        const seatIndex = Array.from(row.children).indexOf(seat) + 1;
        seatsInfo.push(`Ряд ${rowIndex}, Место ${seatIndex}`);
    });
    
    return seatsInfo.join(', ');
}

function RegisterButtonClick() {
    if (validateForm()) {
        registerForConcert();
    }
}

// JavaScript to handle seat selection and price calculation
const container = document.querySelector('.container');
const seats = document.querySelectorAll('.row .seat:not(.occupied)');
const count = document.getElementById('count');
const total = document.getElementById('total');
const concertSelect = document.getElementById('concert');

let ticketPrice = +concertSelect.value;

// Update total and count
function updateSelectedCount() {
    const selectedSeats = document.querySelectorAll('.row .seat.selected');
    
    const selectedSeatsCount = selectedSeats.length;
    
    count.innerText = selectedSeatsCount;
    total.innerText = selectedSeatsCount * ticketPrice;
}

// Concert select event
concertSelect.addEventListener('change', e => {
    ticketPrice = +e.target.value;
    updateSelectedCount();
});

// Seat click event
container.addEventListener('click', e => {
    if (e.target.classList.contains('seat') && !e.target.classList.contains('occupied')) {
        e.target.classList.toggle('selected');
        
        updateSelectedCount();
    }
});

// Добавляем обработчик событий после загрузки страницы
document.addEventListener('DOMContentLoaded', function () {
    const registerButton = document.getElementById('registerButton');
    registerButton.addEventListener('click', RegisterButtonClick);
    
    // Инициализируем начальное состояние
    updateSelectedCount();
});