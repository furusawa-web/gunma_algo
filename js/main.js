// encode 'UTF-8'
//使用したフレームワーク : enchant.js

//ステージ上各パネルの値設定------------------------------------
var stageStartPanel = 4;
var stageGoalPanel = 5;//（5以上のパネルはすべてゴール）
var stageRockPanel = 2;
var stageHolePanel = 1;
var stageWallPanel = 3;
var stageFloorPanel = 0;
//---------------------------------------

var stagePanel = new Array(); //ステージ描画用

//ぐんまちゃん位置情報
var gunmaIndexX = 0;
var gunmaIndexY = 0;

var comList = new Array(); //フローチャート保存用可変長配列

//ウィンドウサイズ取得
var winWidth = window.innerWidth;
var winHeight = window.innerHeight;



//ステージ情報-------------------------------
var stageAry = [
    [0, 0, 0, 1, 6],
    [0, 0, 0, 1, 5],
    [0, 0, 2, 3, 3],
    [0, 0, 0, 0, 0],
    [4, 0, 0, 0, 0]
];
var stageWidth = 5;
var stageHeight = 5;

var selectName = ["群馬県庁", "赤城山", "浅間山", "榛名山", "妙義山", "富岡製糸場"];
//todo: selectNameをキーにファイル読み込みを行う関数を用意する
//---------------------------------


//デザイン情報----------------

//スタートシーンの設定
var startScene_backgroundColor = '#fcc800';//スタートシーンの背景色

//スタート画像の設定
//画像サイズ
var startImage_sizeX = 236;
var startImage_sizeY = 48;
//画像描画位置
var startImage_posX = 42;
var startImage_posY = 136;

//タイトルラベルの設定
var title_text = 'ぐんまちゃん';
var title_textAlign = 'center';
var title_color = '#ffffff';
var title_posX = 0;
var title_posY = 96;
var title_font = '28px sans-serif';

//サブタイトルラベルの設定
var subTitle_text = '- アルゴリズムを学ぼう -';
var subTitle_textAlign = 'center';
var subTitle_posX = 0;
var subTitle_posY = 196;
var subTitle_font = '14px sans-serif';

//ステージ選択画面の設定
var selectScene_backgroundColor = '#fcc800';
var selectStage_textAlign = 'center';
var selectStage_color = '#ffffff';
var selectStage_posX = 0;//x位置
var selectStage_lineSpacing = 22; //行間設定用：（フォントサイズ+行間サイズで指定）
var selectStage_font = '20px sans-serif';
var selectStage_marginTop = 20;//上の余白設定用


//ゲームシーンの設定
var gameScene_BackgroundColor = '#fcc8f0';

//ステージを描画する範囲(以下はステージ描画用領域として、全体の7割のサイズの正方形で確保)
var stageRangeWidth = Math.min(winWidth, winHeight) * 0.7;
var stageRangeHeight = stageRangeWidth;

//パネルの画像サイズ
var panelImageWidth = 48;
var panelImageHeight = 48;

//パネルの描画サイズ
var stagePanelWidth = stageRangeWidth / stageWidth;
var stagePanelHeight = stageRangeHeight / stageHeight;

//ステージ領域の描画開始位置(以下は横位置は中心、高さは適当に調整)
var outStageWidth = (winWidth - stageRangeWidth) / 2;
var outStageHeight = 50;

//移動回数表示用ラベルの設定
var moveCountLabel_font = '14px sans-serif';
var moveCountLabel_x = 0;
var moveCountLabel_y = 0;

//フローチャート表示用ラベルの設定
var comArrow_font = '20px sans-serif';
var comArrow_x = winWidth - 25;
var comArrow_y = 0;
var comArrow_width = 25;

//やりなおすボタンの設定
var backArrow_x = 0;
var backArrow_y = 0;

//実行ボタンの設定
var goButton_x = 0;
var goButton_y = 50;

//矢印ボタンとステージの隙間
var arrowYpadding = 5;


