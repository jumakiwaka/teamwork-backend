const chai = require('chai'), expect = chai.expect;
const request = require('supertest');
const path = require('path');

const app = require('../app');

describe('Creating a gif', function(){
    this.timeout(10000);
    describe('given the user has logged in,', () => {
        describe('should save the gif to the database', () => {
            
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
                request(app).post('/api/v1/resources/gifs')
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .set('Authorization', `app ${token}`)
                .field('title', "Thank you giphy")
                .field('userId', userId)             
                .attach('photo', path.join(__dirname, "giphy.gif"))
                .then(res => {    
                    
                                   
                    const {body} = res;
                    const {status, data} = body;
                    const {message, gifId, createdOn, title} = data;
                    expect(res.status).to.equal(201);
                    expect(status).to.equal("Success");
                    expect(message).to.equal("GIF image successfully posted");
                    expect(gifId).to.equal(gifId);
                    expect(createdOn).to.equal(createdOn);
                    expect(title).to.equal("Thank you giphy");
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
        
    })
})