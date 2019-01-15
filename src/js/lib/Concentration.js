import * as PIXI from 'pixi.js'
import shuffle from '@/util/shuffleArray'

/***
 * ゲーム設定
 */
// ゲーム終了条件
const rules = {
    maxSuccess: 1, // n回正解したらゲームクリア
    maxFailure: 3, // n回連続で失敗したらゲームオーバー？
}

// 表示用値設定
const sizes = {
    cardW: 200,
    cardH: 300,
    appW: 420,
    appH: 620
}

// canvas設定
const app = new PIXI.Application({
    width: sizes.appW,
    height: sizes.appH,
    backgroundColor: 0xffffff
});

// カードサイズとキャンバスサイズから行と列のカード枚数を求める
const colnum = Math.floor(sizes.appW / sizes.cardW)
const rownum = Math.floor(sizes.appH / sizes.cardH)
const margin = {
    x: sizes.appW % sizes.cardW / (colnum - 1),
    y: sizes.appH % sizes.cardH / (rownum - 1),
}

const textureBack = PIXI.Texture.fromImage('img/concentration/back.png')

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

    document.getElementById('concentration').appendChild(app.view)
    drawCards()
}

/**
 * カードを表示
 */
function drawCards() {
    for (let row = 0; row < rownum; row++) {
        for (let col = 0; col < colnum; col ++) {
            let card = new PIXI.Sprite(textureBack)
            card.interactive = true
            card.buttonMode = true

            card.width = sizes.cardW
            card.height = sizes.cardH
            card.x = row * (sizes.cardW + margin.x)
            card.y = col * (sizes.cardH + margin.y)

            const cardIndex = row * colnum + col

            card.on('pointerdown', function() {
                gameController(cardIndex)
            })

            app.stage.addChild(card)
            fieldCards[cardIndex].pixiSprite = card
        }
    }
    // isOpened = false のやつは等しく裏を表示
    // isOpened = true のやつだけ要素を表示
    // isCleared = true のやつは画像なし（消去）で空白表示

    // ひっくり返す演出とか入れるとしたらどうやるんだろうね（死）
}

/**
 * ゲームを管理
 */
function gameController(cardIndex) {
    if(status.cardOpened === cardIndex) return

    const currentCard = fieldCards[cardIndex]
    // 再描画&裏返しアニメーション
    currentCard.isOpened = true

    if(!status.cardOpened) {
        status.cardOpened = cardIndex
        return
    }

    if (fieldCards[status.cardOpened].id === fieldCards[cardIndex].id) {
        status.numSuccess++
        if (status.numSuccess >= rules.maxSuccess) {
            gameClear()
            return
        }
        clearTurnCards(cardIndex)
    } else {
        status.numFailure++
        if (status.numFailure >= rules.maxFailure) {
            gameOver()
            return
        }
        resetTurnCards(cardIndex)
    }

    status.cardOpened = null
    return
}

/**
 * ターン終了時のそれぞれの動作
 */
function resetTurnCards(cardIndex) {
    fieldCards[status.cardOpened].isOpened = false
    fieldCards[cardIndex].isOpened = false
    // カードを裏返す
    return
}

function clearTurnCards(cardIndex) {
    fieldCards[status.cardOpened].isCleared = true
    fieldCards[cardIndex].isCleared = true
    // カードを消す
    return
}

/**
 * ゲーム終了時の動作
 */
function gameClear() {
    alert('clear!')
}

function gameOver() {
    alert('game over!')
}

initialise()