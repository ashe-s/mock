import * as PIXI from 'pixi.js'
import shuffle from '@/util/shuffleArray'

/***
 * 設定
 */
// canvas
const app = new PIXI.Application({});

// 基本設定
const settings = {
    maxSuccess: 1, // n回正解したらゲームクリア
    maxFailure: 3, // n回連続で失敗したらゲームオーバー？
    cardW: 200,
    cardH: 300,
    margin: 20
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