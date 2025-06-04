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
    else if (currentQuestion.type === "gendernumbers") {
        optionsContainer.innerHTML = `
            <button class="button" onclick="next_question(-1)" style="background-color: #4e9dba;">Only two.</button> <br>
            <button class="button" onclick="next_question(0.75)" style="background-color: #F5CB5C;">At least three. Don't play games with me kid</button> <br>
            <button class="button" onclick="next_question(1)" style="background-color: #AF4B7A;">Double digits or more.</button> <br>
            <button class="button" onclick="next_question(0)" style="background-color: #bbbbbb;">I don't like any of these options</button>`;
        } 
    else if (currentQuestion.type === "womandress") {
        optionsContainer.innerHTML = `
            <button class="button" onclick="next_question(0)" style="background-color: #bbbbbb;">Not a Woman / None of these</button> <br>
            <button class="button" onclick="next_question(0)" style="background-color: #4caf50;">Average</button> <br>
            <button class="button" onclick="next_question(1)" style="background-color: #F5CB5C;">Traditional</button> <br>
            <button class="button" onclick="next_question(-1)" style="background-color: #af4b7a;">Alternative</button> <br>
            <button class="button" onclick="next_question(-1)" style="background-color: #4E9DBA;">Masculine</button> <br>
            <button class="button" onclick="next_question(-2)" style="background-color: #f44336;">Pantsuit</button>`;
        } 
    else if (currentQuestion.type === "womanhair") {
        optionsContainer.innerHTML = `
            <button class="button" onclick="next_question(0)" style="background-color: #bbbbbb;">Not a Woman / None of these</button> <br>
            <button class="button" onclick="next_question(1)" style="background-color: #f5cc5c;">Shorter than a bob</button> <br>
            <button class="button" onclick="next_question(0.5)" style="background-color: #f7a45c;">Bob or Lob</button> <br>
            <button class="button" onclick="next_question(0)" style="background-color: #ec7f66;">Shoulder to mid-back</button> <br>
            <button class="button" onclick="next_question(-0.5)" style="background-color: #d36072;">Waist to butt</button> <br>
            <button class="button" onclick="next_question(-1)" style="background-color: #af4b7a;">Longer than butt</button>`;
        }
    else if (currentQuestion.type === "manhair") {
        optionsContainer.innerHTML = `
            <button class="button" onclick="next_question(0)" style="background-color: #bbbbbb;">Not a Man / None of these</button> <br>
            <button class="button" onclick="next_question(-1)" style="background-color: #F5CB5C;">Man Bun</button> <br>
            <button class="button" onclick="next_question(1)" style="background-color: #F44336;">Shaved sides, short-to-medium top</button>`;
        } 
    else if (currentQuestion.type === "manwomenfriends") {
        optionsContainer.innerHTML = `
            <button class="button" onclick="next_question(0)" style="background-color: #bbbbbb;">Not a Man</button> <br>
            <button class="button" onclick="next_question(1)" style="background-color: #b71c1c;">No women friends</button> <br>
            <button class="button" onclick="next_question(0)" style="background-color: #f44336;">Woman friend/s, but only online</button> <br>
            <button class="button" onclick="next_question(-0.5)" style="background-color: #4caf50;">One woman friend in real life</button> <br>
            <button class="button" onclick="next_question(-1)" style="background-color: #1b5e20;">Multiple women friends in real life</button>`;
        }
    else if (currentQuestion.type === "nbname") {
        optionsContainer.innerHTML = `
            <button class="button" onclick="next_question(0)" style="background-color: #bbbbbb;">Not Non-binary / None of these</button> <br>
            <button class="button" onclick="next_question(1)" style="background-color: #4caf50;">A more traditional name, like Alex</button> <br>
            <button class="button" onclick="next_question(-1)" style="background-color: #f44336;">A more experimental name, like Sock</button>`;
        } 
    else if (currentQuestion.type === "dyedhair") {
        optionsContainer.innerHTML = `
            <button class="button" onclick="next_question(1)" style="background-color: #4e9dba;">Dyed in non-standard colours</button> <br>
            <button class="button" onclick="next_question(-1)" style="background-color: #F5CB5C;">Dyed blonde</button> <br>
            <button class="button" onclick="next_question(0)" style="background-color: #4caf50;">Highlights</button> <br>
            <button class="button" onclick="next_question(-0.75)" style="background-color: #f44336;">Dyed natural</button> <br>
            <button class="button" onclick="next_question(-0.5)" style="background-color: #af4b7a;">No</button>`;
        } 
    else if (currentQuestion.type === "cityvsrural") {
        optionsContainer.innerHTML = `
            <button class="button" onclick="next_question(1)" style="background-color: #4e9dba;">The city.</button> <br>
            <button class="button" onclick="next_question(-1)" style="background-color: #af4b7a;">The suburbs.</button> <br>
            <button class="button" onclick="next_question(-0.5)" style="background-color: #bbbbbb;">The countryside.</button>`;
        } 
    else if (currentQuestion.type === "religion") {
        optionsContainer.innerHTML = `
            <button class="button" onclick="next_question(1)" style="background-color: #4f9eba;">Actively religious.</button> <br>
            <button class="button" onclick="next_question(0.5)" style="background-color: #6888c3;">Religious, but rarely active.</button> <br>
            <button class="button" onclick="next_question(-0.5)" style="background-color: #946baf;">Agnostic.</button> <br>
            <button class="button" onclick="next_question(-1)" style="background-color: #af4b7a;">Atheist/Anti-theist.</button> <br>
            <button class="button" onclick="next_question(0)" style="background-color: #bbbbbb;">Unsure/Other</button>`;
        } 
    else if (currentQuestion.type === "partner") {
        optionsContainer.innerHTML = `
            <button class="button" onclick="next_question(1)" style="background-color: #1b5e20;">The same race.</button> <br>
            <button class="button" onclick="next_question(0)" style="background-color: #bbbbbb;">I am single.</button> <br>
            <button class="button" onclick="next_question(-1)" style="background-color: #b71c1c;">A different race.</button>`;
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
        if (effect === "acts") {
            // account for gender specific questions
            percentages[effect] = max[effect] > 2 
                ? ((scores[effect] * 10) / (max[effect] - 2)).toFixed(2) : 0;
        } else {
            percentages[effect] = max[effect] > 0 
                ? ((scores[effect] * 10) / max[effect]).toFixed(2) : 0;
        }
    }

    return percentages;
}
