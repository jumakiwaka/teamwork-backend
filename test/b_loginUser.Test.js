const chai = require('chai'), expect = chai.expect;
const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');



describe('Login', () => {
    // this.timeout(5000);
    describe('A user should be registered', () => {
        it('should return proper response with token and userId', (done) => {

            request(app).post('/api/v1/auth/signin')
                .send({
                    "email": "jumakiwaka@teamwork.com",
                    "password": "nothingcanstopme"
                })
                .then(res => {
                    const { body } = res;
                    const { status, data } = body;
                    const { token, userId } = data;
                    const decoded_token = jwt.verify(token, 'jujucrafteee');
                    const jwt_token = jwt.sign({ userId: userId }, 'jujucrafteee', { expiresIn: '24h' })

                    expect(res.status).to.equal(200);
                    expect(status).to.equal('success');
                    expect(token).to.equal(jwt_token);
                    expect(userId).to.equal(decoded_token.userId);
                    done();
                })
                .catch(error => {
                    console.log('error');
                    done(error);
                });
        });
    })
})