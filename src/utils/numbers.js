function numberToLetter(n) {
  return (n + 9).toString(36).toUpperCase()
}

function letterToNumber(l) {
  return l.toLowerCase().charCodeAt(0) - 96
}

export const NumberUtils = { numberToLetter, letterToNumber }
