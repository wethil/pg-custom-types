import pg from 'pg';
import chai from 'chai';
import pgtypes from '../src';

const should = chai.should();

const connection = 'pg://postgres@localhost/pg_custom_types';

const POSTGIS_TYPES = ['geometry', 'geography'];

describe('custom types', () => {
  it('fetches postgis types', function (done) {
    pgtypes(pgtypes.fetcher(pg, connection), 'postgis', POSTGIS_TYPES, (err, oids) => {
      if (err) {
        return done(err);
      }

      oids.geometry.should.be.a('number');
      oids.geography.should.be.a('number');

      pgtypes.getTypeOID('geometry', 'postgis').should.be.a('number');
      pgtypes.getTypeName(pgtypes.getTypeOID('geometry', 'postgis'), 'postgis').should.eql('geometry');

      done();
    });
  });

  it('fails to fetch non-existent types', function (done) {
    pgtypes(pgtypes.fetcher(pg, connection), 'bogus', ['bogustype'], (err, oids) => {
      if (err) {
        return done(err);
      }

      should.not.exist(oids.bogustype);

      done();
    });
  });
});
