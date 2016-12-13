import pgformat from 'pg-format';
import array from 'postgres-array';

const OIDS = {};
const NAMES = {};

export default function fetch(execute, uniqueKey, types, callback) {
  if (OIDS[uniqueKey]) {
    return callback(null, OIDS[uniqueKey]);
  }

  let sql = 'SELECT oid, typname AS name FROM pg_type WHERE typname IN (%L)';
  sql = pgformat(sql, types);

  execute(sql, (err, rows) => {
    if (err) {
      return callback(err);
    }

    OIDS[uniqueKey] = {};
    NAMES[uniqueKey] = {};

    for (let row of rows) {
      OIDS[uniqueKey][row.name] = +row.oid;
      NAMES[uniqueKey][+row.oid] = row.name;
    }

    callback(null, OIDS[uniqueKey]);
  });
}

fetch.fetcher = function (pg, connection) {
  return (sql, callback) => {
    pg.connect(connection, (err, client, done) => {
      if (err) {
        return callback(err);
      }

      client.query(sql, null, (err, result) => {
        done();

        if (err) {
          return callback(err);
        }

        callback(null, result.rows);
      });
    });
  };
};

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

fetch.getTypeName = function (oid, key) {
  return NAMES[key][+oid];
};

fetch.getTypeOID = function (name, key) {
  return OIDS[key][name];
};

fetch.parseArray = function (parser) {
  return fetch.allowNull((value) => array.parse(value, fetch.allowNull(parser)));
};
