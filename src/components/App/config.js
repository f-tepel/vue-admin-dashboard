exports.getListConfig = function (listType) {
  if (listType === 'car') {
    return [
      {
        name: 'name',
        type: 'string'
      },
      {
        name: 'brand',
        type: 'string'
      },
      {
        name: 'ps',
        type: 'number'
      }
    ]
  } else if (listType === 'keys') {
    return [
      {
        name: 'name',
        type: 'string'
      },
      {
        name: 'service',
        type: 'string'
      },
      {
        name: 'baseURL',
        type: 'string'
      }
    ]
  }
}
