import * as PIXI from 'pixi.js'
import shuffle from '@/util/shuffleArray'

/***
 * 設定
 */
// 基本設定
const settings = {
    maxSuccess: 1, // n回正解したらゲームクリア
    maxFailure: 3, // n回連続で失敗したらゲームオーバー？
    cardW: 200,
    cardH: 300,
    marginLow: 20
}

// 元となるカードのデータ
const lawCards = [{
    id: 'card1'
}, {
    id: 'card2'
}]

// 実際に配置するカードの中身
// 元データにパラメータを追加し要素を複製、2倍にしておく
const fieldCards = lawCards.map(val => {
    const newVal = Object.assign({}, val)
    newVal.isOpened = false
    newVal.isCleared = false
    return newVal
})
fieldCards.map(val => {
    fieldCards.push(Object.assign({}, val))
})

const status = {
    cardOpened: null, // fieldCards のうち表になってるカードのindex
    numSuccess: 0,
    numFailure: 0
}

/**
 * 初期化
 */
function initialise(elm) {
    shuffle(fieldCards)

    // 表示する
    // Add the view to the DOM
    // elm.appendChild(app.view);

    gameController()
}

/**
 * ゲームを管理
 */
function gameController() {
    const posx = 1, posy = 1 // for test
    const currentCardIndex = getCardIndexfromPos(posx, posy)
    const currentCard = fieldCards[currentCardIndex]
    // 再描画&裏返しアニメーション
    currentCard.isOpened = true

    if(!status.cardOpened) {
        status.cardOpened = currentCard.id
        return
    }

    if (status.cardOpened === currentCardIndex) {
        status.numSuccess++
        if (status.numSuccess >= settings.maxSuccess) {
            gameClear()
            return
        }
        clearTurnCards(currentCardIndex)
    } else {
        status.numFailure++
        if (status.numFailure >= settings.maxFailure) {
            gameOver()
            return
        }
        resetTurnCards(currentCardIndex)
    }

    status.cardOpened = null
    return
}

function getCardIndexfromPos(posx, posy) {
    // クリックされた縦位置を元にどの要素がクリックされたか判定
    let cardindex = 1
    return cardindex
}

/**
 * ターン終了時のそれぞれの動作
 */
function clearTurnCards(currentCardIndex) {
    fieldCards[status.cardOpened].isCleared = true
    fieldCards[currentCardIndex].isCleared = true
    // カードを消す
    return
}

function resetTurnCards(currentCardIndex) {
    fieldCards[status.cardOpened].isOpened = false
    fieldCards[currentCardIndex].isOpened = false
    // カードを裏返す
    return
}

/**
 * ゲーム終了時の動作
 */
function gameClear() {
    alart('clear!')
}

function gameOver() {
    alart('game over!')
}

/**
 * カードを表示
 */
// canvas
const app = new PIXI.Application({});

function drawCards() {
    // canvasを使うはず
    // isOpened = false のやつは等しく裏を表示
    // isOpened = true のやつだけ要素を表示
    // isCleared = true のやつは画像なし（消去）で空白表示
    // 敷き詰める繰り返しがちょっと面倒そう

    // ひっくり返す演出とか入れるとしたらどうやるんだろうね（死）
}

initialise()

console.log(fieldCards)

// var app = new PIXI.Application();
// document.body.appendChild(app.view);

// create a background...
// var background = PIXI.Sprite.fromImage('required/assets/button_test_BG.jpg');
// background.width = app.screen.width;
// background.height = app.screen.height;

// add background to stage...
// app.stage.addChild(background);

// create some textures from an image path
var textureButton = PIXI.Texture.fromImage('required/assets/button.png');
var textureButtonDown = PIXI.Texture.fromImage('required/assets/buttonDown.png');
var textureButtonOver = PIXI.Texture.fromImage('required/assets/buttonOver.png');

var buttons = [];

var buttonPositions = [
    175, 75,
    655, 75,
    410, 325,
    150, 465,
    685, 445
];

for (var i = 0; i < 5; i++) {
    var button = new PIXI.Sprite(textureButton);
    button.buttonMode = true;

    button.anchor.set(0.5);
    button.x = buttonPositions[i * 2];
    button.y = buttonPositions[i * 2 + 1];

    // make the button interactive...
    button.interactive = true;
    button.buttonMode = true;

    button
        // Mouse & touch events are normalized into
        // the pointer* events for handling different
        // button events.
        .on('pointerdown', onButtonDown)
        .on('pointerup', onButtonUp)
        .on('pointerupoutside', onButtonUp)
        .on('pointerover', onButtonOver)
        .on('pointerout', onButtonOut);

    // Use mouse-only events
    // .on('mousedown', onButtonDown)
    // .on('mouseup', onButtonUp)
    // .on('mouseupoutside', onButtonUp)
    // .on('mouseover', onButtonOver)
    // .on('mouseout', onButtonOut)

    // Use touch-only events
    // .on('touchstart', onButtonDown)
    // .on('touchend', onButtonUp)
    // .on('touchendoutside', onButtonUp)

    // add it to the stage
    app.stage.addChild(button);

    // add button to array
    buttons.push(button);
}

// set some silly values...
buttons[0].scale.set(1.2);
buttons[2].rotation = Math.PI / 10;
buttons[3].scale.set(0.8);
buttons[4].scale.set(0.8, 1.2);
buttons[4].rotation = Math.PI;

function onButtonDown() {
    this.isdown = true;
    this.texture = textureButtonDown;
    this.alpha = 1;
}

function onButtonUp() {
    this.isdown = false;
    if (this.isOver) {
        this.texture = textureButtonOver;
    } else {
        this.texture = textureButton;
    }
}

function onButtonOver() {
    this.isOver = true;
    if (this.isdown) {
        return;
    }
    this.texture = textureButtonOver;
}

function onButtonOut() {
    this.isOver = false;
    if (this.isdown) {
        return;
    }
    this.texture = textureButton;
}
