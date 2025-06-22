let count = 0;
const countDisplay = document.getElementById('count');
const countBtn = document.getElementById('count-btn');
const resetBtn = document.getElementById('reset-btn');
const lightThemeBtn = document.getElementById('light-theme');
const darkThemeBtn = document.getElementById('dark-theme');

// Add vibration feedback if available
const vibrate = () => {
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
};

// Update display with animation
const updateDisplay = () => {
    // Remove highlight from previous
    countDisplay.classList.remove('count-highlight');
    // Animate only the number if 33/99/132/...
    if (count % 33 === 0 && count !== 0) {
        countDisplay.classList.add('count-highlight');
    }
    countDisplay.textContent = count;
    
    // Trigger count animation
    countBtn.style.animation = 'none';
    countBtn.offsetHeight; // Trigger reflow
    countBtn.style.animation = 'count-tap 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
};

// Count function with minimal debounce to prevent accidental double taps
let lastCountTime = 0;
const countDebounceDelay = 50; // Reduced to 50ms for better responsiveness

const incrementCount = () => {
    const now = Date.now();
    if (now - lastCountTime < countDebounceDelay) {
        return; // Ignore only very rapid successive calls
    }
    lastCountTime = now;
    
    count++;
    vibrate();
    updateDisplay();
};

// Enhanced mobile-friendly counting
let isCountingInProgress = false;

const handleCount = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isCountingInProgress) return;
    
    isCountingInProgress = true;
    incrementCount();
    
    // Reset flag after a short delay
    setTimeout(() => {
        isCountingInProgress = false;
    }, 100);
};

// Count button - multiple event listeners for maximum compatibility
countBtn.addEventListener('click', handleCount);
countBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    handleCount(e);
});

// Remove the separate touchend listener that was preventing counting

// Reset button click handler - use click instead of pointerdown
resetBtn.addEventListener('click', (e) => {
    e.preventDefault();
    count = 0;
    vibrate();
    updateDisplay();
});

// Add keyboard support with improved counting
document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        handleCount(e);
    } else if (e.code === 'KeyR') {
        e.preventDefault();
        count = 0;
        vibrate();
        updateDisplay();
    }
});

// Modal functionality
const infoBtn = document.getElementById('info-btn');
const infoModal = document.getElementById('info-modal');
const modalClose = document.getElementById('modal-close');

const openModal = () => {
    infoModal.classList.add('show');
    infoModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
};

const closeModal = () => {
    infoModal.classList.remove('show');
    infoModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = ''; // Restore scrolling
};

// Event listeners for modal
infoBtn.addEventListener('click', openModal);
modalClose.addEventListener('click', closeModal);

// Close modal when clicking outside
infoModal.addEventListener('click', (e) => {
    if (e.target === infoModal) {
        closeModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && infoModal.classList.contains('show')) {
        closeModal();
    }
});

function setTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('dark');
        localStorage.setItem('tasbih-theme', 'dark');
        darkThemeBtn.classList.add('active');
        lightThemeBtn.classList.remove('active');
    } else {
        document.body.classList.remove('dark');
        localStorage.setItem('tasbih-theme', 'light');
        lightThemeBtn.classList.add('active');
        darkThemeBtn.classList.remove('active');
    }
}

lightThemeBtn.addEventListener('click', () => setTheme('light'));
darkThemeBtn.addEventListener('click', () => setTheme('dark'));

// On load, set theme from localStorage
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('tasbih-theme') || 'light';
    setTheme(savedTheme);
});
