import pg from 'pg';
import chai from 'chai';
import pgtypes from '../src';

const should = chai.should();

const connection = 'pg://postgres@localhost/pg_custom_types';

const POSTGIS_TYPES = ['geometry', 'geography'];

describe('custom types', () => {
  it('fetches postgis types', function (done) {
    pgtypes(pg, connection, POSTGIS_TYPES, (err, oids) => {
      if (err) {
        return done(err);
      }

      oids.geometry.should.be.a('number');
      oids.geography.should.be.a('number');

      done();
    });
  });

  it('fails to fetch non-existent types', function (done) {
    pgtypes(pg, connection, ['bogustype'], (err, oids) => {
      if (err) {
        return done(err);
      }

      should.not.exist(oids.bogustype);

      done();
    });
  });
});
