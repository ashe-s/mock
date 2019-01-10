import shuffle from '@/util/shuffleArray'

/***
 * 設定変数
 */

// 基本設定
const settings = {
    maxSuccess: 1, // n回正解したらゲームクリア
    maxTry: 3, // n回連続で失敗したらゲームオーバー？ 
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
const setCards = lawCards.map(val => {
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
    numfailure: 0
}

