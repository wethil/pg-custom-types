import pgformat from 'pg-format';
import array from 'postgres-array';

const OIDS = {};
const TYPES = {};

let loaded = false;

export default function fetch(pg, connection, types, callback) {
  if (loaded) {
    return callback(null, OIDS);
  }

  let sql = 'SELECT oid, typname AS name FROM pg_type WHERE typname IN (%L)';
  sql = pgformat(sql, Array.from(types));

  pg.connect(connection, (err, client, done) => {
    if (err) {
      return callback(err);
    }

    client.query(sql, null, (err, result) => {
      done();

      if (err) {
        return callback(err);
      }

      for (let row of result.rows) {
        OIDS[row.name] = +row.oid;
        TYPES[+row.oid] = row.name;
      }

      loaded = true;

      callback(null, OIDS);
    });
  });
}

fetch.types = TYPES;
fetch.ids = OIDS;

fetch.allowNull = function (parser) {
  return function (value) {
    if (value == null) {
      return null;
    }
    return parser(value);
  };
};

fetch.parseArray = function (parser) {
  return fetch.allowNull((value) => array.parse(value, fetch.allowNull(parser)));
};
