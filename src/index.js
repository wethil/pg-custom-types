import pgformat from 'pg-format';
import array from 'postgres-array';

const OIDS = {};
const NAMES = {};

export default function fetch(pg, connection, set, types, callback) {
  if (OIDS[set]) {
    return callback(null, OIDS[set]);
  }

  let sql = 'SELECT oid, typname AS name FROM pg_type WHERE typname IN (%L)';
  sql = pgformat(sql, types);

  pg.connect(connection, (err, client, done) => {
    if (err) {
      return callback(err);
    }

    client.query(sql, null, (err, result) => {
      done();

      if (err) {
        return callback(err);
      }

      OIDS[set] = {};
      NAMES[set] = {};

      for (let row of result.rows) {
        OIDS[set][row.name] = +row.oid;
        NAMES[set][+row.oid] = row.name;
      }

      callback(null, OIDS[set]);
    });
  });
}

fetch.names = NAMES;
fetch.oids = OIDS;

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
