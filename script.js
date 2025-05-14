const btnCouple = document.getElementById('btn-couple');
const btnPhotographer = document.getElementById('btn-photographer');
const heroImage = document.getElementById('hero-image').querySelector('img');
const formSection = document.getElementById('form-section');
const formTitle = document.getElementById('form-title');
const formSubtitle = document.getElementById('tagline-subtext');
const tagLine = document.getElementById('tagline-text');
const form = document.getElementById('waitlist-form');
const submitBtn = document.getElementById('submit-btn');
const inputName = document.getElementById('name-input');
const inputEmail = document.getElementById('email-input');
const inputCity = document.getElementById('city-input');
const inputNumber = document.getElementById('number-input');

const errorName = document.getElementById('error-name');
const errorEmail = document.getElementById('error-email');
const errorCity = document.getElementById('error-city');
const errorNumber = document.getElementById('error-number');
const brochure = document.getElementById("tagline-brochure");

var emailData = {
    to: "",
    name: "",
    selectedType: ""
};

const coupleFormSubtitle = "Tired of endless calls, fake reviews, and overpriced photographers? Or worse—the fear of hiring someone with terrible work quality who ruins your once-in-a-lifetime moments?";
const coupleFormSubtitlePart2 = "We’re building a simpler way to find photographers you can trust—talented, transparent, and truly aligned with your story.";

const photographerFormSubtitle = "Tired of clients not paying after delivery or rejecting your rates?"
const photographerFormSubtitlepart2 = "We’re building a platform where you don’t have to justify your pricing or chase overdue payments. Just real bookings from respectful couples who value your work and pay the full amount-on time.";

let selectedType = null;

function updateHero(type) {
    if (type === "couple") {
        btnCouple.classList.add("active");
        btnPhotographer.classList.remove("active");
    } else {
        btnPhotographer.classList.add("active");
        btnCouple.classList.remove("active");
    }
}

function updateForm(type) {
    updateTagLine(type);
    if (type === "couple") {
        formTitle.textContent = "Join the Waitlist";
        formSubtitle.innerHTML = coupleFormSubtitle + "<br><br>" + coupleFormSubtitlePart2;
        brochure.innerHTML = "<p id='tagline-brochure'>Download our <a href='BrochureforCouples.pdf' target='_blank'>Brochure</a>.</p>"

    } else {
        formTitle.textContent = "Join the Waitlist";
        formSubtitle.innerHTML = photographerFormSubtitle + "<br><br>" + photographerFormSubtitlepart2;
        brochure.innerHTML = "<p id='tagline-brochure'>Download our <a href='BrochureforPhotographers.pdf' target='_blank'>Brochure</a>.</p>";
    }
}

var counter = 0;

// Show form section with updated text and image
function showForm(type) {
    selectedType = type;
    formSection.style.display = "block";
    formSection.setAttribute("aria-hidden", "false");
    updateForm(type);
    updateHero(type);
    resetForm();
    btnCouple.setAttribute('aria-expanded', type === 'couple' ? 'true' : 'false');
    btnPhotographer.setAttribute('aria-expanded', type === 'photographer' ? 'true' : 'false');
}

function updateTagLine(type) {
    if (type === "couple") {
        tagLine.innerHTML = "<h1 id='tagline-text'>Find your <span class='special-word'>perfect</span> <br> wedding photographer <br> quickly and easily.</h1>";
    } else {
        tagLine.innerHTML = "<h1 id='tagline-text'>Get discovered, <br /> booked and  <span class='special-word'>full paid</span> <br> by couples who truly <br> value your work</h1>";
    }
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
    return /^[6-9]\d{9}$/.test(phone);
}


function validate() {
    let valid = true;
    if (!inputName.value.trim()) {
        valid = false;
    }
    else {
        errorName.textContent = "";
    }
    if (!inputEmail.value.trim()) {
        valid = false;
    } else if (!validateEmail(inputEmail.value.trim())) {
        valid = false;
    } else {
        errorEmail.textContent = "";
    }
    if (!inputCity.value.trim()) {
        valid = false;
    } else {
        errorCity.textContent = "";
    }

    if (inputNumber.value) {
        let phoneNumber = inputNumber.value.replace(/\D/g, '');
        if (phoneNumber.length < 10) {
            valid = false;
        } else if (!validatePhone(inputNumber.value.trim())) {
            valid = false;
        }
    }
    submitBtn.disabled = !valid;
    return valid;
}

