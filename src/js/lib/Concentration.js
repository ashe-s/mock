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

// カードの表面画像データ読み込み
const textureCards = {}
lawCards.forEach(val => {
    textureCards[val.id] = PIXI.Texture.fromImage(`img/concentration/${val.id}.png`)
})

// カードの裏面画像データ読み込み
const textureBack = PIXI.Texture.fromImage('img/concentration/back.png')

// ゲーム中のステータス
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
            card.x = col * (sizes.cardW + margin.x)
            card.y = row * (sizes.cardH + margin.y)

            const cardIndex = row * colnum + col

            card.on('pointerdown', function() {
                gameController(cardIndex)
            })

            app.stage.addChild(card)
            fieldCards[cardIndex].pixiSprite = card
        }
    }
    // ひっくり返す演出とか入れるとしたらどうやるんだ
}

/**
 * ゲームを管理
 */
async function gameController(cardIndex) {
    if(status.cardOpened === cardIndex) return

    const currentCard = fieldCards[cardIndex]
    currentCard.pixiSprite.texture = textureCards[currentCard.id]

    if(status.cardOpened === null) {
        status.cardOpened = cardIndex
        return
    }

    if (fieldCards[status.cardOpened].id === fieldCards[cardIndex].id) {

        status.numSuccess++
        await wait(300)
        if (status.numSuccess >= rules.maxSuccess) {
            gameClear()
            resetTurnCards(cardIndex)
            resetStatus()
            return
        }
        clearTurnCards(cardIndex)
    } else {
        status.numFailure++
        await wait(300)
        if (status.numFailure >= rules.maxFailure) {
            gameOver()
            resetTurnCards(cardIndex)
            resetStatus()
            return
        }
        resetTurnCards(cardIndex)
    }

    status.cardOpened = null
    return
}

async function wait(ms) {
    return new Promise(res => {
        setTimeout(() => {
            res()
        }, ms);
    })
}

/**
 * ターン終了時のそれぞれの動作
 */
function resetTurnCards(cardIndex) {
    fieldCards[status.cardOpened].pixiSprite.texture = textureBack
    fieldCards[cardIndex].pixiSprite.texture = textureBack
    return
}

function clearTurnCards(cardIndex) {
    fieldCards[status.cardOpened].pixiSprite.texture = null
    fieldCards[cardIndex].pixiSprite.texture = null
    // カードを消す
    return
}

/**
 * ゲーム終了時の動作
 */
function resetStatus() {
    status.numSuccess = 0
    status.numFailure = 0
    status.cardOpened = null
}

function gameClear() {
    alert('clear!')
}

function gameOver() {
    alert('game over!')
}

initialise()