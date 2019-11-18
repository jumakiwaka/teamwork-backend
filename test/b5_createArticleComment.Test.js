const chai = require('chai'), expect = chai.expect;
const request = require('supertest');
const db = require('../models/usingDb/db/index');

const app = require('../app');

describe('Commenting an article', function(){
    this.timeout(5000);
    describe('given the user has logged in,', () => {
        describe('should save the comment to the database', () => {
            it('should send a successfull response back to user', (done) => {
                
                const findAllQuery = 'SELECT * FROM articles';
                db.query(findAllQuery)
                .then(({rows}) => {
                    const {id} = rows[0];
                    request(app).post('/api/v1/auth/signin')
                .send({
                    "email": "jumakiwaka@teamwork.com",
                    "password": "nothingcanstopme"
                })
                .then(res => {
                    const { body } = res;
                    const { status, data } = body;
                    const { token, userId } = data;
                request(app).post(`/api/v1/resources/articles/${id}/comment`)
                .send({
                    "comment" : "You are a js hero!",                    
                    "userId" : `${userId}`
                })                    
                .set('Authorization', `app ${token}`)
                .then(res => {
                    const {body} = res;                        
                    
                    const {status, data} = body;
                    const {message, articleTitle, article, comment} = data;
                    expect(res.status).to.equal(201);
                    expect(status).to.equal("success");
                    expect(message).to.equal("Comment successfully created");                        
                    expect(articleTitle).to.equal(rows[0].title);
                    expect(article).to.equal(rows[0].article);
                    expect(comment).to.equal('You are a js hero!');
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
                .catch(err => {
                    done(err);
                });                    
                
                
            });
        });
        
    });
});