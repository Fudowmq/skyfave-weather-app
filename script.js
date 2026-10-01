const favoritesList = document.querySelector('.favorites__list');
const favoritesHeaderDesc = document.querySelector('.favorites-header_desc');
const noteModal = document.getElementById('noteModal');
const noteModalClose = document.getElementById('noteModalClose');
const noteModalCancel = document.getElementById('noteModalCancel');
const noteModalSave = document.getElementById('noteModalSave');
const noteTextArea = document.getElementById('noteTextarea');
const noteCounter = document.getElementById('noteCounter');
const noteCityName = document.getElementById('noteCityName');

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
    const descEl = currentCard.querySelector('.favorites-title__desc');
    if (descEl) {
        descEl.textContent = `"${noteTextArea.value}"`;
    }
    closeNoteModal();
});