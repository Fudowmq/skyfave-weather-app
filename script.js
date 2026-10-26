const favoritesList = document.querySelector('.favorites__list');
const favoritesHeaderDesc = document.querySelector('.favorites-header_desc');
const addCityButtons = document.querySelectorAll('.add-city-trigger')
const noteModal = document.getElementById('noteModal');
const noteModalClose = document.getElementById('noteModalClose');
const noteModalCancel = document.getElementById('noteModalCancel');
const noteModalSave = document.getElementById('noteModalSave');
const noteTextArea = document.getElementById('noteTextArea');
const noteCounter = document.getElementById('noteCounter');
const noteCityName = document.getElementById('noteCityName');
const addCityModal = document.getElementById('addCityModal');
const addCityModalClose = document.getElementById('addCityModalClose');
const addCityModalCancel = document.getElementById('addCityModalCancel');
const addCityModalSave = document.getElementById('addCityModalSave');
const addCityInput = document.getElementById('addCityInput');
const addCityError = document.getElementById('addCityError');

favoritesList.addEventListener('click', (event) => {
    const deleteBtn = event.target.closest('.favorites-delete');
    if (deleteBtn) {
        const card = deleteBtn.closest('.favorites__item');
        card.remove();
        updateFavoritesCount();
        return;
    }

    const noteBtn = event.target.closest('.favorites-note');
    if (noteBtn) {
        const card = noteBtn.closest('.favorites__item');
        openNoteModal(card);
    }
});

function getCityWord(count) {
    const lastTwo = count % 100;
    const last = count % 10;
    if (lastTwo >= 11 && lastTwo <= 14) return 'городов';
    if (last === 1) return 'город';
    if (last >= 2 && last <= 4) return 'города';
    return 'городов';
}

function updateFavoritesCount() {
    const count = favoritesList.querySelectorAll('.favorites__item').length;
    favoritesHeaderDesc.textContent = `${count} ${getCityWord(count)}`;
}

updateFavoritesCount();

let currentCard = null;

function openNoteModal(card) {
    currentCard = card;
    const cityName = card.querySelector('.favorites-city').firstChild.textContent.trim();
    noteCityName.textContent = cityName;

    const descEl = card.querySelector('.favorites-title__desc')
    const existingNote = descEl ? descEl.textContent.replace(/^"|"$/g, '') : '';

    noteTextArea.value = existingNote
    noteCounter.textContent = existingNote.length

    noteModal.classList.add('active');
}

function closeNoteModal() {
    noteModal.classList.remove('active');
    currentCard = null;
}

noteModalClose.addEventListener('click', closeNoteModal);
noteModalCancel.addEventListener('click', closeNoteModal);
noteModal.querySelector('.modal__backdrop').addEventListener('click', closeNoteModal);

noteTextArea.addEventListener('input', () => {
    noteCounter.textContent = noteTextArea.value.length;
});

noteModalSave.addEventListener('click', () => {
    if (!currentCard) return;
    
    const titleEl = currentCard.querySelector('.favorites-title')
    if (!titleEl) return;
    
    const value = noteTextArea.value.trim()
    let descEl = currentCard.querySelector('.favorites-title__desc');

    if (value === '') {
        if (descEl) descEl.remove()
    } else {
        if (!descEl) {
            descEl = document.createElement('p')
            descEl.className = 'favorites-title__desc'
            titleEl.appendChild(descEl)
        }
        descEl.textContent = `"${value}"`
    }

    closeNoteModal();
});

function openModal(modal) {
    modal.classList.add('active')
}

function closeModal(modal) {
    modal.classList.remove('active')
}

addCityButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
        addCityInput.value = '';
        addCityInput.classList.remove('error');
        addCityError.classList.remove('visible');
        openModal(addCityModal);
        addCityInput.focus();
    });
});

addCityModalClose.addEventListener('click', () => closeModal(addCityModal))
addCityModalCancel.addEventListener('click', () => closeModal(addCityModal))
addCityModal.querySelector('.modal__backdrop').addEventListener('click', () => closeModal(addCityModal))

addCityInput.addEventListener('input', () => {
    addCityInput.classList.remove('error')
    addCityError.classList.remove('visible')
})

