const map = require('lodash.map')
const groupBy = require('lodash.groupby')
const isFunction = require('isfunction')

module.exports = function findChildren(root, items = [], opts = {}, mapper) {
  const { rootKey, foreignKey, withRoot, rootKeyOnly } = opts
  const groupItemsByForeignKey = groupBy(items, foreignKey)

  const bypass = {}
  let children = [root]

  recurse()

  if (!withRoot)
    children.shift()

  if (rootKeyOnly)
    children = map(children, rootKey)

  if (isFunction(mapper))
    return map(children, mapper)

  return children

  function recurse() {
    for (child of children) {
      if (bypass[child[rootKey]]) continue
      const foundChildren = groupItemsByForeignKey[child[rootKey]]
      if (foundChildren) {
        children = children.concat(foundChildren)
        bypass[child[rootKey]] = true
        recurse()
      }
    }
  }
}
