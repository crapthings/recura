### install

```bash
npm i -S recura
```

### usage

```javascript
const findChildren = require('recura')

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
```

result

```javascript
name 1 children
 [
  {
    "id": "2",
    "name": "2",
    "parentId": "1"
  },
  {
    "id": "3",
    "name": "3",
    "parentId": "1"
  },
  {
    "id": "6",
    "name": "6",
    "parentId": "1"
  },
  {
    "id": "4",
    "name": "4",
    "parentId": "3"
  },
  {
    "id": "8",
    "name": "8",
    "parentId": "3"
  },
  {
    "id": "5",
    "name": "5",
    "parentId": "4"
  },
  {
    "id": "7",
    "name": "7",
    "parentId": "4"
  }
]
name 2 children
 []
name 3 children
 [
  {
    "id": "4",
    "name": "4",
    "parentId": "3"
  },
  {
    "id": "8",
    "name": "8",
    "parentId": "3"
  },
  {
    "id": "5",
    "name": "5",
    "parentId": "4"
  },
  {
    "id": "7",
    "name": "7",
    "parentId": "4"
  }
]
name 4 children
 [
  {
    "id": "5",
    "name": "5",
    "parentId": "4"
  },
  {
    "id": "7",
    "name": "7",
    "parentId": "4"
  }
]
name 5 children
 []
name 6 children
 []
name 7 children
 []
name 8 children
 []
```
