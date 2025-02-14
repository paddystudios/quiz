const question = document.getElementById("question");
const options = document.querySelector(".options"); // updated selector to match your HTML
const rightScore = document.getElementById("right-score");
const totalQuestions = document.getElementById("total-questions");
const checkBtn = document.getElementById("check-answer");
const playAgainBtn = document.getElementById("play-again");
const quizResult = document.getElementById("result");

let correctAnswer = "",
  correctScore = 0,
  askedCount = 0,
  allQuestions = 10,
  questions = []; // store fetched questions here

// event listeners
function eventListeners() {
  checkBtn.addEventListener("click", checkAnswers);
  playAgainBtn.addEventListener("click", restartGame);
}

document.addEventListener("DOMContentLoaded", () => {
  fetchQuestions(); // fetch all questions on page load
  eventListeners();
  totalQuestions.textContent = allQuestions;
  rightScore.textContent = askedCount;
});

// fetch 10 questions at once
async function fetchQuestions() {
  const APIUrl =
    "https://opentdb.com/api.php?amount=10&category=11&type=multiple";
  try {
    const result = await fetch(APIUrl);
    // check if the response is successful
    if (!result.ok) {
      throw new Error(`Failed to fetch questions: ${result.status}`);
    }
    const data = await result.json();

    if (data.results && data.results.length > 0) {
      questions = data.results; // store questions in the array
      loadQuestion();
    } else {
      // if using question to display message, break it out into a separate function for reusability and readability
      displayError("No questions found. Please try again later.");
    }
  } catch (error) {
    console.error("Error fetching questions:", error);
    // if using question to display message, break it out into a separate function for reusability and readability
    displayError("Unable to load questions. Please check your connection.");
  }
}

// display error message
function displayError(message) {
  questionElement.innerHTML = `<p>${message}</p>`;
  checkBtn.style.display = "none";
}

// load the next question from the array
function loadQuestion() {
  if (questions.length > 0) {
    const currentQuestion = questions.shift(); // remove the first question from the array
    showQuestion(currentQuestion);
  } else {
    // if no questions left, display results or fetch more questions
    question.innerHTML = `<p>All questions have been answered. Your score is ${correctScore}.</p>`;
    checkBtn.style.display = "none";
    playAgainBtn.style.display = "block";
  }
}

// show the current question and options
function showQuestion(data) {
  checkBtn.disabled = false;
  correctAnswer = data.correct_answer;

  const incorrectAnswers = data.incorrect_answers;
  const listOfOptions = [...incorrectAnswers]; // copy incorrect answers
  listOfOptions.splice(
    Math.floor(Math.random() * (incorrectAnswers.length + 1)),
    0,
    correctAnswer
  ); // insert correct answer randomly

  question.innerHTML = `${data.question} <br> <span class="category">${data.category}</span>`;
  options.innerHTML = listOfOptions
    .map((option, index) => `<li>${index + 1}. <span>${option}</span></li>`)
    .join("");

  selectOption();
}

// selection for options
function selectOption() {
  options.querySelectorAll("li").forEach((option) => {
    option.addEventListener("click", () => {
      if (options.querySelector(".selected")) {
        const activeOption = options.querySelector(".selected");
        activeOption.classList.remove("selected");
      }
      option.classList.add("selected");
    });
  });
}

// check the selected anser
function checkAnswers() {
  checkBtn.disabled = true;
  if (options.querySelector(".selected")) {
    let selectedAnswer = options.querySelector(".selected span").textContent;
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

// decode html entities
function HTMLDecode(textString) {
  let doc = new DOMParser().parseFromString(textString, "text/html");
  return doc.documentElement.textContent;
}

// update question count and handle end of quiz
function checkCount() {
  askedCount++;
  setCount();
  if (askedCount === allQuestions) {
    quizResult.innerHTML = `<p class="score-results">Your Score is ${correctScore}!</p>`;
    playAgainBtn.style.display = "block";
    checkBtn.style.display = "none";
  } else {
    setTimeout(() => {
      loadQuestion();
    }, 300);
  }
}

// update score and total questions displayed
function setCount() {
  totalQuestions.textContent = allQuestions;
  rightScore.textContent = askedCount;
}

// restart the game
function restartGame() {
  correctScore = 0;
  askedCount = 0;
  questions = []; // clear questions array
  playAgainBtn.style.display = "none";
  checkBtn.style.display = "block";
  checkBtn.disabled = false;
  setCount();
  fetchQuestions(); // fetch a new set of questions
}