//ゲームオーバーシーンの設定
var gameoverScene_backgroundColor = '#303030';

//クリア画像の設定
var gameoverImage_width = 267;
var gameoverImage_height = 48;
var gameoverImage_x = 40;
var gameoverImage_y = 112;

//移動回数表示ラベルの設定
var resultLabel_text = '回移動した！';
var resultLabel_textAlign = 'center';
var resultLabel_color = '#fff';
var resultLabel_x = 0;
var resultLabel_y = 60;
var resultLabel_font = '40px sans-serif';

//リトライ用ラベルの設定
var retryLabel_text = 'もう一度遊ぶ'
var retryLabel_color = '#fff';
var retryLabel_x = 0;
var retryLabel_y = 300;
var retryLabel_font = '20px sans-serif';

//-----------------------


enchant();

//指定された位置からmoveXおよびmoveYだけ移動することが可能か判定する関数
var moveCheck = function (x, y, moveX, moveY) {
    //移動するとステージ外にはみ出す場合
    if (y + moveY < 0 || x + moveX < 0) return false;
    if (y + moveY >= stageHeight || x + moveX >= stageWidth) return false;

    //移動先が穴もしくは壁だった場合
    if (stageAry[y + moveY][x + moveX] == stageHolePanel || stageAry[y + moveY][x + moveX] == stageWallPanel) {
        return false;
        //移動先に岩があった場合
    } else if (stageAry[y + moveY][x + moveX] == stageRockPanel) {
        //moveY*2やmoveX*2によって岩が動く先を表している

        //ステージ外にはみ出す場合
        if (y + moveY * 2 < 0 || x + moveX * 2 < 0) return false;
        if (y + moveY * 2 >= stageHeight || x + moveX * 2 >= stageWidth) return false;

        //移動先が岩もしくは壁だった場合
        if (stageAry[y + moveY * 2][x + moveX * 2] == stageRockPanel || stageAry[y + moveY * 2][x + moveX * 2] == stageWallPanel) {
            return false;
        }
    }
    return true;
};

//移動できたかどうかを返す関数
//移動できる場合は、ステージ情報を表す配列を更新する。
var moveGunma = function (x, y, moveX, moveY) {
    //移動可否判定
    if (!moveCheck(x, y, moveX, moveY)) return false;

    //ゴール判定
    if (stageAry[y + moveY][x + moveX] >= stageGoalPanel) return true;

    //ぐんまちゃん移動先が岩だったとき
    if (stageAry[y + moveY][x + moveX] == stageRockPanel) {
        if (stageAry[y + moveY * 2][x + moveX * 2] == stageHolePanel) {
            //岩の移動先が穴なら、穴のパネルを床に変更する
            stageAry[y + moveY * 2][x + moveX * 2] = stageFloorPanel;
        } else {
            //岩を次のパネルに移動させる
            stageAry[y + moveY * 2][x + moveX * 2] = stageRockPanel;
        }
        updateStage(x + moveX * 2, y + moveY * 2);
    }

    //ぐんまちゃんの移動先を床にする.（不必要なので消してもよい）
    stageAry[y + moveY][x + moveX] = stageFloorPanel;

    updateStage(x + moveX, y + moveY);
    return true;
}


//ステージ情報配列を再描画
var updateStage = function (x, y) {
    var index = x + y * stageHeight;
    stagePanel[index].frame = stageAry[y][x];
}

//スリープ（ぐんまちゃんの動きの処理時間を考慮したスリープに変更したほうがよい）
function sleep(a) {
    var dt1 = new Date().getTime();
    var dt2 = new Date().getTime();
    while (dt2 < dt1 + a) {
        dt2 = new Date().getTime();
    }
    return;
}


