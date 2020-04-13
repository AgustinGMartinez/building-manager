const createQueryValues = (initialQuery, data, argsPerEntry) => {
  let newQuery = ''
  data.forEach((_, i) => {
    const nextVal = i + 1
    if (nextVal % argsPerEntry === 1) newQuery += ' ('
    newQuery += `$${nextVal}`
    if (nextVal % argsPerEntry !== 0) newQuery += ', '
    else {
      const isLastValue = nextVal === data.length
      newQuery += ')' + (isLastValue ? '' : ',')
    }
  })
  return initialQuery.replace('?', newQuery)
}

exports.createQueryValues = createQueryValues
