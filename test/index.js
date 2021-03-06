const success = require('../');
const request = require('supertest');
const express = require('express');
const be = require('bejs');

describe('express-json-success', function () {
    this.timeout(5000);

    describe('success', function () {

        it('should be return: success true, status code 200', function (done) {
            const app = new express();

            //console.log(app.response);
            success(app);

            app.use((req, res) => {
                res.success(true, 'done', 'hello');
                //res.success('ciao');
            });

            request(app.listen())
                .get('/')
                .set('Accept', 'application/json')
                .end((err, res) => {
                    console.log(res.body);
                    console.log(res.status);
                    be.err.equal(res.status, 200);
                    be.err.true(res.body.success);
                    done();
                });
        });

        it('JSONP should be return: success true, status code 200', function (done) {
            const app = new express();

            success(app);

            app.use((req, res) => {
                res.success(true, 'done', 'hello');
            });

            request(app.listen())
                .get('/?callback=cb')
                .set('Accept', 'application/json')
                .end((err, res) => {
                    console.log(res.text);
                    be.err.empty(res.body);
                    be.err.equal(res.status, 200);
                    be.err.contains(res.text, 'cb({');
                    done();
                });
        });

        it('with callback onTrue should be return: success true, status code 200', function (done) {
            const app = new express();

            success(app, {
                onTrue: function (message, result, status) {
                    console.log(status);
                    be.err.equal(status, 200);
                    be.err.equal(message, 'done');
                    be.err.equal(result, 'hello');
                    done();
                }
            });

            app.use((req, res) => {
                res.success(true, 'done', 'hello');
            });

            request(app.listen())
                .get('/')
                .set('Accept', 'application/json')
                .end((err, res) => {
                    console.log(res.body.message);
                });
        });

        it('with callback onFalse should be return: success false, status code 401', function (done) {
            const app = new express();

            success(app, {
                onFalse: function (message, result, status) {
                    console.log(status);
                    be.err.equal(status, 401);
                    be.err.equal(message, 'unauthorized');
                    be.err.equal(result, 'hello');
                    done();
                }
            });

            app.use((req, res) => {
                res.success(false, 'unauthorized', 'hello', 401);
            });

            request(app.listen())
                .get('/')
                .set('Accept', 'application/json')
                .end((err, res) => {
                    console.log(res.body.message);
                });
        });

        it('should be return: success false, status code 200', function (done) {
            const app = new express();

            success(app);

            app.use((req, res) => {
                res.success(false, 'failed', 'hello');
            });

            request(app.listen())
                .get('/')
                .set('Accept', 'application/json')
                .end((err, res) => {
                    console.log(res.body.message);
                    be.err.equal(res.status, 200);
                    be.err.false(res.body.success);
                    done();
                });
        });

        it('should be return: success true, status code 401', function (done) {
            const app = new express();

            success(app);

            app.use((req, res) => {
                res.success(true, 'unauthorized', 'hello', 401);
            });

            request(app.listen())
                .get('/')
                .set('Accept', 'application/json')
                .end((err, res) => {
                    console.log(res.status);
                    console.log(res.body);
                    be.err.equal(res.status, 401);
                    be.err.true(res.body.success);
                    done();
                });
        });

        it('without result should be return: success true, status code 200', function (done) {
            const app = new express();

            success(app);

            app.use((req, res) => {
                res.success(true, 'done');
            });

            request(app.listen())
                .get('/')
                .set('Accept', 'application/json')
                .end((err, res) => {
                    console.log(res.status);
                    console.log(res.body);
                    be.err.equal(res.status, 200);
                    be.err.true(res.body.success);
                    done();
                });
        });

        it('only arg success true', function (done) {
            const app = new express();

            success(app);

            app.use((req, res) => {
                res.success(true);
            });

            request(app.listen())
                .get('/')
                .set('Accept', 'application/json')
                .end((err, res) => {
                    console.log(res.status);
                    console.log(res.body);

                    be.err.equal(res.body.code, 200);
                    be.err.equal(res.body.message, 'ok');
                    be.err.true(res.body.success);
                    done();
                });
        });

        it('only arg success false', function (done) {
            const app = new express();

            success(app);

            app.use((req, res) => {
                res.success(false);
            });

            request(app.listen())
                .get('/')
                .set('Accept', 'application/json')
                .end((err, res) => {
                    console.log(res.status);
                    console.log(res.body);

                    be.err.equal(res.body.code, 200);
                    be.err.equal(res.body.message, 'failed');
                    be.err.false(res.body.success);
                    done();
                });
        });

        it('without argument should be error', function (done) {
            const app = new express();

            success(app);

            app.use((req, res) => {
                try {
                    res.success();
                } catch (e) {
                    be.err(done).equal(e.message, 'first argument must be a boolean type');
                }
            });

            request(app.listen())
                .get('/')
                .set('Accept', 'application/json')
                .end();
        });
    });

    describe('successTrue', function () {
        it('no arguments', function (done) {
            const app = new express();

            success(app);

            app.use((req, res) => {
                res.successTrue();
            });

            request(app.listen())
                .get('/')
                .set('Accept', 'application/json')
                .end((err, res) => {
                    console.log(res.status);
                    console.log(res.body);

                    be.err.equal(res.body.code, 200);
                    be.err.equal(res.body.message, 'ok');
                    be.err.true(res.body.success);
                    done();
                });
        });
        it('with argument message', function (done) {
            const app = new express();

            success(app);

            app.use((req, res) => {
                res.successTrue('hello');
            });

            request(app.listen())
                .get('/')
                .set('Accept', 'application/json')
                .end((err, res) => {
                    console.log(res.status);
                    console.log(res.body);

                    be.err.equal(res.body.code, 200);
                    be.err.equal(res.body.message, 'hello');
                    be.err.true(res.body.success);
                    done();
                });
        });
        it('with argument message and status code', function (done) {
            const app = new express();

            success(app);

            app.use((req, res) => {
                res.successTrue('hello', null, 400);
            });

            request(app.listen())
                .get('/')
                .set('Accept', 'application/json')
                .end((err, res) => {
                    console.log(res.status);
                    console.log(res.body);

                    be.err.equal(res.body.code, 400);
                    be.err.equal(res.body.message, 'hello');
                    be.err.true(res.body.success);
                    done();
                });
        });
    });

    describe('successFalse', function () {
        it('no arguments', function (done) {
            const app = new express();

            success(app);

            app.use((req, res) => {
                res.successFalse();
            });

            request(app.listen())
                .get('/')
                .set('Accept', 'application/json')
                .end((err, res) => {
                    console.log(res.status);
                    console.log(res.body);

                    be.err.equal(res.body.code, 200);
                    be.err.equal(res.body.message, 'failed');
                    be.err.false(res.body.success);
                    done();
                });
        });
        it('with argument message', function (done) {
            const app = new express();

            success(app);

            app.use((req, res) => {
                res.successFalse('hello');
            });

            request(app.listen())
                .get('/')
                .set('Accept', 'application/json')
                .end((err, res) => {
                    console.log(res.status);
                    console.log(res.body);

                    be.err.equal(res.body.code, 200);
                    be.err.equal(res.body.message, 'hello');
                    be.err.false(res.body.success);
                    done();
                });
        });
        it('with argument message and status code', function (done) {
            const app = new express();

            success(app);

            app.use((req, res) => {
                res.successFalse('hello', null, 400);
            });

            request(app.listen())
                .get('/')
                .set('Accept', 'application/json')
                .end((err, res) => {
                    console.log(res.status);
                    console.log(res.body);

                    be.err.equal(res.body.code, 400);
                    be.err.equal(res.body.message, 'hello');
                    be.err.false(res.body.success);
                    done();
                });
        });
    });

    describe('successIf', function () {
        it('truthy result, should be return success true', function (done) {
            const app = new express();

            success(app);

            app.use((req, res) => {
                res.successIf([]);
            });

            request(app.listen())
                .get('/')
                .set('Accept', 'application/json')
                .end((err, res) => {
                    console.log(res.status);
                    console.log(res.body);

                    be.err.equal(res.body.code, 200);
                    be.err.equal(res.body.message, 'ok');
                    be.err.true(res.body.success);
                    done();
                });
        });
        it('falsy result, should be return success false', function (done) {
            const app = new express();

            success(app);

            app.use((req, res) => {
                res.successIf(0);
            });

            request(app.listen())
                .get('/')
                .set('Accept', 'application/json')
                .end((err, res) => {
                    console.log(res.status);
                    console.log(res.body);

                    be.err.equal(res.body.code, 500);
                    be.err.equal(res.body.message, 'failed');
                    be.err.false(res.body.success);
                    done();
                });
        });
    });

    describe('successIfNotEmpty', function () {
        it('empty result, should be return success false', function (done) {
            const app = new express();

            success(app);

            app.use((req, res) => {
                res.successIfNotEmpty([]);
            });

            request(app.listen())
                .get('/')
                .set('Accept', 'application/json')
                .end((err, res) => {
                    console.log(res.status);
                    console.log(res.body);

                    be.err.equal(res.body.code, 500);
                    be.err.equal(res.body.message, 'failed');
                    be.err.false(res.body.success);
                    done();
                });
        });
        it('not empty result, should be return success true', function (done) {
            const app = new express();

            success(app);

            app.use((req, res) => {
                res.successIfNotEmpty(['hello']);
            });

            request(app.listen())
                .get('/')
                .set('Accept', 'application/json')
                .end((err, res) => {
                    console.log(res.status);
                    console.log(res.body);

                    be.err.equal(res.body.code, 200);
                    be.err.equal(res.body.message, 'ok');
                    be.err.true(res.body.success);
                    done();
                });
        });
    });
});