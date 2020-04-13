exports.removeUndefined = (array, returnNullIfEmpty = true) => {
  if (!array) return array
  const filtered = array.filter(val => val !== undefined)
  if (!filtered.length && returnNullIfEmpty) return null
  return filtered
}
