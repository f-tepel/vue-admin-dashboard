exports.getListConfig = function (listType) {
  if (listType === 'strategies') {
    return [
      {
        name: 'name',
        type: 'string'
      },
      {
        name: 'shortName',
        type: 'string'
      },
      {
        name: 'created',
        type: 'date'
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
  } else if (listType === 'portfolios') {
    return [
      {
        name: 'name',
        type: 'string'
      },
      {
        name: 'created',
        type: 'date'
      }
    ]
  } else if (listType === 'trades') {
    return [
      {
        name: 'symbol',
        type: 'string'
      },
      {
        name: 'action',
        type: 'string'
      },
      {
        name: 'created',
        type: 'date'
      }
    ]
  } else if (listType === 'assets') {
    return [
      {
        name: 'name',
        type: 'string'
      },
      {
        name: 'region',
        type: 'string'
      },
      {
        name: 'short',
        type: 'string'
      },
      {
        name: 'long',
        type: 'string'
      }
    ]
  } else if (listType === 'files') {
    return [
      {
        name: 'name',
        type: 'string'
      },
      {
        name: 'region',
        type: 'string'
      },
      {
        name: 'short',
        type: 'string'
      },
      {
        name: 'long',
        type: 'string'
      }
    ]
  } else if (listType === 'portfoliovalues') {
    return [
      {
        name: 'portfolio',
        type: 'string'
      },
      {
        name: 'value',
        type: 'number'
      },
      {
        name: 'created',
        type: 'date'
      },
    ]
  }
}
