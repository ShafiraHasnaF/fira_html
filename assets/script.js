const book = document.getElementById('book');
const bookContainer = document.getElementById('bookContainer');
const bookShadow = document.getElementById('bookShadow');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
// const pageCounter = document.getElementById('pageCounter');
// const navStatus = document.getElementById('navStatus');

let currentPage = 0;
const totalPages = 6;

function updateBook() {
    book.className = 'book';

    if (currentPage === 0) book.classList.add('page0-open');
    else if (currentPage === 1) book.classList.add('page1-open');
    else if (currentPage === 2) book.classList.add('page2-open');
    else if (currentPage === 3) book.classList.add('page3-open');
    else if (currentPage === 4) book.classList.add('page4-open');
    else if (currentPage === 5) book.classList.add('page5-open');
    else if (currentPage === 6) book.classList.add('page6-open');

    // const pageNames = ['Cover', 'About Me', 'Skills', 'Portfolio', 'Experience', 'Contact & Fun Facts', 'The End'];
    // pageCounter.textContent = pageNames[currentPage];
    // updateNavStatus();
    updateShadow();
    prevBtn.disabled = currentPage === 0;
    nextBtn.disabled = currentPage === totalPages - 1;
}

// function updateNavStatus() {
//     if (currentPage === 0) {
//         navStatus.textContent = "swipe right / next";
//     } else if (currentPage === totalPages - 1) {
//         navStatus.textContent = "end, swipe left or previous";
//     } else {
//         navStatus.textContent = "swipe or use the buttons to navigate";
//     }
// }
function updateShadow() {
    const shadowIntensity = 0.2 - (currentPage * 0.02);
    const shadowBlur = 10 + (currentPage * 2);
    bookShadow.style.background = `rgba(0, 0, 0, ${shadowIntensity})`;
    bookShadow.style.filter = `blur(${shadowBlur}px)`;
}
function nextPage() {
    if (currentPage < totalPages - 1) {
        currentPage++;
        updateBook();
    }
}
function prevPage() {
    if (currentPage > 0) {
        currentPage--;
        updateBook();
    }
}

prevBtn.addEventListener('click', prevPage);
nextBtn.addEventListener('click', nextPage);
let startX = 0;
let endX = 0;
let isSwiping = false;

bookContainer.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    isSwiping = true;
});

bookContainer.addEventListener('touchmove', (e) => {
    if (!isSwiping) return;
    e.preventDefault();
});

bookContainer.addEventListener('touchend', (e) => {
    if (!isSwiping) return;
    endX = e.changedTouches[0].clientX;
    handleSwipe();
    isSwiping = false;
});

bookContainer.addEventListener('mousedown', (e) => {
    startX = e.clientX;
    isSwiping = true;
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
});

function onMouseMove(e) {
    if (!isSwiping) return;
    e.preventDefault();
}

function onMouseUp(e) {
    if (!isSwiping) return;
    endX = e.clientX;
    handleSwipe();
    isSwiping = false;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
}

function handleSwipe() {
    const diff = startX - endX;
    const minSwipeDistance = 50;
    if (currentPage === 0 && diff < 0) return;
    if (currentPage === totalPages - 1 && diff > 0) return;

    if (Math.abs(diff) > minSwipeDistance) {
        if (diff > 0) {
            nextPage();
        } else {
            prevPage();
        }
    }
}
const pages = document.querySelectorAll('.page');
pages.forEach((page, index) => {
    page.addEventListener('click', (e) => {
        if (e.target.tagName === 'BUTTON') return;
        if (currentPage === 0) {
            nextPage();
            return;
        }
        if (currentPage === totalPages - 1) {
            prevPage();
            return;
        }
        if (index <= currentPage && index < totalPages - 1) {
            nextPage();
        }
    });
});

updateBook();