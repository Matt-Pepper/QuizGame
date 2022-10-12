const quizTemplate = document.getElementById("quizTemplate");
const quiz = document.getElementById("quiz");
const correctP = document.getElementById("correct");
const questions = [];
const score = [0, 0];
const buttonFunctions = [];

const questionFactory = (obj) => {
	questions.push({
		difficulty: obj.difficulty,
		question: obj.question,
		correct: obj.correct_answer,
		wrong: obj.incorrect_answers,
	});
};

const getQuiz = () => {
	fetch("https://opentdb.com/api.php?amount=20&category=9&type=multiple")
		.then((response) => response.json())
		.then((data) => fillQuiz(data))
		.finally(() => nextQuestion());
};

const fillQuiz = (obj) => {
	for (const result of obj.results) {
		questionFactory(result);
	}
};

const nextQuestion = () => {
	const question = questions.shift();
	const answers = [question.correct, ...question.wrong].sort();
	quiz.querySelector(".question").innerHTML = `Question ${score[1] + 1}: <br/> ${
		question.question
	}`;
	quiz.querySelector(".difficulty").innerHTML = `Difficulty: ${question.difficulty}`;
	quiz.querySelector(".answer__one").innerHTML = answers[0];
	quiz.querySelector(".answer__two").innerHTML = answers[1];
	quiz.querySelector(".answer__three").innerHTML = answers[2];
	quiz.querySelector(".answer__four").innerHTML = answers[3];
	document.getElementById("score").innerHTML = `Your score is ${score[0]} out of ${score[1]}`;

	applyFunctionsToButtons(question, answers);
};

const applyFunctionsToButtons = (question) => {
	const buttons = document.querySelectorAll(".answer");
	for (let i = 0; i < buttons.length; i++) {
		buttonFunctions.push(() => getAnswer(question, buttons[i]));
		buttons[i].addEventListener("click", buttonFunctions[i]);
	}
	buttons[0];
};

getQuiz();

const getAnswer = (question, element) => {
	if (element.innerHTML === question.correct) {
		correctP.innerHTML = `${question.correct} was the correct answer!`;
		score[0]++;
		score[1]++;
	} else {
		correctP.innerHTML = `The correct answer was: ${question.correct}`;
		score[1]++;
	}
	removeFunctions();
	if (questions.length) {
		nextQuestion();
	} else {
		getQuiz();
	}
};

const removeFunctions = () => {
	const buttons = document.querySelectorAll(".answer");
	while (buttonFunctions.length > 0) {
		for (const button of buttons) {
			button.removeEventListener("click", buttonFunctions.shift());
		}
	}
};
