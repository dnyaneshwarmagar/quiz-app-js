document.addEventListener("DOMContentLoaded", async function () {
    let quizData;
    try {
        let response = await fetch('quiz-data.json');
        quizData = await response.json();
        console.log('quizData:', quizData)
    } catch (error) {
        console.log(error)
    }

    initSections()
    function initSections() {
        let sections = document.querySelectorAll(".section");

        sections.forEach((section) => {
            section.addEventListener("click", () => {
                let sectionNumber = parseInt(section.getAttribute('data-section'));
                startQuiz(sectionNumber)
            })
        })
    }

    function startQuiz(index) {
        const currentQuestions = quizData.sections[index].questions;
        let currentQuestionIndex = 0;
        let score = 0;
        let answerSelected = false;

        document.getElementById("quiz-container").style.display = "none";
        document.getElementById("question-container").style.display = "block"
        document.getElementById("question-container").innerHTML = `
        <p id="score">Score:0</p>
        <div id="question"></div>
        <div id="options"></div>
        <button id="next-button">Next</button>
        `;
        showQuestions();

        function showQuestions() {
            const question = currentQuestions[currentQuestionIndex];
            const questionElement = document.getElementById('question');
            const optionsElement = document.getElementById('options');

            questionElement.textContent = question.question;
            optionsElement.innerHTML = "";

            if (question.questionType === "mcq") {
                question.options.forEach((option, index) => {
                    const optionElement = document.createElement("div");
                    optionElement.textContent = option;

                    optionElement.addEventListener("click", () => {
                        if (!answerSelected) {
                            answerSelected = true;
                            optionElement.classList.add("selected");
                            checkAnswer(option, question.answer)
                        }
                    });
                    optionsElement.appendChild(optionElement)
                })
            } else {
                const inputElement = document.createElement("input");
                inputElement.type = question.questionType === "number" ? "number" : "text";
                const submitButton = document.createElement("button");
                submitButton.textContent = "Submit Answer";
                submitButton.className = "submit-answer";

                submitButton.addEventListener("click", () => {
                    if (!answerSelected) {
                        answerSelected = true;
                        console.log("text or number type input answer")
                        checkAnswer(inputElement.value.toString(), question.answer.toString());
                    }
                })

                optionsElement.appendChild(inputElement);
                optionsElement.appendChild(submitButton);
            }
        }

        function checkAnswer(givenAnswer, correctAnswer) {
            const feedbackElement = document.createElement("div");
            feedbackElement.id = "feedback";

            if (givenAnswer === correctAnswer || givenAnswer.toLowerCase() === correctAnswer.toLowerCase()) {
                score++;
                feedbackElement.textContent = "Correct!";
                feedbackElement.style.color = "green";
            }
            else {
                feedbackElement.textContent = `Wrong. Correct Answer: ${correctAnswer}`;
                feedbackElement.style.color = "red";
            }
            const optionsElement = document.getElementById("options");
            optionsElement.appendChild(feedbackElement);
            updateScore();
        }

        function updateScore() {
            document.getElementById("score").textContent = "Score: " + score;
            answerSelected = false;
        }

        document.getElementById("next-button").addEventListener("click", () => {
            if (currentQuestionIndex == currentQuestions.length-1) {
                console.log("Quiz is over");
                endQuiz();
            }
            else {
                currentQuestionIndex++;
                showQuestions();
            }
        });
        function endQuiz() {
            let questionContainer = document.getElementById("question-container");
            let quizContainer = document.getElementById("quiz-container");
            questionContainer.innerHTML = `
            <h1>Quiz Completed</h1>
            <p>Your Final Score: ${score}/${currentQuestions.length}</p>
            <button id="home-button">Go to home</button>
            `;
    
            document.getElementById("home-button").addEventListener("click", function () {
                quizContainer.style.display = "grid";
                questionContainer.style.display = "none";
            })
        }
    }


})