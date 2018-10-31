
var stageAry = [
    [0, 0, 1, 5],
    [0, 0, 3, 3],
    [0, 2, 0, 0],
    [4, 0, 0, 0]
];

var orgStage = JSON.parse(JSON.stringify(stageAry));

var winWidth = window.innerWidth;
var winHeight = window.innerHeight;

var stageRangeWidth = Math.min(winWidth, winHeight) * 0.7;
var stageRangeHeight = stageRangeWidth;

var outStageWidth = winWidth - stageRangeWidth;
var outStageHeight = 50;

var stageWidth = 4;
var stageHeight = 4;
var stagePanelWidth = stageRangeWidth / stageWidth;
var stagePanelHeight = stageRangeHeight / stageHeight;
var panelImageWidth = 48;
var panelImageHeight = 48;
var stagePanel = new Array();
var gunmaIndexX = 0;
var gunmaIndexY = 0;
var goalIndexX = 0;
var goalIndexY = 0;

var comList = new Array();

enchant();

var moveCheck = function (x, y, moveX, moveY) {
    if (y + moveY < 0 || x + moveX < 0) return false;
    if (y + moveY >= stageHeight || x + moveX >= stageWidth) return false;
    if (stageAry[y + moveY][x + moveX] == 1 || stageAry[y + moveY][x + moveX] == 3) {
        return false;
    } else if (stageAry[y + moveY][x + moveX] == 2) {
        if (y + moveY * 2 < 0 || x + moveX * 2 < 0) return false;
        if (y + moveY * 2 >= stageHeight || x + moveX * 2 >= stageWidth) return false;
        if (stageAry[y + moveY * 2][x + moveX * 2] == 2 || stageAry[y + moveY * 2][x + moveX * 2] == 3) {
            return false;
        }
    }
    return true;
};

var moveGunma = function (x, y, moveX, moveY) {
    if (!moveCheck(x, y, moveX, moveY)) return false;
    if (stageAry[y + moveY][x + moveX] == 2) {
        if (stageAry[y + moveY * 2][x + moveX * 2] == 1) {
            stageAry[y + moveY * 2][x + moveX * 2] = 0;
        } else {
            stageAry[y + moveY * 2][x + moveX * 2] = 2;
        }
        updateStage(x + moveX * 2, y + moveY * 2);
    }
    stageAry[y + moveY][x + moveX] = 0;
    updateStage(x + moveX, y + moveY);
    return true;
}


var updateStage = function (x, y) {
    var index = x + y * stageHeight;
    stagePanel[index].frame = stageAry[y][x];
}

