const chai = require('chai'), expect = chai.expect;
const request = require('supertest');

const app = require('../app');

describe('Posting an article', function () {
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
                        request(app).post('/api/v1/resources/articles')
                            .send({
                                "title": "Node 12",
                                "article": "It supports imports just like es6!",
                                "userId": userId
                            })
                            .set('Authorization', `app ${token}`)
                            .then(res => {
                                // console.log(res);

                                const { body } = res;
                                const { status, data } = body;
                                const { message, articleId, createdOn, title } = data;
                                expect(res.status).to.equal(201);
                                expect(status).to.equal("success");
                                expect(message).to.equal("Article successfully posted");
                                expect(articleId).to.equal(articleId);
                                expect(createdOn).to.equal(createdOn);
                                expect(title).to.equal("Node 12");
                                done();
                            }).catch(error => {
                                done(error);
                            });

                    })
                    .catch(error => {
                        console.log('error');
                        done(error);
                    });

            })
        });

    })
})