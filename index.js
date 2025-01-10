const question = document.getElementById('question');
const options = document.querySelector('.options'); // Updated selector to match your HTML

async function loadQuestion() {
    const APIUrl = 'https://opentdb.com/api.php?amount=1&category=11&type=multiple';
    const result = await fetch(`${APIUrl}`);
    const data = await result.json();

    showQuestion(data.results[0]);
}

function showQuestion(data) {
    const correctAnswer = data.correct_answer;
    const incorrectAnswers = data.incorrect_answers;
    const listOfOptions = incorrectAnswers; 
    listOfOptions.splice(Math.floor(Math.random() * (incorrectAnswers.length + 1)), 0, correctAnswer); 

    console.log(listOfOptions); 
    console.log(correctAnswer); 

    question.innerHTML = `${data.question} <br> <span class="category">${data.category}</span>`;
    options.innerHTML = listOfOptions
        .map((option, index) => `<li>${index + 1}. <span>${option}</span></li>`)
        .join(''); 
}

loadQuestion();