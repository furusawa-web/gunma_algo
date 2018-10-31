
var stageAry = [
    [ 0, 0, 1, 5],
    [ 0, 0, 3, 3],
    [ 0, 2, 0, 0],
    [ 4, 0, 0, 0]
];

var orgStage = JSON.parse(JSON.stringify(stageAry));

var stageWidth = 4;
var stageHeight = 4;
var stagePanelWidth = 48;
var stagePanelHeight = 48;
var stagePanel = new Array() ;
var gunmaIndexX = 0;
var gunmaIndexY = 0;
var goalIndexX = 0;
var goalIndexY = 0;

enchant();

var moveCheck = function(x, y, moveX, moveY) {
    if(y + moveY < 0 || x + moveX < 0) return false;
    if(y + moveY >= stageHeight || x + moveX >= stageWidth) return false;
    if (stageAry[y + moveY][x + moveX] == 1 || stageAry[y + moveY][x + moveX] == 3) {
        return false;
    }else if(stageAry[y + moveY][x + moveX] == 2){
        if(y + moveY * 2 < 0 || x + moveX * 2 < 0) return false;
        if(y + moveY * 2 >= stageHeight || x + moveX * 2 >= stageWidth) return false;
        if(stageAry[y + moveY * 2][x + moveX * 2] == 2 || stageAry[y + moveY * 2][x + moveX * 2] == 3){
            return false;
        }
    }
    return true;
};

var moveGunma = function(x, y, moveX, moveY) {
    if(!moveCheck(x, y, moveX, moveY)) return false;
    if(stageAry[y + moveY][x + moveX] == 2){
        if(stageAry[y + moveY * 2][x + moveX * 2] == 1 ){
            stageAry[y + moveY * 2][x + moveX * 2] = 0;
        }else{
            stageAry[y + moveY * 2][x + moveX * 2] = 2;
        }
        updateStage(x + moveX * 2, y + moveY * 2);
    }
    stageAry[y + moveY][x + moveX] = 0;
    updateStage(x + moveX, y + moveY );
    return true;
}


var updateStage = function(x , y){
    var index = x + y * stageHeight;
    stagePanel[index].frame = stageAry[y][x];
}

