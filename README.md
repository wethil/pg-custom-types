# pg-custom-types [![Build Status](https://travis-ci.org/zhm/pg-custom-types.svg?branch=master)](https://travis-ci.org/zhm/pg-custom-types)

Use custom data types with [node-postgres](https://github.com/brianc/node-postgres).

## Installation

```sh
npm install pg-custom-types
```

### Documentation

### `types(pg, connection, types, callback)`

Fetches the OIDs for the given types.

### Parameters

| parameter       | type               | description                                               |
| --------------- | ------------------ | --------------------------------------------------------- |
| `pg`            | Object             | The pg object from `require('pg')`                        |
| `connection`    | String             | The connection string to use when fetching the types      |
| `types`         | Array              | The array of data type names to fetch                     |
| `callback`      | Function           | The callback to call after the types are fetched          |

Callback is calleed with an object containing a lookup table.

```
{ 21842552: 'geometry',
  21842762: 'geograph' }
```

## Example

```js
var types = require('pg-custom-types');

types(pg, connection, ['geometry', 'geography'], (err, oids) {
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
