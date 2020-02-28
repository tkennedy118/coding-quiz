
$(document).ready(function() {

    let score = 0;
    let currentQ = 0;
    let currentA = 0;
    let wasCorrect = false;
    let userAnsId = "";             // the html element id of the answer selected by user
    const questions = [
        {
            question: "How would you create a variable that is a random number from 1-10?",
            a1: "var random = Math.random(1-10);",
            a2: "var random = Math.floor.Math.random() * 10;",
            a3: "var random = Math.floor(Math.random() * 10 + 1);",
            a4: "var random = Math.random(Math.floor() * 10 + 1);",
            answer: "a3"
        },
        {
            question: "Inside which HTML element would you put JavaScript?",
            a1: "<js>",
            a2: "<script>",
            a3: "<scripting>",
            a4: "<javascript>",
            answer: "a2"
        }
    ];


    /* FUNCTIONS ====================================================================================================*/

    // function to reset all values
    const init = function() {
        score = 0;
        currentQ = 0;
        wasCorrect = false;
    }

    // function to display questions
    const loadQuestion = function() {
        
        let quest = questions[currentQ];
        
        // if first question, hide all other screens and display question screen
        if (currentQ === 0) {
            $("#initial-screen").addClass("d-none");
            $("#question-screen").removeClass("d-none");
        }

        $("#question").html(quest.question);
        $("#q1-label").text(quest.a1);
        $("#q2-label").text(quest.a2);
        $("#q3-label").text(quest.a3);
        $("#q4-label").text(quest.a4);
    }

    // update score and global values
    const updateScore = function() {
        
        let selected = false;                       // whether or not a radio button was selected
        let correctAns = questions[currentQ].answer;  // correct answer of current question

        // check if a radio button was selected
        for (var i = 0; i < 4; i++) {
            var currId = "answer" + (i+1).toString();
            var answer = $("input[id='" + currId + "']:checked").val();

            if (answer === "on") {
                selected = true;
                userAnsId = currId;
            }
        }

        // do nothing if no answer is selected
        if (!selected) {
            return false;
        }
        
        // if selected answer was correct, add to score
        if ((correctAns === "a1" && userAnsId === "answer1") || (correctAns === "a2" && userAnsId === "answer2") ||
            (correctAns === "a3" && userAnsId === "answer3") || (correctAns === "a4" && userAnsId === "answer4")) {
            
            // add to score
            score += 20;
            wasCorrect = true;

        } else {
            // user was wrong
            wasCorrect = false;
        }
    }

    const displayResults = function() {

        // display user score. NOTE: ONLY WORKS WHEN THERE ARE ONLY 5 QUESTIONS
        let userScore = score + "%";
        $("#user-score").html(userScore);
    }

    /* EVENT HANDLERS =============================================================================================== */

    $("#btn-start").on("click", function() {
        init();
        loadQuestion()
    });

    $("#btn-next").on("click", function() {

        let wasSelected = updateScore();

        // return if no answer was selected
        if (wasSelected === false) {
            return;
        }

        // if there is another question, go to it
        if ((currentQ + 1) < questions.length) {
            
            currentQ++;
            loadQuestion();

            // clear radio button
            $("#" + userAnsId).prop("checked", false);

        } 
        // there are no more questions, hide question screen and display results screen
        else {
            $("#question-screen").addClass("d-none");
            $("#results-screen").removeClass("d-none");
            displayResults();
        }
    });

    $("btn-restart").on("click", function() {
        init();
        loadQuestion();
    });
})