const _ = require('lodash')
const { MongoClient } = require('mongodb')

const findChildren = require('./index.js')

function test1() {
  let items = [
    { id: '1', name: '1' },
    { id: '2', name: '2', parentId: '1' },
    { id: '3', name: '3', parentId: '1' },
    { id: '4', name: '4', parentId: '3' },
    { id: '5', name: '5', parentId: '4' },
    { id: '6', name: '6', parentId: '1' },
    { id: '7', name: '7', parentId: '4' },
    { id: '8', name: '8', parentId: '3' },
    { id: '9', name: '9', parentId: '4' },
    { id: '10', name: '10', parentId: '9' },
    { id: '11', name: '11', parentId: '2' },
  ]

  console.time('test1')
  const cachedItems = _.groupBy(items, 'parentId')
  items.map(item => {
    const children = findChildren(item, items, {
      rootKey: 'id',
      foreignKey: 'parentId',
      pathKey: 'name',
      pathAs: 'path',
      withRoot: true,
      // cachedItems,
      // enableMemoize: true,
    })

    item.children = children
    // return item
    console.log('name', item.name, 'children\n', JSON.stringify(item, null, 2), '\n'.repeat(5))
    throw 1
  })
  console.log(items)
  console.log(items.length)
  console.timeEnd('test1')
}

async function test2 () {

  const client = await MongoClient.connect('mongodb://localhost:27017')
  const cubedb = client.db('meteor')
  const Groups = cubedb.collection('groups')
  const _groups = await Groups.find({ isDeleted: { $ne: true } }).toArray()
  const cachedItems = _.groupBy(_groups, 'parentGroupId')

  console.time('test2')
  const groups = await buildGroups()
  console.log(groups.length)
  console.timeEnd('test2')

  async function buildGroups () {
    const groups = _.map(_groups, (group, idx) => {
      // console.time('findChildren')
      const children = findChildren(group, _groups, {
        rootKey: '_id',
        foreignKey: 'parentGroupId',
        // cachedItems,
        enableMemoize: true,
      })
      // console.timeEnd('findChildren')
      // console.log('group has', children.length, 'children')
      group.children = children
      // if (idx == 1)
        // throw new Error('stop it') // test one
      return group
    })
    return groups
  }

}

test1()
// test2()
//
