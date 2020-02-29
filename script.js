
$(document).ready(function() {

    var interval;                   // used to set and clear timer
    let score = 0;                  // number of correctly answered questions
    let currentQ = 0;               // used to store the current question in the quesitons array
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
        },
        {
            question: "Which of the following type of variables is visible everywhere in your JavaScript code?",
            a1: "global variable",
            a2: "local variable",
            a3: "document variable",
            a4: "all of the above",
            answer: "a1"
        },
        {
            question: "Which of the following functions of an array object adds one or more elements to the end of an array and returns the new length of the array?",
            a1: "pop()",
            a2: "join()",
            a3: "map()",
            a4: "push()",
            answer: "a4"
        },
        {
            question: "How would you create a variable and set it to an html element with id=\"btn-blue\"?",
            a1: "var buttonEl = html(\".btn-blue\");",
            a2: "var buttonEl = getElementByName(\"#btn-blue\");",
            a3: "var buttonEl = querySelectorAll(\".btn-blue\");",
            a4: "var buttonEl = querySelector(\"#btn-blue\");",
            answer: "a4"
        }
    ];


    /* FUNCTIONS ====================================================================================================*/

    // function to reset all values
    const init = function() {
        score = 0;
        currentQ = 0;
        wasCorrect = false;

        $("#initial-screen").removeClass("d-none");
        $("#timer-screen").addClass("d-none");
        $("#question-screen").addClass("d-none");
        $("#results-screen").addClass("d-none");
        $("#scores-screen").addClass("d-none");
    }

    // function to display questions
    const loadQuestion = function() {
        
        let quest = questions[currentQ];
        
        // if first question, hide all other screens and display question screen
        if (currentQ === 0) {
            $("#initial-screen").addClass("d-none");
            $("#timer-screen").removeClass("d-none");
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
        
        let selected = false;                           // whether or not a radio button was selected
        let correctAns = questions[currentQ].answer;    // correct answer of current question

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
            score += 1;
            wasCorrect = true;

        } else {
            // user was wrong
            wasCorrect = false;
        }
    }

    // function to handle the timer
    const startTimer = function() {

        let time = 59;

        interval = setInterval(function() {

            $("#timer").html(time);
            time--;

            if(time === 0) {

                clearInterval(interval);
                updateScore();
                displayResults();
            }
        }, 1000);
    }

    const displayResults = function() {

        // show correct screens
        $("#question-screen").addClass("d-none");
        $("#timer-screen").addClass("d-none");
        $("#results-screen").removeClass("d-none");

        // clear timer
        clearInterval(interval);

        // display user score. NOTE: ONLY WORKS WHEN THERE ARE ONLY 5 QUESTIONS
        console.log("score: " + score + ", number of questions: " + questions.length);
        let userScore = ((score/questions.length) * 100).toFixed(0) + "%";
        console.log(userScore);
        $("#user-score").html(userScore);
    }

    const displayScores = function() {

        // clears list if previously displayed
        $("#score-list").empty();

        // loop through local storage
        for (var i = 0; i < localStorage.length; i++) {
            
            // get info
            var li = $("<li></li>");
            var key = localStorage.key(i);
            var storedScore = (localStorage.getItem(key))

            // add info
            li.addClass("list-group-item");
            li.html(key + ": " + ((storedScore/questions.length) * 100).toFixed(0) + "%");

            $("#score-list").append(li);
        }
    }

    /* EVENT HANDLERS =============================================================================================== */

    $("#btn-start").on("click", function() {
        init();
        startTimer();
        loadQuestion()
    });

    $("#btn-next").on("click", function() {

        // update score
        let wasSelected = updateScore();

        // clear radio button
        $("#" + userAnsId).prop("checked", false);

        // return if no answer was selected
        if (wasSelected === false) {
            return;
        }

        // if there is another question, go to it
        if ((currentQ + 1) < questions.length) {
            
            currentQ++;
            loadQuestion();
        } 
        // there are no more questions
        else {
            displayResults();
        }
    });

    $(".btn-restart").on("click", init);

    $("#btn-add-score").on("click", function() {

        // get user input and local storage
        let initials = $("#user-initials").val().toUpperCase();
        let storedScore = localStorage.getItem(initials);

        // exit function if user initials not entered properly
        if (initials.length < 3 || initials === "   ") {
            return false;
        }

        // hide 'results-screen' and display 'scores-screen'
        $("#results-screen").addClass("d-none");
        $("#scores-screen").removeClass("d-none");

        // check if user initials already exist in local storage
        if (initials !== null) {
            // matching initals were found

            // only replace score if it is better
            if (score > storedScore) {
                localStorage.setItem(initials, score)
            }

        } else {
            // add score if no matching initials were found
            localStorage.setItem(initials, score)
        }

        displayScores();
    });
})