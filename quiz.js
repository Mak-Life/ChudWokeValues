// Load questions from the external questions.js file
let questionsObject = {};
questions.forEach((q) => (questionsObject[q.id] = q));

let answers = {}; // Store user answers
let questionsOrder = Object.keys(questionsObject); // Define question order
let qn = 0; // Current question index

// Shuffle questions if needed
const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get("shuffle") === "true") {
    shuffleArray(questionsOrder);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Initialize the first question
init_question();

function init_question() {
    const currentQuestion = questionsObject[questionsOrder[qn]];
    document.getElementById("question-text").innerHTML = currentQuestion.question;
    document.getElementById("question-number").innerHTML = `Question ${qn + 1} of ${questionsOrder.length}`;

    const optionsContainer = document.getElementById("question-options");
    optionsContainer.innerHTML = "";

    // Dynamically render question options based on the question type
    if (currentQuestion.type === "frequency") {
        optionsContainer.innerHTML = `
            <button class="button" onclick="next_question(1)" style="background-color: #1b5e20;">Always</button> <br>
            <button class="button" onclick="next_question(0.75)" style="background-color: #4caf50;">Often</button> <br>
            <button class="button" onclick="next_question(0.5)" style="background-color: #bbbbbb;">Sometimes</button> <br>
            <button class="button" onclick="next_question(0.25)" style="background-color: #f44336;">Rarely</button> <br>
            <button class="button" onclick="next_question(0)" style="background-color: #b71c1c;">Never</button>`;
        } 
    else if (currentQuestion.type === "behavedescription") {
        optionsContainer.innerHTML = `
            <button class="button" onclick="next_question(-1)" style="background-color: #4e9dba;">Judgemental</button> <br>
            <button class="button" onclick="next_question(1)" style="background-color: #af4b7a;">Abrasive</button> <br>
            <button class="button" onclick="next_question(0)" style="background-color: #bbbbbb;">Neither of these</button>`;
        } 
    else {
        optionsContainer.innerHTML = `
            <button class="button" onclick="next_question(1)" style="background-color: #1b5e20;">Strongly Agree</button> <br>
            <button class="button" onclick="next_question(0.5)" style="background-color: #4caf50;">Agree</button> <br>
            <button class="button" onclick="next_question(0)" style="background-color: #bbbbbb;">Neutral</button> <br>
            <button class="button" onclick="next_question(-0.5)" style="background-color: #f44336;">Disagree</button> <br>
            <button class="button" onclick="next_question(-1)" style="background-color: #b71c1c;">Strongly Disagree</button>`;
    }

    // Show or hide the back button based on progress
    const backButton = document.getElementById("back_button");
    const backButtonOff = document.getElementById("back_button_off");
    if (qn === 0) {
        backButton.style.display = "none";
        backButtonOff.style.display = "inline";
    } else {
        backButton.style.display = "inline";
        backButtonOff.style.display = "none";
    }
}

function next_question(answer) {
    // Save the answer and move to the next question
    answers[questionsOrder[qn]] = answer;
    qn++;

    if (qn < questionsOrder.length) {
        init_question();
    } else {
        calculate_results();
    }
}

function prev_question() {
    if (qn > 0) {
        qn--;
        delete answers[questionsOrder[qn]]; // Remove the answer for the current question
        init_question();
    }
}

function calculate_results() {
    // Store answers in session storage
    sessionStorage.setItem("answers", JSON.stringify(answers));

    // Perform percentage calculation
    const percentages = percentageCalculation();
    sessionStorage.setItem("percentages", JSON.stringify(percentages));

    // Prepare arguments for query string
    let args = Object.entries(percentages)
        .map(([key, value]) => `${key}=${value}`)
        .join("&");

    // Redirect to feedback.html or results.html
    const isHostedOnGitHub = window.location.hostname === "mak-life.github.io";
    // const nextPage = isHostedOnGitHub ? "feedback.html" : "results.html";
    const nextPage = "results.html";
    location.href = `${nextPage}?${args}`;
}

function percentageCalculation() {
    let max = {};
    let scores = {};
    let percentages = {};

    // Initialize scores and max
    for (const id in answers) {
        for (const effect in questionsObject[id].effects) {
            max[effect] = max[effect] || 0;
            scores[effect] = scores[effect] || 0;

            const weight = questionsObject[id].effects[effect];
            max[effect] += Math.abs(weight);
            scores[effect] += answers[id] * weight;
        }
    }

    // Calculate percentages
    for (const effect in max) {
        percentages[effect] =
            max[effect] > 0 ? ((scores[effect] * 10) / max[effect]).toFixed(2) : 0;
    }

    return percentages;
}
