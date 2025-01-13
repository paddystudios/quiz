const question = document.getElementById('question');
const options = document.querySelector('.options'); // Updated selector to match your HTML
const rightScore = document.getElementById('right-score');
const totalQuestions = document.getElementById('total-questions');
const checkBtn = document.getElementById('check-answer');
const playAgainBtn = document.getElementById('play-again');
const quizResult = document.getElementById('result');

let correctAnswer = "", correctScore = askedCount = 0, allQuestions = 10;

//event listeners
function eventListeners(){
    checkBtn.addEventListener('click', checkAnswers);
}

document.addEventListener('DOMContentLoaded', () =>{
    loadQuestion();
    eventListeners();
 totalQuestions.textContent = allQuestions;
 rightScore.textContent = askedCount;
});



async function loadQuestion() {
    const APIUrl = 'https://opentdb.com/api.php?amount=1&category=11&type=multiple';
    const result = await fetch(`${APIUrl}`);
    const data = await result.json();

    result.innerHTML = "";
    showQuestion(data.results[0]);
}

function showQuestion(data) {
    checkBtn.disabled = false;
    correctAnswer = data.correct_answer;
    const incorrectAnswers = data.incorrect_answers;
    const listOfOptions = incorrectAnswers; 
    listOfOptions.splice(Math.floor(Math.random() * (incorrectAnswers.length + 1)), 0, correctAnswer); 

    question.innerHTML = `${data.question} <br> <span class="category">${data.category}</span>`;
    options.innerHTML = listOfOptions
        .map((option, index) => `<li>${index + 1}. <span>${option}</span></li>`)
        .join(''); 

        selectOption();
}

// selection for options
function selectOption(){
    options.querySelectorAll('li').forEach((option) => {
        option.addEventListener('click', () =>{
            if (options.querySelector('.selected')){
                const activeOption = options.querySelector('.selected');
                activeOption.classList.remove('selected');
            }
            option.classList.add('selected')
        });
    });
    console.log(correctAnswer);
}

// checking answers
function checkAnswers(){
checkBtn.disabled = true;
if (options.querySelector('.selected')){
    let selectedAnswer = options.querySelector('.selected span').textContent;
    if(selectedAnswer.trim() == HTMLDecode(correctAnswer)){
        correctScore++;
        result.innerHTML = `<p> <i class = "fas fa-check"> </i> Correct Answer!</p>`;
    } else {
        result.innerHTML = `<p> <i class = "fas fa-times"> </i> Incorrect Answer! </p> <p> <small><b> Correct Answer: </b> ${correctAnswer} </small></p>`
    }
    checkCount();
    
}
}

function HTMLDecode(textString){
    let doc = new DOMParser().parseFromString(textString, "text/html");
    return doc.documentElement.textContent;
}

function checkCount(){
    askedCount++;
    setCount();
    if(askedCount == allQuestions){
        alert("hello");
    } else {
        setTimeout(() =>{
            loadQuestion();
        }, 300);
    }
}

function setCount(){
    totalQuestions.textContent = allQuestions;
    rightScore.textContent = askedCount;
}