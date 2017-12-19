var gameModule = (function () {
    const WIDTH_BLOCKS = 18;
    const HEIGHT_BLOCKS = 25;
    const GAME_INTERVAL = 180;

    /* game properties */
    var snake;
    var apple;
    var direction;
    var score;
    /* direction on screen */
    var currentDirection;

    var updateProperties = function () {
        blockSize = Math.min(window.innerWidth / (WIDTH_BLOCKS + 1), window.innerHeight / (HEIGHT_BLOCKS + 1));
        width = WIDTH_BLOCKS * blockSize;
        height = HEIGHT_BLOCKS * blockSize;
        canvas.width = width;
        canvas.height = height;
        canvas.style.marginLeft = (window.innerWidth - width) / 2 + PX;
        score = 0;
        snake = [];
        direction = DIRECTION_RIGHT;
        currentDirection = direction;
    };

    var game = function () {
        var snakeX = snake[0].x;
        var snakeY = snake[0].y;

        switch (direction) {
            case DIRECTION_RIGHT:
                snakeX++;
                break;
            case DIRECTION_LEFT:
                snakeX--;
                break;
            case DIRECTION_DOWN:
                snakeY++;
                break;
            case DIRECTION_UP:
                snakeY--;
                break;
        }

        if (snakeX === -1 || snakeY === -1 || (snakeX * blockSize) === width || (snakeY * blockSize) === height
            || checkCrash(snakeX, snakeY)) {
            document.getElementById("startView").style.display = "inline";
            canvas.style.display = "none";
            gameloop = clearInterval(gameloop);
            return;
        }

        snake.unshift({x: snakeX, y: snakeY});

        if (snakeX === apple.x && snakeY === apple.y) {
            score++;
            drawModule.drawScore(score);
            generateApple();
        } else {
            var last = snake.pop();
            drawModule.drawBlock(last.x, last.y);
        }

        drawModule.drawSnakeBlock(snakeX, snakeY, SNAKE_BLOCK_TYPE_HEAD);
        drawModule.drawSnakeBlock(snake[1].x, snake[1].y, SNAKE_BLOCK_TYPE_BODY);
        currentDirection = direction;

        drawModule.drawApple(apple.x, apple.y);
    };

    var checkCrash = function (x, y) {
        for (var i in snake) {
            if (snake[i].x === x && snake[i].y === y) {
                return true;
            }
        }
        return false;
    };

    var createSnake = function () {
        var length = 3;
        for (var i = length - 1; i >= 0; i--) {
            snake.push({x: i, y: 0});
        }
    };

    var getRandomInt = function (min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    };

    var generateApple = function () {
        apple = {
            x: getRandomInt(0, width / blockSize),
            y: getRandomInt(0, height / blockSize)
        };

        while (checkCrash(apple.x, apple.y)) {
            apple = {
                x: getRandomInt(0, width / blockSize),
                y: getRandomInt(0, height / blockSize)
            };
        }
    };

    var setDirection = function (newDirection) {
        direction = newDirection;
    };

    var getCurrentDirection = function () {
        return currentDirection;
    };

    var start = function () {
        updateProperties();
        createSnake();
        generateApple();
        drawModule.drawGameField();
        drawModule.drawScore(score);
        gameloop = setInterval(game, GAME_INTERVAL);
    };

    return {
        start: start,
        setDirection: setDirection,
        getCurrentDirection: getCurrentDirection
    };
}());