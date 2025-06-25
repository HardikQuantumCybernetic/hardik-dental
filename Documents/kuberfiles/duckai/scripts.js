document.addEventListener("DOMContentLoaded", function() {
    const modeToggle = document.getElementById("mode-toggle");
    const body = document.body;

    // Check for saved mode in localStorage
    if (localStorage.getItem("mode") === "dark") {
        body.classList.add("dark-mode");
    }

    // Toggle dark/light mode
    modeToggle.addEventListener("click", function() {
        body.classList.toggle("dark-mode");
        if (body.classList.contains("dark-mode")) {
            localStorage.setItem("mode", "dark");
        } else {
            localStorage.setItem("mode", "light");
        }
    });

    // Contact form submission
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", function(event) {
            event.preventDefault(); // Prevent default form submission
            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const message = document.getElementById("message").value;

            if (name && email && message) {
                const whatsappNumber = "8080950921";
                const whatsappMessage = `Name: ${name}\nEmail: ${email}\nMessage: ${message}`;
                const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;
                window.open(whatsappUrl, "_blank");
                contactForm.reset(); // Reset the form after submission
            } else {
                alert("Please fill in all fields.");
            }
        });
    }
});

