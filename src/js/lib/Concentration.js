import shuffle from '@/util/shuffleArray'

const settings = {
    numforClear: 1,
    cardW: 200,
    cardH: 300,
    margin: 20
}

const lawCards = [{
    id: 'card1'
}, {
    id: 'card2'
}]

const setCards = lawCards.map(val => {
    const newVal = Object.assign({}, val)
    newVal.isOpened = false
    newVal.isCleared = false
    return newVal
})

setCards.map(val => {
    setCards.push(val)
})