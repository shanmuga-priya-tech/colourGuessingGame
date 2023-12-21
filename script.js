"use strict";

const color = document.querySelector(".colour");
const word = document.querySelector(".jumbled_words");
const message = document.querySelector(".message");
const result = document.querySelector(".result");
const currentScore = document.querySelector(".score");
const highScoreEl = document.querySelector(".highscore");
const playAgain = document.querySelector(".btn");
const timerEl = document.querySelector(".timer");

let score = 0;
let  highScore = 0 ;

/**********************************************************************************/

//generating random color and changing the color continously
const colorMap = new Map([
    ["red", "edr"],
    ["blue", "eubl"],
    ["green", "gerne"],
    ["yellow", "owlyel"],
    ["orange", "groane"],
    ["purple", "epplur"],
    ["pink", "knip"],
    ["brown", "rnowb"],
    ["gray", "yarg"],
    ["white","ihtwe"]
]);

/****************************************************************************************/

//generating the random jumbled word color
const generateRandomWord = function(){
    const colorMapEntries = [...colorMap.entries()];
    const randomIndex = Math.floor(Math.random ()*colorMapEntries.length);
    return colorMapEntries[randomIndex];
   
}

//displaying random colorname to dom
const displayRandomColor = function(){
    const [correctColor,jumbledwords] = [...generateRandomWord()]
    word.textContent = jumbledwords;
    word.setAttribute("correct-color",correctColor);
}
displayRandomColor();

/****************************************************************************/

//displaying random color in circle
const circleColor =[... colorMap.keys()]
let currIndex = 0;

const changeColor = function (){
    if (score <0) {
        // Stop the interval when the score becomes 0 or less
        clearInterval(interval);
        currentScore.textContent = 0;
        displayMessage("you lost the game ☹️☹️")

        return;
    }
    
    color.style.backgroundColor = circleColor[currIndex] ;
    color.setAttribute("currentColor",circleColor[currIndex]);
    currIndex = (currIndex+1) % circleColor.length; //6+1%7 = 0 it keeps the index within range
};

/*******************************************************************************/

//sound effect when timer ends
const sound = new Audio("alaram.wav");

//implement timer
const calcTimer = function () {
    //set time to 1 minutes
  let time = 60; 
  //call the timer for every 1 second
  const timer = setInterval(function(){
        const min = String(Math.trunc(time / 60)).padStart(2,0);
        const sec= String(Math.trunc(time % 60)).padStart(2,0);
    
        //modify the dom
        timerEl.textContent = `Timer: ${min}:${sec}` ;

            //if timer ends check for the currentscore n highscore if its greater than highscore update highscore
            if (time === 0 ){
                //play alarm sound
                sound.play();

                clearInterval(timer);
                if (score > highScore) {
                    highScore = score;
                    highScoreEl.textContent = highScore;
                }
                displayBackground("rgb(255, 120, 71)");
                displayMessage("Time Over ⏰");
                clearInterval(interval);
            }
        //decresetime for every 1 sec
        time--;
    },1000);
  return timer;
}

let timer;

timer = calcTimer();

/**********************************************************************************/

const displayMessage = function (msg) {
    message.textContent = msg;
};

const displayBackground = function(bc){
    document.body.style.backgroundColor =  bc;
};

const updateTextStyle = function(clr){
    result.style.color = clr;
    result.textContent = clr;
};


let interval;
const correct = new Audio("correct.mp3");
const wrong = new Audio("wrong.mp3");

//implementing the game logic

color.addEventListener("click",function(){

    if(score>=0){
        const correctness = color.getAttribute("currentColor") === word.getAttribute("correct-color");
        
        correctness ? correct.play() : wrong.play();
        correctness ? displayMessage("Correct 🥳"): displayMessage("wrong ☹️");
        correctness ? displayBackground("rgb(0, 42, 113)"): displayBackground("#292929");
        correctness ? updateTextStyle(word.getAttribute("correct-color")): updateTextStyle(color.getAttribute("currentColor"));
        correctness ? score ++ : score --;
    }
    displayRandomColor();
    currentScore.textContent = score;
});
//changing the color of the circle for every 1 sec
interval = setInterval(changeColor,1000)

/************************************************************************************/

playAgain.addEventListener("click",function(){

    //resetting every value
    score = 0;
    displayMessage("start guessing ...");
    word.textContent = "color";
    result.textContent = "";
    currentScore.textContent = score ;

    displayBackground("#292929");

    // Clear the existing interval
    clearInterval(interval);

    // Clear the timer
    if(timer) clearInterval(timer);

    // Start a new color change interval
    interval = setInterval(changeColor, 1000);

    // Start a new timer
    timer = calcTimer();

    displayRandomColor();

})
