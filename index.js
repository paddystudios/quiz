const question = document.getElementById('question');
const options = document.querySelector('.options'); 
const rightScore = document.getElementById('right-score');
const totalQuestions = document.getElementById('total-questions');
const checkBtn = document.getElementById('check-answer');
const playAgainBtn = document.getElementById('play-again');
const quizResult = document.getElementById('result');

let correctAnswer = "",
    correctScore = 0,
    askedCount = 0,
    allQuestions = 10,
    questions = []; 

// Event listeners
function eventListeners() {
    checkBtn.addEventListener('click', checkAnswers);
    playAgainBtn.addEventListener('click', restartGame);
}

document.addEventListener('DOMContentLoaded', () => {
    fetchQuestions(); 
    eventListeners();
    totalQuestions.textContent = allQuestions;
    rightScore.textContent = askedCount;
});

// Fetch 10 questions at once
async function fetchQuestions() {
    const APIUrl = 'https://opentdb.com/api.php?amount=10&category=11&type=multiple';
    try {
        const result = await fetch(APIUrl);
        const data = await result.json();

        if (data.results && data.results.length > 0) {
            questions = data.results; // Store questions in the array
            loadQuestion();
        } else {
            question.innerHTML = `<p>No questions found. Please try again later.</p>`;
            checkBtn.style.display = 'none';
        }
    } catch (error) {
        console.error('Error fetching questions:', error);
        question.innerHTML = `<p>Unable to load questions. Please check your connection.</p>`;
        checkBtn.style.display = 'none';
    }
}

// Load the next question from the array
function loadQuestion() {
    if (questions.length > 0) {
        const currentQuestion = questions.shift(); /
        showQuestion(currentQuestion);
    } else {

        question.innerHTML = `<p>All questions have been answered. Your score is ${correctScore}.</p>`;
        checkBtn.style.display = 'none';
        playAgainBtn.style.display = 'block';
    }
}

// Show the current question and options
function showQuestion(data) {
    checkBtn.disabled = false;
    correctAnswer = data.correct_answer;

    const incorrectAnswers = data.incorrect_answers;
    const listOfOptions = [...incorrectAnswers]; 
    listOfOptions.splice(Math.floor(Math.random() * (incorrectAnswers.length + 1)), 0, correctAnswer); 

    question.innerHTML = `${data.question} <br> <span class="category">${data.category}</span>`;
    options.innerHTML = listOfOptions
        .map((option, index) => `<li>${index + 1}. <span>${option}</span></li>`)
        .join('');

    selectOption();
}

// Selection for options
function selectOption() {
    options.querySelectorAll('li').forEach((option) => {
        option.addEventListener('click', () => {
            if (options.querySelector('.selected')) {
                const activeOption = options.querySelector('.selected');
                activeOption.classList.remove('selected');
            }
            option.classList.add('selected');
        });
    });
}

// Check the selected answer
function checkAnswers() {
    checkBtn.disabled = true;
    if (options.querySelector('.selected')) {
        let selectedAnswer = options.querySelector('.selected span').textContent;
        if (selectedAnswer.trim() === HTMLDecode(correctAnswer)) {
            correctScore++;
            quizResult.innerHTML = `<p> <i class="fas fa-check"> </i> Correct Answer!</p>`;
        } else {
            quizResult.innerHTML = `<p> <i class="fas fa-times"> </i> Incorrect Answer!</p>
                <p> <small><b>Correct Answer:</b> ${correctAnswer}</small></p>`;
        }
        checkCount();
    } else {
        quizResult.innerHTML = `<p> <i class="fas fa-question"> </i> Please select an option!</p>`;
        checkBtn.disabled = false;
    }
}

// Decode HTML entities
function HTMLDecode(textString) {
    let doc = new DOMParser().parseFromString(textString, 'text/html');
    return doc.documentElement.textContent;
}

// Update question count and handle end of quiz
function checkCount() {
    askedCount++;
    setCount();
    if (askedCount === allQuestions) {
        quizResult.innerHTML = `<p class="score-results">Your Score is ${correctScore}!</p>`;
        playAgainBtn.style.display = 'block';
        checkBtn.style.display = 'none';
    } else {
        setTimeout(() => {
            loadQuestion();
        }, 300);
    }
}

// Update score and total questions displayed
function setCount() {
    totalQuestions.textContent = allQuestions;
    rightScore.textContent = askedCount;
}

// Restart the game
function restartGame() {
    correctScore = 0;
    askedCount = 0;
    questions = []; // Clear questions array
    playAgainBtn.style.display = 'none';
    checkBtn.style.display = 'block';
    checkBtn.disabled = false;
    setCount();
    fetchQuestions(); // Fetch a new set of questions
}