
var stageAry = [
    [0, 0, 1, 6],
    [0, 0, 1, 5],
    [0, 2, 3, 3],
    [4, 0, 0, 0]
];

var selectName = ["群馬県庁", "赤城山", "浅間山", "榛名山", "妙義山", "富岡製糸場"];



var stageStartPanel = 4;
var stageGoalPanel = 5;
var stageRockPanel = 2;
var stageHolePanel = 1;
var stageWallPanel = 3;
var stageFloorPanel = 0;

var orgStage = JSON.parse(JSON.stringify(stageAry));

var winWidth = window.innerWidth;
var winHeight = window.innerHeight;

//----------------
var stageRangeWidth = Math.min(winWidth, winHeight) * 0.7;
var stageRangeHeight = stageRangeWidth;

var outStageWidth = winWidth - stageRangeWidth;
var outStageHeight = 50;

var startScene_backgroundColor = '#fcc800';

var startImage_sizeX = 236;
var startImage_sizeY = 48;
var startImage_posX = 42;
var startImage_posY = 136;

var title_text = 'ぐんまちゃん';
var title_textAlign = 'center';
var title_color = '#ffffff';
var title_posX = 0;
var title_posY = 96;
var title_font = '28px sans-serif';

var subTitle_text = '- アルゴリズムを学ぼう -';
var subTitle_textAlign = 'center';
var subTitle_posX = 0;
var subTitle_posY = 196;
var subTitle_font = '14px sans-serif';


var selectScene_backgroundColor = '#fcc800';
var selectStage_textAlign = 'center';
var selectStage_color = '#ffffff';
var selectStage_posX = 0;
var selectStage_lineSpacing = 22; //fontsize + lineSpacing
var selectStage_font = '20px sans-serif';
var selectStage_marginTop = 20;


var stageWidth = 4;
var stageHeight = 4;
var stagePanelWidth = stageRangeWidth / stageWidth;
var stagePanelHeight = stageRangeHeight / stageHeight;
var panelImageWidth = 48;
var panelImageHeight = 48;

//-----------------------

var stagePanel = new Array();
var gunmaIndexX = 0;
var gunmaIndexY = 0;



var comList = new Array();

enchant();

var moveCheck = function (x, y, moveX, moveY) {
    if (y + moveY < 0 || x + moveX < 0) return false;
    if (y + moveY >= stageHeight || x + moveX >= stageWidth) return false;
    if (stageAry[y + moveY][x + moveX] == stageHolePanel || stageAry[y + moveY][x + moveX] == stageWallPanel) {
        return false;
    } else if (stageAry[y + moveY][x + moveX] == stageRockPanel) {
        if (y + moveY * 2 < 0 || x + moveX * 2 < 0) return false;
        if (y + moveY * 2 >= stageHeight || x + moveX * 2 >= stageWidth) return false;
        if (stageAry[y + moveY * 2][x + moveX * 2] == stageRockPanel || stageAry[y + moveY * 2][x + moveX * 2] == stageWallPanel) {
            return false;
        }
    }
    return true;
};

var moveGunma = function (x, y, moveX, moveY) {
    if (!moveCheck(x, y, moveX, moveY)) return false;
    if (stageAry[y + moveY][x + moveX] >= stageGoalPanel) return true;
    if (stageAry[y + moveY][x + moveX] == stageRockPanel) {
        if (stageAry[y + moveY * 2][x + moveX * 2] == stageHolePanel) {
            stageAry[y + moveY * 2][x + moveX * 2] = stageFloorPanel;
        } else {
            stageAry[y + moveY * 2][x + moveX * 2] = stageRockPanel;
        }
        updateStage(x + moveX * 2, y + moveY * 2);
    }
    stageAry[y + moveY][x + moveX] = stageFloorPanel;
    updateStage(x + moveX, y + moveY);
    return true;
}


var updateStage = function (x, y) {
    var index = x + y * stageHeight;
    stagePanel[index].frame = stageAry[y][x];
}

function sleep(a) {
    var dt1 = new Date().getTime();
    var dt2 = new Date().getTime();
    while (dt2 < dt1 + a) {
        dt2 = new Date().getTime();
    }
    return;
}

