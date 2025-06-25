// Dark/Light mode toggle for duckai
const modeToggle = document.getElementById('mode-toggle');
const body = document.body;

function setTheme(theme) {
    if (theme === 'dark') {
        body.classList.add('dark');
    } else {
        body.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
}

// Load saved theme
const savedTheme = localStorage.getItem('theme') || 'light';
setTheme(savedTheme);

modeToggle.addEventListener('click', () => {
    const isDark = body.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
});
