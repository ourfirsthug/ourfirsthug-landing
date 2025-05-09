const btnCouple = document.getElementById('btn-couple');
const btnPhotographer = document.getElementById('btn-photographer');
const heroImage = document.getElementById('hero-image').querySelector('img');
const formSection = document.getElementById('form-section');
const formTitle = document.getElementById('form-title');
const formSubtitle = document.getElementById('form-subtitle');

const form = document.getElementById('waitlist-form');
const submitBtn = document.getElementById('submit-btn');
const inputName = document.getElementById('name-input');
const inputEmail = document.getElementById('email-input');
const inputCity = document.getElementById('city-input');

const errorName = document.getElementById('error-name');
const errorEmail = document.getElementById('error-email');
const errorCity = document.getElementById('error-city');

const thankYouMessage = document.getElementById('thank-you');

const coupleHeroImageSrc = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=687&q=80";
const photographerHeroImageSrc = "https://images.unsplash.com/photo-1494526585095-c41746248156?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";

const coupleFormSubtitle =
    "We know the search is overwhelming. That’s why we’re creating a better way: a curated platform where you can discover trustworthy, talented photographers who truly get your story. Enter your details to get early access.";
const photographerFormSubtitle =
    "We’re building a platform where you don’t have to fight for fair pay or chase clients. Just real bookings from couples who value your craft. Enter your details to get early access.";

let selectedType = null;

function updateHero(type) {
    if (type === "couple") {
        heroImage.src = coupleHeroImageSrc;
        heroImage.alt = "Bride and groom sharing a joyful moment during wedding photography";
        btnCouple.classList.add("active");
        btnPhotographer.classList.remove("active");
    } else {
        heroImage.src = photographerHeroImageSrc;
        heroImage.alt = "Photographer taking candid wedding photos";
        btnPhotographer.classList.add("active");
        btnCouple.classList.remove("active");
    }
}

function updateForm(type) {
    if (type === "couple") {
        formTitle.textContent = "Join the Waitlist";
        formSubtitle.textContent = coupleFormSubtitle;
    } else {
        formTitle.textContent = "Join the Waitlist";
        formSubtitle.textContent = photographerFormSubtitle;
    }
}

// Show form section with updated text and image
function showForm(type) {
    selectedType = type;
    formSection.style.display = "block";
    formSection.setAttribute("aria-hidden", "false");
    updateForm(type);
    updateHero(type);
    resetForm();
    inputName.focus();

    btnCouple.setAttribute('aria-expanded', type === 'couple' ? 'true' : 'false');
    btnPhotographer.setAttribute('aria-expanded', type === 'photographer' ? 'true' : 'false');
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validate() {
    let valid = true;
    if (!inputName.value.trim()) {
        errorName.textContent = "Please enter your name.";
        valid = false;
    } else {
        errorName.textContent = "";
    }
    if (!inputEmail.value.trim()) {
        errorEmail.textContent = "Please enter your email.";
        valid = false;
    } else if (!validateEmail(inputEmail.value.trim())) {
        errorEmail.textContent = "Please enter a valid email.";
        valid = false;
    } else {
        errorEmail.textContent = "";
    }
    if (!inputCity.value.trim()) {
        errorCity.textContent = "Please select your city.";
        valid = false;
    } else {
        errorCity.textContent = "";
    }
    submitBtn.disabled = !valid;
    return valid;
}

function resetForm() {
    form.reset();
    errorName.textContent = "";
    errorEmail.textContent = "";
    errorCity.textContent = "";
    submitBtn.disabled = true;
}

function showThankYou(message) {
    thankYouMessage.textContent = message;
    thankYouMessage.hidden = false;
    thankYouMessage.classList.add("show");
    setTimeout(() => {
        thankYouMessage.classList.remove("show");
        setTimeout(() => {
            thankYouMessage.hidden = true;
        }, 600);
    }, 3500);
}

function sendEmail() {
    return new Promise(resolve => setTimeout(resolve, 1300));
}

btnCouple.addEventListener("click", () => showForm("couple"));
btnPhotographer.addEventListener("click", () => showForm("photographer"));

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!validate()) return;
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";
    try {
        await sendEmail();
        let message = selectedType === "couple" ?
            "You’re on the list! We’ll reach out soon with early access so you can find your perfect photographer." :
            "You’re in! We’ll reach out soon when early access opens in your city.";
        alert(message);
        showThankYou(message);
        resetForm();
    } catch {
        alert("Something went wrong. Please try again later.");
    } finally {
        submitBtn.textContent = "Join the Waitlist";
        validate();
    }
});

[inputName, inputEmail, inputCity].forEach(input => {
    input.addEventListener("input", validate);
});

document.getElementById("login-button").addEventListener("click", () => {
    alert("Login functionality coming soon!");
});

formSection.style.display = "none";
btnCouple.setAttribute('aria-expanded', 'false');
btnPhotographer.setAttribute('aria-expanded', 'false');