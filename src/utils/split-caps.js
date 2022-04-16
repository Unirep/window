export default (str) => {
  const indexes = []
  const split = str.split('')
  for (let x = 0; x < split.length; x++) {
    const c = split[x]
    if (/[A-Z]/.test(c)) {
      split.splice(x, 0, ' ')
      x++
    }
  }
  return split.join('')
}