window.onload = function () {
    //ゲーム画面（現在はウインドウサイズ取得してウインドウ全体）
    var game_ = new Game(winWidth, winHeight);

    //fpsは適当な値に設定
    game_.fps = 24;

    //事前読み込み（以下で表示する画像は必ずここに記述）
    game_.preload('./img/arrow.png', './img/backArrow.png', './img/stagePanel.png', './img/gunma.png', './img/start.png', './img/clear.png', './img/go.png');

    //読み込み終了次第ゲーム用処理
    game_.onload = function () {
        /**
        * start scene
        */
        var createStartScene = function () {
            //シーン全体の設定
            var scene = new Scene();
            scene.backgroundColor = startScene_backgroundColor;

            //スタート画像の設定
            var startImage = new Sprite(startImage_sizeX, startImage_sizeY);
            startImage.image = game_.assets['./img/start.png'];
            startImage.x = startImage_posX;
            startImage.y = startImage_posY;
            scene.addChild(startImage);

            //タイトルラベルの設定
            var title = new Label(title_text);
            title.textAlign = title_textAlign;
            title.color = title_color;
            title.x = title_posX;
            title.y = title_posY;
            title.font = title_font;
            scene.addChild(title);

            //サブタイトルラベルの設定
            var subTitle = new Label(subTitle_text);
            subTitle.textAlign = subTitle_textAlign;
            subTitle.x = subTitle_posX;
            subTitle.y = subTitle_posY;
            subTitle.font = subTitle_font;
            scene.addChild(subTitle);

            //スタートイメージがタッチ（クリック）されたときのイベント
            startImage.addEventListener(Event.TOUCH_START, function (e) {
                //シーン遷移
                game_.replaceScene(createSelectScene());
            });

            return scene;
        };

        /**
         * select scene
        */
        var createSelectScene = function () {
            //シーン全体の設定
            var scene = new Scene();
            scene.backgroundColor = selectScene_backgroundColor;

            //描画用配列
            var selectStage = new Array();

            for (var index = 0; index < 6; index++) {

                //ステージ選択ラベルの設定
                selectStage[index] = new Label(selectName[index]);
                selectStage[index].textAlign = selectStage_textAlign;
                selectStage[index].color = selectStage_color;
                selectStage[index].x = selectStage_posX;
                selectStage[index].y = selectStage_marginTop + selectStage_lineSpacing * index;
                selectStage[index].font = selectStage_font;

                scene.addChild(selectStage[index]);

                selectStage[index].addEventListener('touchstart', function () {
                    //ここにindexによってファイルを読み込んで、配列を更新する処理を追加する
                    //ただし、indexの取得が困難なので、this.yを利用して、indexを逆算する必要がある
                    game_.replaceScene(createGameScene());
                }, false);

            }

            return scene;
        };

        /**
        * game Scene
        */
        var createGameScene = function () {
            //戻るに対応するための配列コピー
            var orgStage = JSON.parse(JSON.stringify(stageAry));

            //シーン全体の設定
            var scene = new Scene();
            scene.backgroundColor = gameScene_BackgroundColor;

            //移動回数保存用
            var score = 0;

            //実行中に操作不能にするためのflg
            var goFlg = false;

            var frameCount = 0;

            //フレームが進むたびに呼ばれる（描画も、実際はこのタイミングで、まとめて行われている）
            scene.addEventListener(Event.ENTER_FRAME, function () {

                //ぐんまちゃんが歩くアニメーション
                if (++frameCount >= 12) {
                    gunma.frame = Math.abs(gunma.frame - 1);//0と1を往復する
                    frameCount = 0;
                }

                if (goFlg) {
                    //ゴールについていた場合
                    if (stageAry[gunmaIndexY][gunmaIndexX] >= stageGoalPanel) {
                        //フローチャートリセット
                        comList.length = 0;
                        comArrow.text = "";
                        //実行中フラグOFF
                        goflg = false;
                        //シーン遷移
                        game_.replaceScene(createGameoverScene(score));
                    }

                    //実行終了時
                    if (comList.length == 0) {
                        //実行中フラグOFF
                        goFlg = false;
                    } else {
                        var i = 0;
                        var index = comList[i];//フローチャート先頭を取得

                        //画面サイズに応じたぐんまちゃんのうごく長さ情報
                        var gunmaSpeedX = 0;
                        var gunmaSpeedY = 0;

                        //左右の矢印が0と2
                        //上下の矢印が1と3
                        //

                        //あとで素直にcase文に直す
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
                            //index単位での動く量の取得(1,0,-1)
                            moveX = gunmaSpeedX / Math.abs(gunmaSpeedX);
                        } else if (gunmaSpeedY != 0) {
                            //index単位での動く量の取得(1,0,-1)
                            moveY = gunmaSpeedY / Math.abs(gunmaSpeedY);
                        }

                        //うごける場合
                        if (moveGunma(gunmaIndexX, gunmaIndexY, moveX, moveY)) {

                            //ぐんまちゃんの移動
                            gunma.x += gunmaSpeedX;
                            gunmaIndexX += moveX;
                            gunma.y += gunmaSpeedY;
                            gunmaIndexY += moveY;

                            //移動回数更新
                            score++;
                            label.text = '移動回数： ' + score + '回';
                        }
                        //動けないやじるしの入力があった場合の処理はここにelseで追加
                        //首をかしげるとか、ペナルティをつけるとか

                        //フローチャート表示の先頭を5文字削除
                        //"<br>"の四文字と矢印の一文字で計五文字
                        comArrow.text = comArrow.text.slice(5);
                        //フローチャート用配列の先頭削除
                        comList.shift();

                        //ステップごとの実行に必要
                        sleep(500);
                    }
                }
            });

            //移動回数表示ラベルの設定
            var label = new Label('移動回数： ' + score + '回');
            label.font = moveCountLabel_font;
            label.x = moveCountLabel_x;
            label.y = moveCountLabel_y;
            scene.addChild(label);

            //フローチャート表示用ラベルの設定
            var comArrow = new Label("");
            comArrow.font = comArrow_font;
            comArrow.x = comArrow_x;
            comArrow.y = comArrow_y;
            comArrow.width = comArrow_width;
            scene.addChild(comArrow);


            //各パネル画像の設定
            for (var indexY = 0; indexY < stageHeight; indexY++) {//stage
                for (var indexX = 0; indexX < stageWidth; indexX++) {

                    var index = indexX + indexY * stageHeight;

                    stagePanel[index] = new Sprite(panelImageWidth, panelImageHeight);
                    stagePanel[index].image = game_.assets['./img/stagePanel.png'];
                    stagePanel[index].frame = stageAry[indexY][indexX];
                    stagePanel[index].x = outStageWidth + indexX * stagePanelWidth;
                    stagePanel[index].y = outStageHeight + indexY * stagePanelHeight;
                    //画面にあわせてスケーリング(スケーリングに伴い若干xとyで指定した位置がずれる(おそらく仕様))
                    //この行のあとにxyを指定しなおしても意味がないので、できるかぎり、元画像のサイズは合わせたい
                    stagePanel[index].scale(stagePanelWidth / panelImageWidth, stagePanelHeight / panelImageHeight);

                    //スタートの番地を取得し、ぐんまちゃんの初期位置を決定
                    if (stageAry[indexY][indexX] == stageStartPanel) {
                        gunmaIndexX = indexX;
                        gunmaIndexY = indexY;
                    }

                    scene.addChild(stagePanel[index]);
                }
            }

            //ぐんまちゃんの設定
            var gunma = new Sprite(panelImageWidth, panelImageHeight);
            gunma.image = game_.assets['./img/gunma.png'];
            gunma.scale(stagePanelWidth / panelImageWidth, stagePanelHeight / panelImageHeight);
            gunma.x = outStageWidth + gunmaIndexX * stagePanelWidth;
            gunma.y = outStageHeight + gunmaIndexY * stagePanelHeight;
            gunma.frame = 0;

            scene.addChild(gunma);

            //矢印入力パネルの設定
            var arrow = new Array();
            for (var index = 0; index < 4; index++) {

                //ステージパネルのサイズに合わせているが、このあたりも修正してもよい
                arrow[index] = new Sprite(panelImageWidth, panelImageHeight);
                arrow[index].image = game_.assets['./img/arrow.png'];
                arrow[index].frame = index;
                arrow[index].x = outStageWidth + index * stagePanelWidth;
                arrow[index].y = outStageHeight + stagePanelHeight * stageHeight + arrowYpadding;
                arrow[index].scale(stagePanelWidth / panelImageWidth, stagePanelHeight / panelImageHeight);

                scene.addChild(arrow[index]);

                arrow[index].addEventListener('touchstart', function () {
                    if (!goFlg) {
                        //indexが取得できないようなので、x座標から逆算して強引に取得
                        //上を修正するならここも修正必須
                        var index = Math.round((this.x - outStageWidth) / stagePanelWidth);
                        var indexChar = ['←', '↑', '→', '↓'];
                        comArrow.text = comArrow.text + indexChar[index] + '<br>';
                        comList.push(index);
                    }
                }, false);

            }

            //リセットボタンの設定
            var backArrow = new Sprite(panelImageWidth, panelImageHeight);
            backArrow.image = game_.assets['./img/backArrow.png'];
            backArrow.x = backArrow_x;
            backArrow.y = backArrow_y;

            scene.addChild(backArrow);
            backArrow.addEventListener('touchstart', function () {
                if (!goFlg) {
                    //元ステージ情報を読み込み
                    stageAry = JSON.parse(JSON.stringify(orgStage));

                    //ステージ情報を画面描画に対応
                    for (var indexY = 0; indexY < stageHeight; indexY++) {
                        for (var indexX = 0; indexX < stageWidth; indexX++) {
                            var index = indexX + indexY * stageHeight;
                            stagePanel[index].frame = stageAry[indexY][indexX];
                            if (stageAry[indexY][indexX] == 4) {
                                gunmaIndexX = indexX;
                                gunmaIndexY = indexY;
                                gunma.x = outStageWidth + gunmaIndexX * stagePanelWidth;
                                gunma.y = outStageHeight + gunmaIndexY * stagePanelHeight;
                            }

                        }
                    }
                }
            }, false);

            //実行ボタンの設定
            var goButton = new Sprite(panelImageWidth, panelImageHeight);
            goButton.image = game_.assets['./img/go.png'];
            goButton.x = goButton_x;
            goButton.y = goButton_y;

            scene.addChild(goButton);
            goButton.addEventListener('touchstart', function () {
                //実行中フラグをONにする
                goFlg = true;
            }, false);

            return scene;
        };
        /**
        * gameclear scene
        */
        var createGameoverScene = function (resultScore) {
            //シーン全体の設定
            var scene = new Scene();
            scene.backgroundColor = gameoverScene_backgroundColor;

            //クリア画像の設定
            //変数名をclearImageにすると、Imageのクリアを行う関数と紛らわしいのでgameoverに。
            var gameoverImage = new Sprite(gameoverImage_width, gameoverImage_height);
            gameoverImage.image = game_.assets['./img/clear.png'];
            gameoverImage.x = gameoverImage_x;
            gameoverImage.y = gameoverImage_y;
            scene.addChild(gameoverImage);

            //結果表示ラベルの設定
            var label = new Label(resultScore + resultLabel_text);
            label.textAlign = resultLabel_textAlign;
            label.color = resultLabel_color;
            label.x = resultLabel_x;
            label.y = resultLabel_y;
            label.font = resultLabel_font;
            scene.addChild(label);

            //リトライラベルの設定
            var retryLabel = new Label(retryLabel_text);
            retryLabel.color = retryLabel_color;
            retryLabel.x = retryLabel_x;
            retryLabel.y = retryLabel_y;
            retryLabel.font = retryLabel_font;
            scene.addChild(retryLabel);

            retryLabel.addEventListener(Event.TOUCH_START, function (e) {
                game_.replaceScene(createStartScene());//スタートシーンに戻る
            });
            return scene;
        };

        //最初のシーン設定       
        game_.replaceScene(createStartScene());
    }

    game_.start();
};
