import shuffle from '@/util/shuffleArray'

/***
 * 設定変数
 */
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

// 実際に配置するカードのデータ
// 元データにパラメータを追加し要素を複製、2倍にしておく
let setCards = lawCards.map(val => {
    const newVal = Object.assign({}, val)
    newVal.isOpened = false
    newVal.isCleared = false
    return newVal
})
setCards.map(val => {
    setCards.push(val)
})

const status = {
    cardOpened: null, // setCards のうち表になってるカードのindex
    numSuccess: 0,
    numFailure: 0
}

/**
 * 初期化
 */
function initialise() {
    shuffle(setCards)
    // 表示する
    gameController()
}

/**
 * ゲームを管理
 */
function gameController() {
    const posx = 1, posy = 1 // for test
    const currentCard = setCards[getCardIndexfromPos(posx, posy)]
    // 再描画&裏返しアニメーション
    currentCard.isOpened = true

    if(!status.cardOpened) {
        status.cardOpened = currentCard.id
        return
    }

    if (status.cardOpened === currentCard.id) {
        status.numSuccess++
        if (status.numSuccess >= settings.maxSuccess) {
            gameClear()
            return
        }
        turnSuccess()
        return
    } else {
        status.numFailure++
        if (status.numFailure >= settings.maxFailure) {
            gameOver()
            return
        }
        turnFailure()
        return
    }
}

function getCardIndexfromPos(posx, posy) {
    // クリックされた縦位置を元にどの要素がクリックされたか判定
    let cardindex = 1
    return cardindex
}

/**
 * ターン終了時のそれぞれの動作
 */
function turnSuccess() {}

function turnFailure() {}

/**
 * ゲーム終了時の動作
 */
function gameClear() {
    alart('clear!')
}

function gameOver() {
    alart('game over!')
}

initialise()

console.log(status)