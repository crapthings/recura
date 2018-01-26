const isFunction = require('isfunction')
const map = require('lodash.map')
const groupBy = require('lodash.groupby')
const memoize = require('lodash.memoize')

const mgby = memoize(groupBy)

module.exports = function findChildren(root, items = [], opts = {}, mapper) {
  const {
    rootKey, foreignKey,
    withRoot, rootKeyOnly,
    enableMemoize,
  } = opts

  const groupItemsByForeignKey = enableMemoize ? mgby(items, foreignKey) : groupBy(items, foreignKey)

  let children = [root]
  let _children = [].concat(children)

  recurse()

  if (!withRoot)
    children.shift()

  if (rootKeyOnly)
    children = map(children, rootKey)

  if (isFunction(mapper))
    return map(children, mapper)

  return children

  function recurse() {
    for (child of _children) {
      _children.shift()

      const foundChildren = groupItemsByForeignKey[child[rootKey]]

      if (!foundChildren)
        return recurse()

      children.push.apply(children, foundChildren)
      _children.push.apply(_children, foundChildren)
      recurse()
    }
  }
}
