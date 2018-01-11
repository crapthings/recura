const _ = require('lodash')
const { MongoClient } = require('mongodb')

const findChildren = require('./')

let items = [
  { id: '1', name: '1' },
  { id: '2', name: '2', parentId: '1' },
  { id: '3', name: '3', parentId: '1' },
  { id: '4', name: '4', parentId: '3' },
  { id: '5', name: '5', parentId: '4' },
  { id: '6', name: '6', parentId: '1' },
  { id: '7', name: '7', parentId: '4' },
  { id: '8', name: '8', parentId: '3' },
]

items.map(item => {
  const children = findChildren(item, items, {
    rootKey: 'id',
    foreignKey: 'parentId',
  })

  console.log('name', item.name, 'children\n', JSON.stringify(children, null, 2))
})

async function test () {

  const client = await MongoClient.connect('mongodb://localhost:27017')
  const cubedb = client.db('meteor')
  const Groups = cubedb.collection('groups')

  console.time('groups')
  const groups = await buildGroups()
  console.log(groups.length)
  console.timeEnd('groups')

  async function buildGroups () {
    const _groups = await Groups.find({ isDeleted: { $ne: true } }).toArray()
    const groups = _.map(_groups, group => {
      console.time('findChildren')
      const children = findChildren(group, _groups, {
        rootKey: '_id',
        foreignKey: 'parentGroupId',
      })
      console.timeEnd('findChildren')
      console.log('group has', children.length, 'children')
      group.children = children
      throw new Error('stop it') // test one
      return group
    })
    return groups
  }

}

// test()
