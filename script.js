let count = 0;
const countDisplay = document.getElementById('count');
const countBtn = document.getElementById('count-btn');
const resetBtn = document.getElementById('reset-btn');
const themeToggle = document.getElementById('theme-toggle');

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

// Decrement function for -1 button
const decrementCount = () => {
    const now = Date.now();
    if (now - lastCountTime < countDebounceDelay) {
        return;
    }
    lastCountTime = now;
    
    if (count > 0) {
        count--;
        vibrate();
        updateDisplay();
        
        // Add premium visual feedback
        const decrementBtn = document.getElementById('decrement-btn');
        decrementBtn.style.transform = 'translateY(-1px) scale(0.95)';
        setTimeout(() => {
            decrementBtn.style.transform = '';
        }, 150);
    }
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

// Decrement button event listener
const decrementBtn = document.getElementById('decrement-btn');
decrementBtn.addEventListener('click', (e) => {
    e.preventDefault();
    decrementCount();
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
    } else if (e.code === 'Minus' || e.code === 'NumpadSubtract') {
        e.preventDefault();
        decrementCount();
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
        themeToggle.checked = true;
        document.querySelector('meta[name="theme-color"]')?.setAttribute("content", "#16213e");
    } else {
        document.body.classList.remove('dark');
        localStorage.setItem('tasbih-theme', 'light');
        themeToggle.checked = false;
        document.querySelector('meta[name="theme-color"]')?.setAttribute("content", "#667eea");
    }
}

themeToggle.addEventListener('change', () => {
    const theme = themeToggle.checked ? 'dark' : 'light';
    setTheme(theme);
    vibrate();
});

// On load, set theme from localStorage
window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('tasbih-theme') || 'light';
    setTheme(savedTheme);
    
    // Restore megazoom state
    const savedMegazoom = localStorage.getItem('tasbih-megazoom') === 'true';
    if (savedMegazoom) {
        toggleMegazoom();
    }
});

// Megazoom functionality
const megazoomBtn = document.getElementById('megazoom-btn');
let megazoomActive = false;

const toggleMegazoom = () => {
    megazoomActive = !megazoomActive;
    const container = document.querySelector('.nextjs-style');
    
    if (megazoomActive) {
        container.classList.add('megazoom');
        megazoomBtn.textContent = 'Normal';
        localStorage.setItem('tasbih-megazoom', 'true');
    } else {
        container.classList.remove('megazoom');
        megazoomBtn.textContent = 'DramaZoom';
        localStorage.setItem('tasbih-megazoom', 'false');
    }
    vibrate();
};

megazoomBtn.addEventListener('click', toggleMegazoom);

// On load, set megazoom state from localStorage
window.addEventListener('DOMContentLoaded', () => {
    const savedMegazoom = localStorage.getItem('tasbih-megazoom') === 'true';
    megazoomActive = savedMegazoom;
    const container = document.querySelector('.nextjs-style');
    if (megazoomActive) {
        container.classList.add('megazoom');
        megazoomBtn.textContent = 'Normal';
    } else {
        container.classList.remove('megazoom');
        megazoomBtn.textContent = 'DramaZoom';
    }
});

    /*
// Flash Therapy functionality
const initFlashTherapy = () => {
    // Create flash element if it doesn't exist
    let flashElement = document.querySelector('.flash');
    if (!flashElement) {
        flashElement = document.createElement('div');
        flashElement.className = 'flash';
        flashElement.style.position = 'fixed';
        flashElement.style.top = '0';
        flashElement.style.left = '0';
        flashElement.style.right = '0';
        flashElement.style.bottom = '0';
        flashElement.style.backgroundColor = 'white';
        flashElement.style.zIndex = '9999';
        flashElement.style.pointerEvents = 'none';
        flashElement.style.display = 'none';
        document.body.appendChild(flashElement);
    }
    // Enable flash on count with .01% probability
    const randomFlash = () => {
        if (Math.random() < 1 || count % 100 === 0) { // Rare random flash or every 100 counts
            flashElement.style.display = '';
            flashElement.style.opacity = '1';
            
            // Animation sequence
            setTimeout(() => {
                flashElement.style.opacity = '0.33265';
                
                setTimeout(() => {
                    flashElement.style.transition = 'opacity 25ms';
                    flashElement.style.opacity = '0';
                    
                    setTimeout(() => {
                        flashElement.style.display = 'none';
                        flashElement.style.opacity = '1';
                        flashElement.style.transition = '';
                    }, 25);
                }, 50);
            }, 0);
        }
    };
    
    // Add flash trigger to counting action
    const originalIncrementCount = incrementCount;
    incrementCount = function() {
        originalIncrementCount();
        randomFlash();
        console.log('Flash therapy triggered');
    };
    
    // Add flash therapy toggle in settings
    const settingsSection = document.querySelector('.settings') || infoModal;
    if (settingsSection) {
        const flashToggle = document.createElement('button');
        flashToggle.id = 'flash-toggle';
        flashToggle.className = 'theme-btn';
        flashToggle.textContent = 'Flash Therapy: ON';
        flashToggle.addEventListener('click', () => {
            const isOn = flashToggle.textContent.includes('ON');
            flashToggle.textContent = isOn ? 'Flash Therapy: OFF' : 'Flash Therapy: ON';
            localStorage.setItem('tasbih-flash-therapy', !isOn);
        });
        settingsSection.appendChild(flashToggle);
        
        // Set initial state from localStorage
        const flashEnabled = localStorage.getItem('tasbih-flash-therapy') !== 'false';
        flashToggle.textContent = flashEnabled ? 'Flash Therapy: ON' : 'Flash Therapy: OFF';
    }
};

// Initialize flash therapy when DOM content is loaded
document.addEventListener('DOMContentLoaded', initFlashTherapy); */