addCityModalSave.addEventListener('click', () => {
    const value = addCityInput.value.trim()

    if (!value) {
        addCityInput.classList.add('error')
        addCityError.classList.add('visible')
        return
    }

    console.log('Добавляем город:', value)

    addCityInput.value = ''
    addCityInput.classList.remove('error')
    addCityError.classList.remove('visible')
    closeModal(addCityModal)
})



const weatherSection = document.querySelector('.weather-search')
const weatherInput = document.getElementById('weatherInput')
const weatherSearchBtn = document.getElementById('weatherSearchBtn')
const weatherResult = document.getElementById('weatherResult')
const emptyHTMl = weatherResult.innerHTML


async function getWeather(city) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&lang=ru&appid=${API_KEY}`;
    const res = await fetch(url)

    if (res.status === 404) throw new Error ('NOT_FOUND')
    if (res.status === 401) throw new Error ('BAD_KEY')
    if (!res.ok) throw new Error ('SERVER')

    return res.json()
} 

function showLoading() {
    weatherResult.innerHTML = '<div class="weather-skeleton"></div>'
}

function showError(message) {
    weatherSection.classList.remove('has-result')
    weatherResult.innerHTML = `
        <div class="weather-search__empty">
            <div class="weather-search__empty-text">${message}</div>
        </div>
    `
}

function formatTime(unixSecond, tzOffset) {
    const d = new Date((unixSecond + tzOffset) * 1000)
    const h = String(d.getUTCHours()).padStart(2, '0')
    const m = String(d.getUTCMinutes()).padStart(2, '0')
    return `${h}:${m}`
}

function formatDate(unixSecond, tzOffset) {
    return new Date((unixSecond + tzOffset) * 1000).toLocaleDateString('ru-RU', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        timeZone: 'UTC'
    })
}

function renderWeather(data) {
    const info = data.weather[0]
    const tz = data.timezone
    const description = info.description.charAt(0).toUpperCase() + info.description.slice(1)
    const windKmh = Math.round(data.wind.speed * 3.6)

    weatherSection.classList.add('has-result')

    weatherResult.innerHTML = `
        <div class="weather-card">
            <div class="weather-card__top">
                <div>
                    <div class="weather-card__city">📍 ${data.name}, ${data.sys.country}</div>
                    <div class="weather-card__date">${formatDate(data.dt, tz)}</div>
                </div>
                <img class="weather-card__icon"
                    src="https://openweathermap.org/img/wn/${info.icon}@2x.png"
                    alt="${info.description}">
            </div>

            <div class="weather-card__temp" data-temp="${data.main.temp}">
                <span class="weather-card__value">${Math.round(data.main.temp)}</span><span class="weather-card__unit">°C</span>
            </div>

            <div class="weather-card__desc">${description}</div>
            <div class="weather-card__feels">
                В ${Math.round(data.main.temp_max)}°C / Н ${Math.round(data.main.temp_min)}°C
            </div>

            <div class="weather-card__details">
                <div class="weather-card__detail">
                    <span>Ощущается как</span>
                    <b>${Math.round(data.main.feels_like)}°C</b>
                </div>
                <div class="weather-card__detail">
                    <span>Влажность</span>
                    <b>${data.main.humidity}%</b>
                </div>
                <div class="weather-card__detail">
                    <span>Ветер</span>
                    <b>${windKmh} км/ч</b>
                </div>
            </div>

            <div class="weather-card__sun">
                <span>🌅 Восход ${formatTime(data.sys.sunrise, tz)}</span>
                <span>🌇 Закат ${formatTime(data.sys.sunset, tz)}</span>
            </div>
        </div>`
}

async function searchWeather(city) {
    city = city.trim()
    if (!city) return

    showLoading()

    try {
        const data = await getWeather(city)
        renderWeather(data)
    } catch(err) {
        if (err.message === 'NOT_FOUND') {
            showError('Город не найден. Проверьте название и попробуйте снова.')
        } else if (err.message === 'BAD_KEY') {
            showError('Ключ API еще не активирован или указан не верно.')
        } else {
            showError('Не удалось получить данные. Проверьте интернет и попробуйте позже.')
        }
    }
}

weatherSearchBtn.addEventListener('click', () => searchWeather(weatherInput.value))

weatherInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') searchWeather(weatherInput.value)
})

document.querySelectorAll('.weather-button').forEach((btn) => {
    btn.addEventListener('click', () => {
        weatherInput.value = btn.textContent
        searchWeather(btn.textContent)
    })
})