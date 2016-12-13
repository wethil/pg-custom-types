'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = fetch;

var _pgFormat = require('pg-format');

var _pgFormat2 = _interopRequireDefault(_pgFormat);

var _postgresArray = require('postgres-array');

var _postgresArray2 = _interopRequireDefault(_postgresArray);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var OIDS = {};
var NAMES = {};

function fetch(execute, uniqueKey, types, callback) {
  if (OIDS[uniqueKey]) {
    return callback(null, OIDS[uniqueKey]);
  }

  var sql = 'SELECT oid, typname AS name FROM pg_type WHERE typname IN (%L)';
  sql = (0, _pgFormat2.default)(sql, types);

  execute(sql, function (err, rows) {
    if (err) {
      return callback(err);
    }

    OIDS[uniqueKey] = {};
    NAMES[uniqueKey] = {};

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = rows[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var row = _step.value;

        OIDS[uniqueKey][row.name] = +row.oid;
        NAMES[uniqueKey][+row.oid] = row.name;
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    callback(null, OIDS[uniqueKey]);
  });
}

fetch.fetcher = function (pg, connection) {
  return function (sql, callback) {
    pg.connect(connection, function (err, client, done) {
      if (err) {
        return callback(err);
      }

      client.query(sql, null, function (err, result) {
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
  return fetch.allowNull(function (value) {
    return _postgresArray2.default.parse(value, fetch.allowNull(parser));
  });
};
//# sourceMappingURL=index.js.map