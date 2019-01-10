export default function shuffleArray (array) {
    const n = array.length
    let t, i

    while (n) {
        i = Math.floor(Math.random() * n--)
        t = array[n]
        array[n] = array[i]
        array[i] = t
    }

    return array;
}