window.onload = function() {
    //var game_ = new Game(320, 320); // 表示領域の大きさを設定
    var game_ = new Game(window.innerWidth, window.innerHeight); // 表示領域の大きさを設定
    game_.fps = 24;                 // ゲームの進行スピードを設定
    // ゲームに使う素材を、あらかじめ読み込む
    game_.preload('./img/arrow.png','./img/testImg.png','./img/chara1.png', './img/chara3.png', './img/map1.png', './img/start.png', './img/clear.png');
    game_.onload = function() { // ゲームの準備が整ったらメインの処理を実行します
        /**
        * タイトルシーン
        *
        * タイトルシーンを作り、返す関数です。
        */
        var createStartScene = function() {
            stageAry = JSON.parse(JSON.stringify(orgStage));
            var scene = new Scene();                                // 新しいシーンを作る
            scene.backgroundColor = '#fcc800';                      // シーンの背景色を設定
            // スタート画像設定
            var startImage = new Sprite(236, 48);                   // スプライトを作る
            startImage.image = game_.assets['./img/start.png'];     // スタート画像を設定
            startImage.x = 42;                                      // 横位置調整
            startImage.y = 136;                                     // 縦位置調整
            scene.addChild(startImage);                             // シーンに追加
            // タイトルラベル設定
            var title = new Label('ぐんまちゃんのアレ');                     // ラベルを作る
            title.textAlign = 'center';                             // 文字を中央寄せ
            title.color = '#ffffff';                                // 文字を白色に
            title.x = 0;                                            // 横位置調整
            title.y = 96;                                           // 縦位置調整
            title.font = '28px sans-serif';                         // 28pxのゴシック体にする
            scene.addChild(title);                                  // シーンに追加
            // サブタイトルラベル設定
            var subTitle = new Label('- アルゴリズムを学ぼう -');  // ラベルを作る
            subTitle.textAlign = 'center';                          // 文字中央寄せ
            title.x = 0;                                            // 横位置調整
            subTitle.y = 196;                                       // 縦位置調整
            subTitle.font = '14px sans-serif';                      // 14pxのゴシック体にする
            scene.addChild(subTitle);                               // シーンに追加

            // スタート画像にタッチイベントを設定
            startImage.addEventListener(Event.TOUCH_START, function(e) {
                game_.replaceScene(createGameScene());    // 現在表示しているシーンをゲームシーンに置き換える
            });
            // タイトルシーンを返します。
            return scene;
        };
        /**
        * ゲームシーン
        *x
        * ゲームシーンを作り、返す関数です。
        */
        var createGameScene = function() {
            var scene = new Scene();                            // 新しいシーンを作る
            scene.backgroundColor = '#fcc8f0';

            var score = 0;                                      // 得点を初期化
            // 得点欄を作成
            var label = new Label('移動回数： ' + score + '回'); // スコア: ○体叩いた！と表示するラベルを作る
            label.font = '14px sans-serif';                       // 14pxのゴシック体にする
            scene.addChild(label);                                // シーンに追加


            for(var indexY = 0; indexY < stageHeight; indexY++){//stage
                for(var indexX = 0; indexX < stageWidth; indexX++){
                    //Spriteを作成する
                    var index = indexX + indexY * stageHeight;

                    stagePanel[ index ] = new Sprite( stagePanelWidth, stagePanelHeight ) ;
                    stagePanel[ index ].image = game_.assets[ './img/testImg.png' ] ;
                    stagePanel[ index ].frame = stageAry[indexY][indexX];//24;//横16画像
                    stagePanel[ index ].x = 50 + indexX * stagePanelWidth;
                    stagePanel[ index ].y = 50 + indexY * stagePanelHeight;

                    if(stageAry[indexY][indexX] == 4){
                        gunmaIndexX = indexX;
                        gunmaIndexY = indexY;
                    }else if (stageAry[indexY][indexX] == 5) {
                        goalIndexX = indexX;
                        goalIndexY = indexY;
                    }

                    scene.addChild( stagePanel[ index ] ) ;
                }
            }

            // くまを作成
            var gunma = new Sprite(stagePanelWidth, stagePanelHeight);                      // スプライトを作る
            gunma.image = game_.assets['./img/testImg.png'];      // くま画像を設定
            gunma.x = 50 + gunmaIndexX * stagePanelWidth;                       // くまの横位置を0～288pxの間でランダムに設定
            gunma.y = 50 + gunmaIndexY * stagePanelHeight;                       // くまの縦位置を0～288pxの間でランダムに設定
            gunma.frame = 6;
            scene.addChild(gunma);                               // シーンに追加
            var gunmaSpeedX = 0;
            var gunmaSpeedY = 0;
            // シーンに毎フレームイベントを設定
            scene.addEventListener(Event.ENTER_FRAME, function() {
                if(gunmaSpeedX != 0){
                    var moveX = gunmaSpeedX / Math.abs(gunmaSpeedX);
                    if(moveGunma(gunmaIndexX, gunmaIndexY, moveX, 0)){
                        gunma.x += gunmaSpeedX;
                        gunmaIndexX += moveX;
                        score ++;
                        label.text = '移動回数： ' + score + '回';
                    }

                }else if (gunmaSpeedY != 0) {
                    var moveY = gunmaSpeedY / Math.abs(gunmaSpeedY);
                    if(moveGunma(gunmaIndexX, gunmaIndexY, 0, moveY)){
                        gunma.y += gunmaSpeedY;
                        gunmaIndexY += moveY;
                        score ++;
                        label.text = '移動回数： ' + score + '回';
                    }
                }
                gunmaSpeedX = 0;
                gunmaSpeedY = 0;
                if(gunmaIndexX == goalIndexX && gunmaIndexY == goalIndexY) game_.replaceScene(createGameoverScene(score));    // 現在表示しているシーンをゲームオーバーシーンに置き換える
            });

            var arrow = new Array() ;

            for(var index = 0; index < 4; index++){//stage

                    arrow[ index ] = new Sprite( stagePanelWidth, stagePanelHeight ) ;
                    arrow[ index ].image = game_.assets[ './img/arrow.png' ] ;
                    arrow[ index ].frame = index;//24;//横16画像
                    arrow[ index ].x = 50 + index * stagePanelWidth;
                    arrow[ index ].y = 55 + stagePanelHeight * stageHeight;

                    scene.addChild( arrow[ index ] );
                    arrow[ index ].addEventListener( 'touchstart', function() {
                        var index = ( this.x - 50 ) / stagePanelWidth;
                        if(gunmaSpeedX == 0 && gunmaSpeedY == 0){
                            if(index % 2 == 0){
                                gunmaSpeedX = stagePanelWidth;
                                alert('testtest');
                                if(index == 0) gunmaSpeedX *= -1;
                            }else{
                                gunmaSpeedY = stagePanelHeight;
                                if(index == 1) gunmaSpeedY *= -1;
                            }
                        }
                    }, false );

            }



            // ゲームシーンを返す
            return scene;
        };
        /**
        * ゲームオーバーシーン
        *
        * ゲームオーバーシーンを作り、返す関数です。
        * createGameoverScore(※引数) ※引数にスコアを入れると画面にスコアが表示されます
        * ※は任意の名前でOKで、カンマ区切りで複数設定できます。
        * 例) var createGameoverScore = function (resultScore, test1, test2) {
        */
        var createGameoverScene = function(resultScore) {
            var scene = new Scene();                                   // 新しいシーンを作る
            scene.backgroundColor = '#303030';                         // シーンの背景色を設定
            // ゲームオーバー画像設定
            var gameoverImage = new Sprite(267, 48);                   // スプライトを作る
            gameoverImage.image = game_.assets['./img/clear.png'];  // ゲームオーバー画像を設定
            gameoverImage.x = 40;                                      // 横位置調整
            gameoverImage.y = 112;                                     // 縦位置調整
            scene.addChild(gameoverImage);                             // シーンに追加
            // スコアラベル設定
            var label = new Label(resultScore + '回移動した！');            // ラベルを作る スコアを代入
            label.textAlign = 'center';                                // 文字を中央寄せ
            label.color = '#fff';                                      // 文字を白色に
            label.x = 0;                                               // 横位置調整
            label.y = 60;                                              // 縦位置調整
            label.font = '40px sans-serif';                            // 40pxのゴシック体にする
            scene.addChild(label);                                     // シーンに追加
            // リトライラベル(ボタン)設定
            var retryLabel = new Label('もう一度遊ぶ');                  // ラベルを作る
            retryLabel.color = '#fff';                                 // 文字を白色に
            retryLabel.x = 0;                                          // 横位置調整
            retryLabel.y = 300;                                        // 縦位置調整
            retryLabel.font = '20px sans-serif';                       // 20pxのゴシック体にする
            scene.addChild(retryLabel);                                // シーンに追加
            // リトライラベルにタッチイベントを設定
            retryLabel.addEventListener(Event.TOUCH_START, function(e) {
                game_.replaceScene(createStartScene());    // 現在表示しているシーンをタイトルシーンに置き換える
            });
            return scene;
        };
        game_.replaceScene(createStartScene());  // ゲームの_rootSceneをスタートシーンに置き換える
    }


    game_.start(); // ゲームをスタートさせます
};
