exports.removeUndefined = array => array.reduce((a, b) => (b ? a.concat(b) : a), [])
