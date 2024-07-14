//Define HTML elemets
const board = document.getElementById("game-board");
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');

//Define game variables
const gridSize = 20;
let snake = [{x: 10,y: 10}];//Object //To start the snake at row 10th and column 10th i.e., in middle
//Dram game map, snake,food
let food = generateFood(); //as we have to generate food in a random position
let highScore = 0;
let direction = "right";
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;
function draw() {
    board.innerHTML = ''; //to reset the board when ever we draw
    drawSnake();
    drawFood();
    updateScore();

}
function drawSnake() {
    snake.forEach((segment) => {
        const snakeElement = createGameElement('div','snake'); //creating a div with class=snake 
        setPostion(snakeElement,segment);
        board.appendChild(snakeElement);
    })
}

function createGameElement(tag,className) {
    const element = document.createElement(tag); //it creates a tag of div.
    element.className = className;//Here in element.className - className is a predefined element to create a class.
    return element;
}

//Set the position of snake or food
function setPostion(element,position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

//Testing draw fucntion
// draw()

//Create food
function drawFood() {
    if (gameStarted) {
        const foodElement = createGameElement('div','food');
        setPostion(foodElement,food);
        board.appendChild(foodElement);
    }
}

//Generate Food
function generateFood() {
    const x = Math.floor(Math.random() * gridSize) + 1;
    const y = Math.floor(Math.random() * gridSize) + 1;
    return {x,y};
}

//Moving the snake
function move() {
    const head = {...snake[0]};//creates a copy of original snake variable
    switch (direction) {
        case "up":
            head.y--;
            break;
        case "down":
            head.y++;
            break;
        case "left":
            head.x--;
            break;
        case "right":
            head.x++;
            break;
    }
    snake.unshift(head);//adds the head element at the beginning of the snake, like according to the direction the head is going to get added in the snake object  
    // snake = [ {x: 10,y: 9},{x: 10,y: 10}]
    // snake.pop();  //inorder to create an illusion of snake moving adding the head and removing the last element
    if (head.x === food.x && head.y === food.y) {
        food = generateFood();
        increaseSpeed();
        clearInterval(gameInterval);//clear past interval
        gameInterval = setInterval(() => {
            move();
            checkCollision();
            draw();
        },gameSpeedDelay) //when the snake eats food we should decrease the delay to increase the game speed
    }
    else {
        snake.pop(); //if the food  is not is the same postion as snake head then it moves or else it increases 
    }

}

//test moving
// setInterval(() => {
//     move() //Move first
//     draw() //then draw again new position
// },200)


//start game function

function startGame() {
    gameStarted = true; // Keep track of a running game
    instructionText.style.display = 'none';
    logo.style.display = 'none';
    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    },gameSpeedDelay);
}

// Keypress event listener
function handleKeyPress(event) {
    if (
        (!gameStarted && event.code === 'Space') ||
        (!gameStarted && event.key === ' ')
    ) {
        startGame();
    } else {
        switch (event.key) {
            case "ArrowUp":
                direction = "up";
                break;
            case "ArrowDown":
                direction = "down";
                break;
            case "ArrowLeft":
                direction = "left";
                break;
            case "ArrowRight":
                direction = "right";
                break;
        }
    }
}
document.addEventListener('keydown',handleKeyPress);

function increaseSpeed() {
    //   console.log(gameSpeedDelay);
    if (gameSpeedDelay > 150) {
        gameSpeedDelay -= 5;
    } else if (gameSpeedDelay > 100) {
        gameSpeedDelay -= 3;
    } else if (gameSpeedDelay > 50) {
        gameSpeedDelay -= 2;
    } else if (gameSpeedDelay > 25) {
        gameSpeedDelay -= 1;
    }
}

function checkCollision() {
    const head = snake[0];

    if (head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize) { //when the snake hits the border reset the game
        resetGame();
    }

    //when the snake hits itself
    for (let i = 1;i < snake.length;i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            resetGame();
        }
    }
}

function resetGame() {
    updateHighScore();
    stopGame();
    snake = [{x: 10,y: 10}];
    food = generateFood();
    direction = 'right';
    gameSpeedDelay = 200;
    updateScore();
}

function updateScore() {
    const currentScore = snake.length - 1;
    score.textContent = currentScore.toString().padStart(3,'0');
}

function stopGame() {
    clearInterval(gameInterval);
    gameStarted = false;
    instructionText.style.display = 'block';
    logo.style.display = 'block';
}

function updateHighScore() {
    const currentScore = snake.length - 1;
    if (currentScore > highScore) {
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3,'0'); //to add zeros to the front if the score is not 3 digits
    }
    highScoreText.style.display = 'block';
}
