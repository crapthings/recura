const isFunction = require('isfunction')
const map = require('lodash.map')
const groupBy = require('lodash.groupby')
const keyBy = require('lodash.keyby')
const memoize = require('lodash.memoize')

const mgby = memoize(groupBy)

module.exports = function findChildren(root, items = [], opts = {}, mapper) {
  const {
    rootKey, foreignKey,
    withRoot, rootKeyOnly,
    pathKey, pathAs,
    enableMemoize,
    cachedItems,
  } = opts

  const groupItemsByForeignKey = cachedItems
    || enableMemoize
    ? mgby(items, foreignKey)
    : groupBy(items, foreignKey)

  let keyItemsByForeignKey

  const clonedRoot = { ...root }
  let children = [clonedRoot]
  let _children = [].concat(children)

  recurse()

  if (!withRoot)
    children.shift()

  if (rootKeyOnly)
    children = map(children, rootKey)

  if (isFunction(mapper))
    return map(children, mapper)

  if (pathKey) {
    keyItemsByForeignKey = keyBy(items, rootKey)
    for (child of children) {
      child[pathAs] = recursePath(child[foreignKey], [child[pathKey]], keyItemsByForeignKey)
    }
  }

  return children

  function recurse() {
    for (child of _children) {
      _children.shift()

      const hasChildren = groupItemsByForeignKey[child[rootKey]]

      if (!hasChildren)
        return recurse()

      children.push.apply(children, hasChildren)
      _children.push.apply(_children, hasChildren)
      recurse()
    }
  }

  function recursePath(parentId, path = [], cached) {
    const parent = cached[parentId]

    return parent
      ? recursePath(parent[foreignKey], [parent[pathKey], ...path], cached)
      : path
  }
}
