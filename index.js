// https://opentdb.com/api.php?amount=10&category=11&type=multiple

const question = document.getElementById('question');
const options = document.querySelector('options');

async function loadQuestion(){
    const APIUrl = 'https://opentdb.com/api.php?amount=1&category=11&type=multiple';
    const result = await fetch (`${APIUrl}`);
    const data = await result.json();

    showQuestion(data.results[0]);
}

function showQuestion(data){
    let correctAnswer = data.correct_answer;
    let incorrectAnswer = data.incorrect_answers;
    let listOfOptions = incorrectAnswer;
    listOfOptions.splice(Math.floor(Math.random() * (incorrectAnswer.length + 1)), 0, correctAnswer);
    
    console.log(listOfOptions);
}

loadQuestion();