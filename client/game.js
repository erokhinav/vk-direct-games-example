let gameModule = (function () {
    const WIDTH_BLOCKS = 18;
    const HEIGHT_BLOCKS = 25;
    const GAME_INTERVAL = 180;
    const INITIAL_SNAKE_LENGTH = 3;
    const APP_URL = "https://vk.com/app6294082";
    const APP_SHARE_PHOTO_LINK = "photo-157932916_456239017";

    /* game properties */
    let snake;
    let apple;
    let direction;
    /* direction on screen */
    let currentDirection;

    function initProperties () {
        blockSize = Math.min(window.innerWidth / (WIDTH_BLOCKS + 1),
            (window.innerHeight - SCORE_SIZE) / (HEIGHT_BLOCKS + 1));
        width = WIDTH_BLOCKS * blockSize;
        height = HEIGHT_BLOCKS * blockSize;
        canvas.width = width;
        canvas.height = height;
        score = 0;
        snake = [];
        direction = DIRECTION_RIGHT;
        currentDirection = direction;
    }

    function game () {
        let snakeX = snake[0].x;
        let snakeY = snake[0].y;

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
            || checkSnakeCollision(snakeX, snakeY)) {
            renderModule.onCollisionDisplayElements();
            saveResult();
            gameloop = clearInterval(gameloop);
            return;
        }

        snake.unshift({x: snakeX, y: snakeY});

        if (snakeX === apple.x && snakeY === apple.y) {
            // alert('score was increased');
            score++;
            renderModule.drawScore();
            generateApple();
        } else {
            let last = snake.pop();
            renderModule.drawCleaningBlock(last.x, last.y);
        }

        renderModule.drawSnakeBlock(snakeX, snakeY);
        renderModule.drawSnakeBlock(snake[1].x, snake[1].y);
        currentDirection = direction;

        renderModule.drawApple(apple.x, apple.y);
    }

    function saveResult () {
        // VK.callMethod("showShareBox", APP_URL, APP_SHARE_PHOTO_LINK, "im");
        submitScore(score);
        VK.callMethod("showLeaderboardBox", score);
    }

    function checkSnakeCollision (x, y) {
        for (let i in snake) {
            if (snake[i].x === x && snake[i].y === y) {
                return true;
            }
        }
        return false;
    }

    function createSnake () {
        for (let i = INITIAL_SNAKE_LENGTH - 1; i >= 0; i--) {
            snake.push({x: i, y: 0});
        }
    }

    function getRandomInt (min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    function generateApple () {
        apple = {
            x: getRandomInt(0, width / blockSize),
            y: getRandomInt(0, height / blockSize)
        };

        while (checkSnakeCollision(apple.x, apple.y)) {
            apple = {
                x: getRandomInt(0, width / blockSize),
                y: getRandomInt(0, height / blockSize)
            };
        }
    }

    function setDirection (newDirection) {
        direction = newDirection;
    }

    function getCurrentDirection () {
        return currentDirection;
    }

    function start () {
        initProperties();
        createSnake();
        generateApple();
        renderModule.drawGameField();
        renderModule.drawScore();
        gameloop = setInterval(game, GAME_INTERVAL);
    }

    return {
        start: start,
        setDirection: setDirection,
        getCurrentDirection: getCurrentDirection
    };
}());
