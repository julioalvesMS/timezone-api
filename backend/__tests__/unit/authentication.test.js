const request = require('../apitest');
const truncate = require('../utils/truncate');
const app = require('../../src/app');
const factory = require('../factories');
const roles = require('../../src/constants/roles');
const User = require('../../src/models/User');

describe('Authentication', () => {

    beforeEach(async () => {
        await truncate();
    });

    it('should register', async () => {
        const username = factory.chance('string')();
        const password = factory.chance('string')();

        const response = await request(app)
            .post('/auth/register')
            .send({
                username: username,
                password: password
            })

        expect(response.status).toBe(200);

        const createdRecord = await User.findByPk(response.body.data.id, {
            attributes: {
                include: ['password']
            }
        })

        expect(createdRecord.username).toBe(username);
        expect(createdRecord.password).not.toBe(password);
        expect(await createdRecord.validPassword(password)).toBe(true);
        expect(createdRecord.role).toBe(roles.USER);
    })

    it('should not register duplicate user', async () => {
        const username = factory.chance('string')();
        const password = factory.chance('string')();

        await factory.create('User', {
            username
        });

        const response = await request(app)
            .post('/auth/register')
            .send({
                username: username,
                password: password
            })

        expect(response.status).toBe(400);
    })

    it('should login', async () => {
        const password = factory.chance('string')();

        const user = await factory.create('User', {
            password
        });

        const response = await request(app)
            .post('/auth/login')
            .send({
                username: user.username,
                password: password
            })

        expect(response.status).toBe(200);
        expect(response.body.data.token).not.toBe(undefined);
        expect(response.body.data.token.length).not.toBe(0);
    })

    it('should not login with incorrect username', async () => {
        const password = factory.chance('string')();

        const user = await factory.create('User', {
            password
        });

        const response = await request(app)
            .post('/auth/login')
            .send({
                username: user.username + 'hash',
                password: password,
            })

        expect(response.status).toBe(401);
    })

    it('should not login with wrong password', async () => {
        const password = factory.chance('string')();

        const user = await factory.create('User', {
            password
        });

        const response = await request(app)
            .post('/auth/login')
            .send({
                username: user.username,
                password: password + 'hash'
            })

        expect(response.status).toBe(401);
    })
});