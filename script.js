const ques = document.getElementById("ques");
const choices = Array.from(document.getElementsByClassName("choice-text"));
//setting up of different variables to start game
let score = 0;
let quesCounter = 0;
let currentQues = {};
let acceptAns = false;
let availQues = 0;
let question = [];
//calling api for questions
fetch(
  "https://opentdb.com/api.php?amount=10&category=18&difficulty=medium&type=multiple"
)
  .then((res) => {
    return res.json();
  })
  //for questions
  .then((loadedQues) => {
    question = loadedQues.results.map((loadQues) => {
      const formattedQues = {
        ques: loadQues.question,
      };
      //for choices
      const ansChoices = [...loadQues.incorrect_answers];
      formattedQues.ans = Math.floor(Math.random() * 3) + 1;
      ansChoices.splice(formattedQues.ans - 1, 0, loadQues.correct_answer);
      ansChoices.forEach((elem, index) => {
        formattedQues["choice" + (index + 1)] = elem;
      });
      return formattedQues;
    });
    startGame();
  })
  .catch((err) => {
    console.log(err);
  });
const bonus = 10;
const maxQues = 5;
startGame = () => {
  //for starting the quiz
  quesCounter = 0;
  score = 0;
  availQues = [...question];
  getNewQues();
};
getNewQues = () => {
  //to go to result page
  if (availQues.length === 0 || quesCounter >= maxQues) {
    window.location.assign("result.html");
    localStorage.setItem("mostRecentScore", score);}
  //for questions
  quesCounter++;
  //for score and ques no. bar
  let progressBar = document.getElementById("progress-bar-fill");
  progressBar.style.width = (quesCounter / maxQues) * 100 + "%";
  let progressText = document.getElementById("progress-text");
  progressText.innerText = ` Question ${quesCounter}/${maxQues}`;
  //console.log(quesCounter % maxQues);
  const quesIndex = Math.floor(Math.random() * availQues.length);
  currentQues = availQues[quesIndex];
  ques.innerText = currentQues.ques;

  //for choices
  choices.forEach((choice) => {
    const number = choice.dataset["number"];
    choice.innerText = currentQues["choice" + number];
  });
  //to remove attempted ques from the list to questions
  availQues.splice(quesIndex, 1);
  acceptAns = true;
};

//to select choice and move to next ques
choices.forEach((choice) => {
  choice.addEventListener("click", (e) => {
    if (!acceptAns) return;
    acceptAns = false;
    const selectedChoice = e.target;
    const selectedAns = selectedChoice.dataset["number"];

    //to get incorrect ans as red and correct as green for sometime
    const classToApply =
      selectedAns == currentQues.ans ? "correct" : "incorrect";
    if (classToApply === "correct") {
      incrementScore(bonus);
    }
    selectedChoice.classList.add(classToApply);
    setTimeout(() => {
      selectedChoice.classList.remove(classToApply);
      getNewQues();
    }, 1000);
  });
});
function incrementScore(num) {
  score = score + num;
  let finalscore = document.getElementById("score");
  finalscore.innerText = score;
  localStorage.setItem("finalscore", score);
}
function func() {
  localStorage.clear();
}