function resetForm() {
    form.reset();
    errorName.textContent = "";
    errorEmail.textContent = "";
    errorCity.textContent = "";
    errorNumber.textContent = "";
    submitBtn.disabled = true;
}

function sendEmail(emailData) {
    return new Promise((resolve, reject) => {
        fetch('https://ourfirsthug-email.onrender.com/send-email', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(emailData)
        })
            .then(response => response.json())
            .then(data => {
                console.log("Email sent successfully:", data);
                resolve(data);
            })
            .catch(error => {
                console.error("Error sending email:", error);
                reject(error);
            });
    });
}

btnCouple.addEventListener("click", () => showForm("couple"));
btnPhotographer.addEventListener("click", () => showForm("photographer"));

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validate()) return;

    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    try {
        const formData = {
            name: inputName.value,
            email: inputEmail.value,
            city: inputCity.value,
            mobile: inputNumber.value,
            user: selectedType,
        };

        emailData = {
            to: inputEmail.value,
            name: inputName.value,
            selectedType: selectedType
        };

        const apiUrl = 'https://script.google.com/macros/s/AKfycbxKoNyA5wf681JkTfvSyntc9DCH5Z9kKbo8ateiw-wwUnJsfcd4GAhgPtx1jDjveTLnTw/exec';

        await fetch(apiUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        let message = selectedType === "couple" ?
            "You’re on the list! We’ll reach out soon with early access so you can find your perfect photographer." :
            "You’re in! We’ll reach out soon when early access opens in your city.";

        alert(message);
        resetForm();

    } catch (error) {
        console.error('Error:', error);
        alert("Something went wrong. Please try again later.");
    } finally {
        submitBtn.disabled = true;
        submitBtn.textContent = "Join the Waitlist";
        await sendEmail(emailData);
    }
});


[inputName, inputEmail, inputCity, inputNumber].forEach(input => {
    input.addEventListener("input", validate);
});

document.getElementById('number-input').addEventListener('input', function () {
    errorNumber.textContent = "";
});

formSection.style.display = "none";
btnCouple.setAttribute('aria-expanded', 'false');
btnPhotographer.setAttribute('aria-expanded', 'false');
btnPhotographer.click();
window.scrollTo({
    top: 0,
    behavior: 'smooth'  // Use 'auto' if you don't want smooth scroll
});

document.querySelectorAll('.no-spinner').forEach(input => {
    input.addEventListener('keydown', e => {
        // Allow: Backspace, Delete, Arrow keys
        if (['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) return;
        // Block anything not a digit
        if (!/^[0-9]$/.test(e.key)) e.preventDefault();
    });
});


inputName.addEventListener('input', () => {
    inputName.value = inputName.value.replace(/[^a-zA-Z\s]/g, '');
});

const btn = document.getElementById('nudgeBtn');
const arrow = document.getElementById('scrollArrow');

btnCouple.addEventListener('click', () => {
    // Add nudge animation to body
    document.body.classList.add('nudge-body');

    // Show arrow
    arrow.style.display = 'block';

    // Remove arrow after 3.5 seconds
    setTimeout(() => {
        arrow.style.display = 'none';
    }, 3500);

    // Remove nudge class after animation ends so it can run again
    setTimeout(() => {
        document.body.classList.remove('nudge-body');
    }, 900);
});

btnPhotographer.addEventListener('click', () => {
    // Add nudge animation to body
    document.body.classList.add('nudge-body');

    // Show arrow
    arrow.style.display = 'block';

    // Remove arrow after 3.5 seconds
    setTimeout(() => {
        arrow.style.display = 'none';
    }, 3500);

    // Remove nudge class after animation ends so it can run again
    setTimeout(() => {
        document.body.classList.remove('nudge-body');
    }, 900);
});