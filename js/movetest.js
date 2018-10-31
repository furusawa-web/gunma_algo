enchant(); // おまじない

window.onload = function() {

    var game = new Game(320, 320); // 表示領域サイズ
    game.fps = 24; // fps
    game.preload('./img/chara1.png'); // 素材読み込み
    //ame.preload("../img/chara1.png", "../img/chara2.png", "../img/chara3.png", ....);

    game.onload = function() {

        var kuma = new Sprite(32, 32);  // スプライトサイズ
        kuma.image = game.assets['./img/chara1.png']; // 画像適用
        kuma.x = 100; // くまの横位置を設定します。
        kuma.y = 120; // くまの縦位置を設定します。
        game.rootScene.addChild(kuma); // くまの表示
        game.rootScene.backgroundColor  = '#7ecef4'; // ゲームの動作部分の背景色を設定しています。
        var speed = 0;// くまのスピードを表す変数（箱）を用意しておきます。

        game.rootScene.addEventListener(Event.ENTER_FRAME, function() {//毎フレーム実行処理
            kuma.x += speed;
            speed = 0;
        });

        game.rootScene.addEventListener(Event.TOUCH_START, function(e) {//タッチイベント
            if (e.x > kuma.x) {
                speed = 1;
                kuma.scaleX = 1;//左右反転

            } else {
                speed = -1;
                kuma.scaleX = -1;//左右反転

            }
        });
    }
    game.start(); // ゲームをスタートさせます
};
