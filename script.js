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

const thankYouMessage = document.getElementById('thank-you');
var emailData = {
    to: "",
    name: "",
    selectedType: ""
};
const coupleHeroImageSrc = "Couple.jpg";
const photographerHeroImageSrc = "photographer.jpg";

const coupleFormSubtitle =
    "We know the search is overwhelming. That’s why we’re creating a better way: a curated platform where you can discover trustworthy, talented photographers who truly get your story. All in one place, built with love."
const coupleFormSubtitlePart2 = "Tired of endless calls, fake ratings, and overpriced photographers? We’re building a simpler, smarter way to book photographers you can trust, someone who truly gets your story—without blowing your budget or losing your mind.";
const photographerFormSubtitle =
    "We’re building a platform where you don’t have to fight for fair pay, justify your rates, or chase couples who ghost. Just real bookings from couples who understand the value of your work—and treat you like a professional.";

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
    updateTagLine(type);
    if (type === "couple") {
        formTitle.textContent = "Join the Waitlist";
        formSubtitle.innerHTML = coupleFormSubtitle + "<br></br>" + coupleFormSubtitlePart2;
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
    setTimeout(() => {
        inputName.focus();
    }, 300);

    btnCouple.setAttribute('aria-expanded', type === 'couple' ? 'true' : 'false');
    btnPhotographer.setAttribute('aria-expanded', type === 'photographer' ? 'true' : 'false');
}

function updateTagLine(type) {
    if (type === "couple") {
        tagLine.innerHTML = "<h1 id='tagline-text'>Find your <span class='special-word'>perfect</span> wedding photographer without any stress</h1>";
    } else {
        tagLine.innerHTML = "<h1 id='tagline-text'>Work with couples who <span class='special-word'>value</span> your craft.</h1>"
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

    if (inputNumber.value) {
        let phoneNumber = inputNumber.value.replace(/\D/g, '');
        if (phoneNumber.length < 10) {
            errorNumber.textContent = "Mobile cannot be less than 10 digits."
            valid = false;
        } else if (!validatePhone(inputNumber.value.trim())) {
            errorNumber.textContent = "Please enter a valid mobile."
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
        showThankYou(message);
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