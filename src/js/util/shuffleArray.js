export default function shuffleArray (array) {
    let n = array.length, t, i

    while (n) {
        i = Math.floor(Math.random() * n--)
        t = array[n]
        array[n] = array[i]
        array[i] = t
    }

    return array;
}