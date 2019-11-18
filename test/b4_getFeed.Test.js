const chai = require('chai'), expect = chai.expect;
const request = require('supertest');
const db = require('../models/usingDb/db/index');

const app = require('../app');

describe('Getting a feed', function () {
    this.timeout(5000);
    describe('given the user has logged in,', () => {
        describe('should save the article to the database', () => {
            it('should send a successfull response back to user', (done) => {
                request(app).post('/api/v1/auth/signin')
                    .send({
                        "email": "jumakiwaka@teamwork.com",
                        "password": "nothingcanstopme"
                    })
                    .then(res => {
                        const { body } = res;
                        const { status, data } = body;
                        const { token, userId } = data;
                        request(app).get(`/api/v1/resources/feed`)
                            .send({
                                "userId": `${userId}`
                            })
                            .set('Authorization', `app ${token}`)
                            .then(res => {
                                const { body } = res;
                                console.log(body);

                                const { status, data } = body;
                                expect(res.status).to.equal(200);
                                expect(data).to.be.an('Array');
                                expect(status).to.equal('success');
                                expect(data[0]).to.be.an('Object');
                                done();
                            }).catch(error => {
                                done(error);
                            });

                    })
                    .catch(error => {
                        console.log('error');
                        done(error);
                    });


            });
        });
    });
});