window.onload = function () {
    var game_ = new Game(winWidth, winHeight);
    game_.fps = 24;

    game_.preload('./img/arrow.png', './img/testImg.png', './img/chara1.png', './img/chara3.png', './img/map1.png', './img/start.png', './img/clear.png');
    game_.onload = function () {
        /**
        * start scene
        */
        var createStartScene = function () {
            stageAry = JSON.parse(JSON.stringify(orgStage));
            var scene = new Scene();
            scene.backgroundColor = '#fcc800';

            var startImage = new Sprite(236, 48);
            startImage.image = game_.assets['./img/start.png'];
            startImage.x = 42;
            startImage.y = 136;
            scene.addChild(startImage);

            var title = new Label('ぐんまちゃん');
            title.textAlign = 'center';
            title.color = '#ffffff';
            title.x = 0;
            title.y = 96;
            title.font = '28px sans-serif';
            scene.addChild(title);

            var subTitle = new Label('- アルゴリズムを学ぼう -');
            subTitle.textAlign = 'center';
            title.x = 0;
            subTitle.y = 196;
            subTitle.font = '14px sans-serif';
            scene.addChild(subTitle);

            startImage.addEventListener(Event.TOUCH_START, function (e) {
                game_.replaceScene(createGameScene());
            });

            return scene;
        };
        /**
        * game Scene
        */
        var createGameScene = function () {
            var scene = new Scene();
            scene.backgroundColor = '#fcc8f0';

            var score = 0;

            var label = new Label('移動回数： ' + score + '回');
            label.font = '14px sans-serif';
            scene.addChild(label);


            var comArrow = new Label("");
            comArrow.font = '20px sans-serif';
            comArrow.x = 0;
            comArrow.y = winHeight - 25;
            scene.addChild(comArrow);

            for (var indexY = 0; indexY < stageHeight; indexY++) {//stage
                for (var indexX = 0; indexX < stageWidth; indexX++) {

                    var index = indexX + indexY * stageHeight;

                    stagePanel[index] = new Sprite(panelImageWidth, panelImageHeight);
                    stagePanel[index].image = game_.assets['./img/testImg.png'];
                    stagePanel[index].frame = stageAry[indexY][indexX];
                    stagePanel[index].x = outStageWidth / 2 + indexX * stagePanelWidth;
                    stagePanel[index].y = outStageHeight + indexY * stagePanelHeight;
                    stagePanel[index].scale(stagePanelWidth / panelImageWidth, stagePanelHeight / panelImageHeight);


                    if (stageAry[indexY][indexX] == 4) {
                        gunmaIndexX = indexX;
                        gunmaIndexY = indexY;
                    } else if (stageAry[indexY][indexX] == 5) {
                        goalIndexX = indexX;
                        goalIndexY = indexY;
                    }

                    scene.addChild(stagePanel[index]);
                }
            }


            var gunma = new Sprite(panelImageWidth, panelImageHeight);
            gunma.image = game_.assets['./img/testImg.png'];
            gunma.x = outStageWidth / 2 + gunmaIndexX * stagePanelWidth;
            gunma.y = outStageHeight + gunmaIndexY * stagePanelHeight;
            gunma.frame = 6;
            gunma.scale(stagePanelWidth / panelImageWidth, stagePanelHeight / panelImageHeight);

            scene.addChild(gunma);
            var gunmaSpeedX = 0;
            var gunmaSpeedY = 0;

            var arrow = new Array();

            for (var index = 0; index < 4; index++) {

                arrow[index] = new Sprite(panelImageWidth, panelImageHeight);
                arrow[index].image = game_.assets['./img/arrow.png'];
                arrow[index].frame = index;
                arrow[index].x = outStageWidth / 2 + index * stagePanelWidth;
                arrow[index].y = outStageHeight + stagePanelHeight * stageHeight + 5;
                arrow[index].scale(stagePanelWidth / panelImageWidth, stagePanelHeight / panelImageHeight);

                scene.addChild(arrow[index]);
                arrow[index].addEventListener('touchstart', function () {
                    var index = Math.round((this.x - outStageWidth / 2) / stagePanelWidth);
                    var indexChar = ['←', '↑', '→', '↓'];
                    comArrow.text = comArrow.text + indexChar[index];
                    comList.push(index);
                }, false);

            }

            var backArrow = new Sprite(panelImageWidth, panelImageHeight);
            backArrow.image = game_.assets['./img/arrow.png'];
            backArrow.x = 0
            backArrow.y = 0;
            backArrow.frame = 0;
            backArrow.scale(1, 1);

            scene.addChild(backArrow);
            backArrow.addEventListener('touchstart', function () {
                stageAry = JSON.parse(JSON.stringify(orgStage));
                for (var indexY = 0; indexY < stageHeight; indexY++) {//stage
                    for (var indexX = 0; indexX < stageWidth; indexX++) {

                        var index = indexX + indexY * stageHeight;
                        stagePanel[index].frame = stageAry[indexY][indexX];
                        if (stageAry[indexY][indexX] == 4) {
                            gunmaIndexX = indexX;
                            gunmaIndexY = indexY;
                            gunma.x = outStageWidth / 2 + gunmaIndexX * stagePanelWidth;
                            gunma.y = outStageHeight + gunmaIndexY * stagePanelHeight;
                        }

                    }
                }

            }, false);

            var goButton = new Sprite(panelImageWidth, panelImageHeight);
            goButton.image = game_.assets['./img/testImg.png'];
            goButton.x = 0;
            goButton.y = 50;
            goButton.frame = 0;
            goButton.scale(1, 1);

            scene.addChild(goButton);
            goButton.addEventListener('touchstart', function () {

                for (var i = 0; i < comList.length; i++) {
                    var index = comList[i];
                    if (gunmaSpeedX == 0 && gunmaSpeedY == 0) {
                        if (index % 2 == 0) {
                            gunmaSpeedX = stagePanelWidth;
                            if (index == 0) gunmaSpeedX *= -1;
                        } else {
                            gunmaSpeedY = stagePanelHeight;
                            if (index == 1) gunmaSpeedY *= -1;
                        }
                    }
                    if (gunmaSpeedX != 0) {
                        var moveX = gunmaSpeedX / Math.abs(gunmaSpeedX);
                        if (moveGunma(gunmaIndexX, gunmaIndexY, moveX, 0)) {
                            gunma.x += gunmaSpeedX;
                            gunmaIndexX += moveX;
                            score++;
                            label.text = '移動回数： ' + score + '回';
                        }

                    } else if (gunmaSpeedY != 0) {
                        var moveY = gunmaSpeedY / Math.abs(gunmaSpeedY);
                        if (moveGunma(gunmaIndexX, gunmaIndexY, 0, moveY)) {
                            gunma.y += gunmaSpeedY;
                            gunmaIndexY += moveY;
                            score++;
                            label.text = '移動回数： ' + score + '回';
                        }
                    }
                    gunmaSpeedX = 0;
                    gunmaSpeedY = 0;
                    if (gunmaIndexX == goalIndexX && gunmaIndexY == goalIndexY) game_.replaceScene(createGameoverScene(score));

                }

            }, false);


            return scene;
        };
        /**
        * gameclear scene
        */
        var createGameoverScene = function (resultScore) {
            var scene = new Scene();
            scene.backgroundColor = '#303030';

            var gameoverImage = new Sprite(267, 48);
            gameoverImage.image = game_.assets['./img/clear.png'];
            gameoverImage.x = 40;
            gameoverImage.y = 112;
            scene.addChild(gameoverImage);

            var label = new Label(resultScore + '回移動した！');
            label.textAlign = 'center';
            label.color = '#fff';
            label.x = 0;
            label.y = 60;
            label.font = '40px sans-serif';
            scene.addChild(label);

            var retryLabel = new Label('もう一度遊ぶ');
            retryLabel.color = '#fff';
            retryLabel.x = 0;
            retryLabel.y = 300;
            retryLabel.font = '20px sans-serif';
            scene.addChild(retryLabel);

            retryLabel.addEventListener(Event.TOUCH_START, function (e) {
                game_.replaceScene(createStartScene());
            });
            return scene;
        };
        game_.replaceScene(createStartScene());
    }

    game_.start();
};
