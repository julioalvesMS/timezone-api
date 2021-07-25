const request = require('../apitest');
const truncate = require('../utils/truncate');
const app = require('../../src/app');
const factory = require('../factories');
const User = require('../../src/models/User');
const roles = require('../../src/constants/roles');
const { authenticate } = require('../utils/auth');


describe('User as User', () => {

    beforeEach(async () => {
        await truncate();
    });

    it('should list users', async () => {
        const user = await authenticate();
        const response = await request(app)
            .get('/users')
            .authenticate(user)

        expect(response.status).toBe(200);
    })

    it('should not list other users', async () => {
        const user = await authenticate();
        await factory.createMany('User', 3)
        const response = await request(app)
            .get('/users')
            .authenticate(user)

        expect(response.body.data.length).toBe(1);
    })

    it('should get user', async () => {
        const user = await authenticate();
        const response = await request(app)
            .get(`/users/${user.id}`)
            .authenticate(user)

        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(user.id);
    })

    it('should not get other user', async () => {
        const user = await authenticate();
        const otherUser = await factory.create('User')
        const response = await request(app)
            .get(`/users/${otherUser.id}`)
            .authenticate(user)

        expect(response.status).toBe(404);
    })

    it('should update user', async () => {
        const user = await authenticate();
        const newUsername = await factory.chance('string')()

        const response = await request(app)
            .put(`/users/${user.id}`)
            .authenticate(user)
            .send({
                username: newUsername
            })

        const updatedUser = await User.findByPk(user.id)

        expect(response.status).toBe(200);
        expect(updatedUser.username).toBe(newUsername);
    })

    it('should not update role', async () => {
        const user = await authenticate()

        const response = await request(app)
            .put(`/users/${user.id}`)
            .authenticate(user)
            .send({
                role: roles.ADMIN
            })

        const updatedUser = await User.findByPk(user.id)

        expect(response.status).toBe(403);
        expect(updatedUser.role).not.toBe(roles.ADMIN);
    })

    it('should not update other user', async () => {
        const user = await authenticate();
        const otherUser = await factory.create('User')
        const newUsername = await factory.chance('string')()

        const response = await request(app)
            .put(`/users/${otherUser.id}`)
            .authenticate(user)
            .send({
                username: newUsername
            })

        const updatedUser = await User.findByPk(otherUser.id)

        expect(response.status).not.toBe(200);
        expect(updatedUser.username).not.toBe(newUsername);
    })

    it('should delete user', async () => {
        const user = await authenticate();

        const response = await request(app)
            .delete(`/users/${user.id}`)
            .authenticate(user)

        const deletedUser = await User.findByPk(user.id)

        expect(response.status).toBe(200);
        expect(deletedUser).toBe(null);
    })

    it('should not delete other user', async () => {
        const user = await authenticate();
        const otherUser = await factory.create('User')

        const response = await request(app)
            .delete(`/users/${otherUser.id}`)
            .authenticate(user)

        const deletedUser = await User.findByPk(otherUser.id)

        expect(response.status).not.toBe(200);
        expect(deletedUser).not.toBe(null);
    })
});