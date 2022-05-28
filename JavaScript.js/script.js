// Variables defined 
var startButton = $("#startbutton");
var game = $("#game");
var questEl = $('#question');
var answerOrdered = $("#answers");
var highScoreForm = $("#highscoreform");
var answerAlert = $("#answeralert");

var highScore;
var timeLeft;
var quizIndex;
var correctInput;
var incorrectInput;


// High scores from local storage
highScore = JSON.parse(localStorage.getItem("high-scores"));
if (highScore !== null) {
    for (i=0; i<8 && i<highScore.length; i++){
        let scoreList = $("<li>");
        scoreList.text(`${highScore[i].name}: ${highScore[i].score}`);
        $("#highscore").append(scoreList);
    };
}


// Set clock, remove button, and start 60 seconds, begin game
function gameInit() {
    highScore = JSON.parse(localStorage.getItem("high-scores"));
    correctInput = 0;
    incorrectInput = 0;
    quizIndex = 0;
    timeLeft = 60;
    startButton.css("display", "none");
    displayQuestion(quizObject[quizIndex]);
    timer();
}


// Function to display questions and correct answers
function displayQuestion(myObject) {

    questEl.text(myObject.question);

    let order = Math.round(Math.random() * 3);
    for (i=0; i<3; i++) {
        let answerTrue = $("<li>").addClass("li-answer");
        let answerWrong = $("<li>").addClass("li-answer");
       
        if (order === i && order < 3) {
            answerTrue.text(myObject.true);
            answerOrdered.append(answerTrue);
            answerWrong.text(myObject.wrong[i]);
            answerOrdered.append(answerWrong);
        }
        else if (order === 3 && i === 2) {
           
            answerWrong.text(myObject.wrong[i]);
            answerOrdered.append(answerWrong);
         
            answerTrue.text(myObject.true);
            answerOrdered.append(answerTrue);
        }
        else {
        
            answerWrong.text(myObject.wrong[i]);
            answerOrdered.append(answerWrong);
        }
    }
}


// Create the timer function and to have run smoothly
function timer() {
    game.text(`You have ${timeLeft} seconds left.`);
    var timeInterval = setInterval(function () {

        if (timeLeft > 0 && quizIndex !== quizObject.length){
            game.text(`You have ${timeLeft} seconds left.`);
            timeLeft--;
        }
        
        // Completed the questions or time has run out
        else if (timeLeft === 0 || quizIndex === quizObject.length) {

            // Top 10 High Schores to be listed
            if (highScore !== null) {
                if (highScore.length < 10 || correctInput > highScore[9].score) {
                    highScores();
                }
            }

            else if (highScore === null) {
                highScores();
            };

            questEl.text(`You earned ${correctInput} answers right and ${incorrectInput} answers wrong.`);
            answerOrdered.html('');
            answerAlert.text('');
            game.text('FINISHED');
            startButton.css("display", "block")
                .text('Try Again');
            quizIndex = 0;

            clearInterval(timeInterval);
        }
    },1000);
}

// Show the top ten highest scores
function highScores() {
    highScoreForm.show();
};

// Enter initials for high score
$("#highscoreform").on("click", "#highscorebutton", function (event) {
    event.preventDefault();
  
    let name = $("#initials").val();
    $("#initials").text('');
   
    let myScoreObject = {
        name: name,
        score: correctInput,
    };

    // If no high scores in local storage
    if (highScore === null) {
        highScore = [myScoreObject];
    }

    // Else if high scores in local storage
    else {
        let scoreIndex = highScore.length;
        
        for (let i = 0; i < scoreIndex; i++) {
            
            if (correctInput >= highScore[i].score) {
                highScore.splice(i, 0, myScoreObject);
                break;
            }
            else if (i === highScore.length - 1 && correctInput < highScore[i].score) {
                highScore.push(myScoreObject);
                break;
            }
        };
    };

    // store to local storage
    localStorage.clear();
    localStorage.setItem("high-scores", JSON.stringify(highS));
    highScoreForm.hide();
    
    $("#highscore").empty();
    for (i = 0; i < 8 && i < highS.length; i++) {
        let scoreList = $("<li>").css("text-decoration", "none");
        scoreList.text(`${highScore[i].name}: ${highScore[i].score}`);
        $("#highscore").append(scoreList);
    };
});

// Write an event listener for start button
// Start button will begin game
startButton.on("click", function(event) {
    let element = event.target;
    if (element.matches("button") === true) {
        // Initialize Game
        gameInit();
    }
})

// Write an event listener for answer selection
answerOrdered.on("click", function(event) {
    let element = event.target;
    if (element.matches("li") === true) {


        // Check the answer
        if (element.textContent === quizObject[quizIndex].true) {
            correctInput++;
            // Increment the quiz object index
            quizIndex++;
            // alert for correct answer
            answerAlert.text("Correct!");
        }
        else if (element.textContent !== quizObject[quizIndex].true) {
            incorrectInput++;
            // Increment the quiz object index
            quizIndex++;
            // Alert wrong answer
            answerAlert.text("Incorrect!");
            // Time subtracted off clock
            timeLeft -= 5;
        }

        // Move to the following question
        if (quizIndex < quizObject.length) {
            
            questEl.text('');
            
            answerOrdered.html('');
            displayQuestion(quizObject[quizIndex]);
        };
    };
});