window.onload = function () {
    var game_ = new Game(winWidth, winHeight);
    game_.fps = 24;

    game_.preload('./img/arrow.png', './img/stagePanel.png', './img/gunma.png', './img/start.png', './img/clear.png');
    game_.onload = function () {
        /**
        * start scene
        */
        var createStartScene = function () {
            stageAry = JSON.parse(JSON.stringify(orgStage));
            var scene = new Scene();
            scene.backgroundColor = startScene_backgroundColor;

            var startImage = new Sprite(startImage_sizeX, startImage_sizeY);
            startImage.image = game_.assets['./img/start.png'];
            startImage.x = startImage_posX;
            startImage.y = startImage_posY;
            scene.addChild(startImage);

            var title = new Label(title_text);
            title.textAlign = title_textAlign;
            title.color = title_color;
            title.x = title_posX;
            title.y = title_posY;
            title.font = title_font;
            scene.addChild(title);

            var subTitle = new Label(subTitle_text);
            subTitle.textAlign = subTitle_textAlign;
            subTitle.x = subTitle_posX;
            subTitle.y = subTitle_posY;
            subTitle.font = subTitle_font;
            scene.addChild(subTitle);

            startImage.addEventListener(Event.TOUCH_START, function (e) {
                game_.replaceScene(createSelectScene());
            });

            return scene;
        };

        /**
         * select scene
        */
        var createSelectScene = function () {
            stageAry = JSON.parse(JSON.stringify(orgStage));
            var scene = new Scene();
            scene.backgroundColor = selectScene_backgroundColor;
            var selectStage = new Array();

            for (var index = 0; index < 6; index++) {

                selectStage[index] = new Label(selectName[index]);
                selectStage[index].textAlign = selectStage_textAlign;

                selectStage[index].color = selectStage_color;
                selectStage[index].x = selectStage_posX;
                selectStage[index].y = selectStage_marginTop + selectStage_lineSpacing * index;
                selectStage[index].font = selectStage_font;

                scene.addChild(selectStage[index]);
                selectStage[index].addEventListener('touchstart', function () {
                    //add read mat
                    game_.replaceScene(createGameScene());
                }, false);

            }

            return scene;
        };



        /**
        * game Scene
        */
        var createGameScene = function () {
            var scene = new Scene();
            scene.backgroundColor = '#fcc8f0';

            var score = 0;

            var goFlg = false;

            var frameCount = 0;
            scene.addEventListener(Event.ENTER_FRAME, function () {
                if (++frameCount >= 12) {
                    gunma.frame = Math.abs(gunma.frame - 1);
                    frameCount = 0;
                }
                if (goFlg) {
                    if (stageAry[gunmaIndexY][gunmaIndexX] >= stageGoalPanel) {
                        comList.length = 0;
                        comArrow.text = "";
                        goflg = false;
                        game_.replaceScene(createGameoverScene(score));
                    }
                    if (comList.length == 0) {
                        goFlg = false;
                    } else {
                        var i = 0;
                        var index = comList[i];
                        var gunmaSpeedX = 0;
                        var gunmaSpeedY = 0;
                        if (index % 2 == 0) {
                            gunmaSpeedX = stagePanelWidth;
                            if (index == 0) gunmaSpeedX *= -1;
                        } else {
                            gunmaSpeedY = stagePanelHeight;
                            if (index == 1) gunmaSpeedY *= -1;
                        }

                        var moveX = 0;
                        var moveY = 0;

                        if (gunmaSpeedX != 0) {
                            moveX = gunmaSpeedX / Math.abs(gunmaSpeedX);
                        } else if (gunmaSpeedY != 0) {
                            moveY = gunmaSpeedY / Math.abs(gunmaSpeedY);
                        }

                        if (moveGunma(gunmaIndexX, gunmaIndexY, moveX, moveY)) {
                            gunma.x += gunmaSpeedX;
                            gunmaIndexX += moveX;
                            gunma.y += gunmaSpeedY;
                            gunmaIndexY += moveY;
                            score++;
                            label.text = '移動回数： ' + score + '回';
                        }
                        comArrow.text = comArrow.text.slice(5);
                        comList.shift();
                        sleep(500); //must change
                    }
                }
            });


            var label = new Label('移動回数： ' + score + '回');
            label.font = '14px sans-serif';
            scene.addChild(label);



            var comArrow = new Label("");
            comArrow.font = '20px sans-serif';
            comArrow.x = winWidth - 25;
            comArrow.y = 0;
            comArrow.width = 25;
            scene.addChild(comArrow);

            for (var indexY = 0; indexY < stageHeight; indexY++) {//stage
                for (var indexX = 0; indexX < stageWidth; indexX++) {

                    var index = indexX + indexY * stageHeight;

                    stagePanel[index] = new Sprite(panelImageWidth, panelImageHeight);
                    stagePanel[index].image = game_.assets['./img/stagePanel.png'];
                    stagePanel[index].frame = stageAry[indexY][indexX];
                    stagePanel[index].x = outStageWidth / 2 + indexX * stagePanelWidth;
                    stagePanel[index].y = outStageHeight + indexY * stagePanelHeight;
                    stagePanel[index].scale(stagePanelWidth / panelImageWidth, stagePanelHeight / panelImageHeight);


                    if (stageAry[indexY][indexX] == 4) {
                        gunmaIndexX = indexX;
                        gunmaIndexY = indexY;
                    }

                    scene.addChild(stagePanel[index]);
                }
            }


            var gunma = new Sprite(panelImageWidth, panelImageHeight);
            gunma.image = game_.assets['./img/gunma.png'];
            gunma.scale(stagePanelWidth / panelImageWidth, stagePanelHeight / panelImageHeight);
            gunma.x = outStageWidth / 2 + gunmaIndexX * stagePanelWidth;
            gunma.y = outStageHeight + gunmaIndexY * stagePanelHeight;
            gunma.frame = 0;

            scene.addChild(gunma);


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
                    if (!goFlg) {
                        var index = Math.round((this.x - outStageWidth / 2) / stagePanelWidth);
                        var indexChar = ['←', '↑', '→', '↓'];
                        comArrow.text = comArrow.text + indexChar[index] + '<br>';
                        comList.push(index);
                    }
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
                if (!goFlg) {
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
                }
            }, false);

            var goButton = new Sprite(panelImageWidth, panelImageHeight);
            goButton.image = game_.assets['./img/stagePanel.png'];
            goButton.x = 0;
            goButton.y = 50;
            goButton.frame = 4;
            goButton.scale(1, 1);

            scene.addChild(goButton);
            goButton.addEventListener('touchstart', function () {
                goFlg = true;
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
