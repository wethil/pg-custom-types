# pg-custom-types [![Build Status](https://travis-ci.org/zhm/pg-custom-types.svg?branch=master)](https://travis-ci.org/zhm/pg-custom-types)

Use custom data types with [node-postgres](https://github.com/brianc/node-postgres).

## Installation

```sh
npm install pg-custom-types
```

### Documentation

### `types(pg, connection, name, types, callback)`

Fetches the OIDs for the given types.

### Parameters

| parameter       | type               | description                                                                        |
| --------------- | ------------------ | ---------------------------------------------------------------------------------- |
| `fetcher`       | Object             | The query function of the form `function (sql, callback)`                          |
| `key`           | String             | A name for the given set of types, used to cache the results. It can be anything.  |
| `types`         | Array              | The array of data type names to fetch                                              |
| `callback`      | Function           | The callback to call after the types are fetched                                   |

Callback is called with an object containing a lookup table.

```
{ 21842552: 'geometry',
  21842762: 'geography' }
```

## Example

```js
var types = require('pg-custom-types');

types(types.fetcher(pg, connection), 'postgis', ['geometry', 'geography'], (err, oids) {
  if (err) {
    throw err;
  }

  console.log(oids.geometry);
  console.log(oids.geography);

  pg.setTypeParser(oids.geometry, function (value) {
    // parse geometry type
  });
});
```
