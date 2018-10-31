enchant();
window.onload = function() {
    var game_ = new Game(320, 320); // 表示領域の大きさを設定
    var stageAry = [
        [0, 1, 0, 1],
        [0, 0, 1, 0],
        [0, 1, 0, 1]
    ];
    game_.fps = 24;                 // ゲームの進行スピードを設定
    game_.preload('./img/chara1.png', './img/chara3.png', './img/map1.png', './img/start.png', './img/gameover.png'); // ゲームに使う素材を、あらかじめ読み込む
    game_.onload = function() { // ゲームの準備が整ったらメインの処理を実行します
        /**
        * タイトルシーン
        *
        * タイトルシーンを作り、返す関数です。
        */
        var createStartScene = function() {
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
        *
        * ゲームシーンを作り、返す関数です。
        */
        var createGameScene = function() {
            var scene = new Scene();                            // 新しいシーンを作る
            scene.backgroundColor = '#fcc8f0';

            var time =  240;                                    // 残り時間を初期化
            var score = 0;                                      // 得点を初期化
            // 得点欄を作成
            var label = new Label('スコア: ' +score+ '体叩いた！'); // スコア: ○体叩いた！と表示するラベルを作る
            label.font = '14px sans-serif';                       // 14pxのゴシック体にする
            scene.addChild(label);                                // シーンに追加
            // 残り時間欄を作成
            var timeLimit = new Label('残り時間:' + time);       // 残り時間: ○○と表示するラベルを作る
            timeLimit.font = '14px sans-serif';                 // 14pxのゴシック体にする
            timeLimit.x = 0;                                    // 横位置調整
            timeLimit.y = 20;                                   // 縦位置調整
            scene.addChild(timeLimit);                          // シーンに追加

            var droid = new Array() ;
            var index;

            for( index = 0 ; index < 20 ; index++ ){
                //Spriteを作成する
                droid[ index ] = new Sprite( 16, 16 ) ;
                droid[ index ].image = game_.assets[ './img/map1.png' ] ;
                droid[ index ].frame = 12*16+5;//24;//横16画像
                droid[index].x = Math.random() * 288;
                droid[index].y = Math.random() * 288;

                scene.addChild( droid[ index ] ) ;

                // フレームイベントが発生したら処理
                droid[ index ].addEventListener( Event.TOUCH_START, function(){
                    this.x =  this.x + 20 ;
                });
            }



            // くまを作成
            var kuma = new Sprite(32, 32);                      // スプライトを作る
            kuma.image = game_.assets['./img/chara1.png'];      // くま画像を設定
            kuma.x = Math.random() * 288;                       // くまの横位置を0～288pxの間でランダムに設定
            kuma.y = Math.random() * 288;                       // くまの縦位置を0～288pxの間でランダムに設定
            scene.addChild(kuma);                               // シーンに追加
            var kumaSpeed = 0;
            // シーンに毎フレームイベントを設定
            scene.addEventListener(Event.ENTER_FRAME, function() {
                time --;                                // 残り時間を1ずつ減らす
                timeLimit.text = '残り時間:' + time;    // 残り時間の表示を更新
                // 時間切れ
                if (time <= 0) {
                    game_.replaceScene(createGameoverScene(score));    // 現在表示しているシーンをゲームオーバーシーンに置き換える
                }
                // くまが画面端に来た時の対処
                if (kuma.x > 320 && kumaSpeed > 0) {             // もしも右端に到達したら
                    kumaSpeed = 0;               // 左端にワープさせる
                } else if (kuma.x < 0 && kumaSpeed < 0) {      // もしも左端に到達したら
                    kumaSpeed = 0;               // 右端にワープさせる
                }
                kuma.x += kumaSpeed;            // くまを横方向に移動
                kumaSpeed = 0;
                // くまのスプライトシートのフレームを動かし、走っているような効果を与える
                kuma.frame ++;                  // くまのフレームを動かす
                if (kuma.frame > 2) {           // くまのフレームが3以上になったら
                    kuma.frame = 0;             // 0に戻す
                }
            });

            scene.addEventListener(Event.TOUCH_START, function(e) {//タッチイベント
                if (e.x > kuma.x) {
                    kumaSpeed = 20;
                    kuma.scaleX = 1;//左右反転
                } else {
                    kumaSpeed = -20;
                    kuma.scaleX = -1;//左右反転
                }
            });
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
            var gameoverImage = new Sprite(189, 97);                   // スプライトを作る
            gameoverImage.image = game_.assets['./img/gameover.png'];  // ゲームオーバー画像を設定
            gameoverImage.x = 65;                                      // 横位置調整
            gameoverImage.y = 112;                                     // 縦位置調整
            scene.addChild(gameoverImage);                             // シーンに追加
            // スコアラベル設定
            var label = new Label(resultScore + '体叩いた');            // ラベルを作る スコアを代入
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
