const request = require('../apitest');
const truncate = require('../utils/truncate');
const app = require('../../src/app');
const factory = require('../factories');
const User = require('../../src/models/User');
const roles = require('../../src/constants/roles');
const { authenticate } = require('../utils/auth');


describe('User as Admin', () => {

    beforeEach(async () => {
        await truncate();
    });

    it('should list users', async () => {
        const user = await authenticate({role: roles.ADMIN});
        const response = await request(app)
            .get('/users')
            .authenticate(user)

        expect(response.status).toBe(200);
    })

    it('should list other users', async () => {
        const user = await authenticate({role: roles.ADMIN});
        await factory.createMany('User', 3)
        const response = await request(app)
            .get('/users')
            .authenticate(user)

        expect(response.body.data.length).toBe(4);
    })

    it('should get user', async () => {
        const user = await authenticate({role: roles.ADMIN});
        const response = await request(app)
            .get(`/users/${user.id}`)
            .authenticate(user)

        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(user.id);
    })

    it('should get other user', async () => {
        const user = await authenticate({role: roles.ADMIN});
        const otherUser = await factory.create('User')
        const response = await request(app)
            .get(`/users/${otherUser.id}`)
            .authenticate(user)

        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(otherUser.id);
    })

    it('should update user', async () => {
        const user = await authenticate({role: roles.ADMIN});
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

    it('should update role', async () => {
        const user = await authenticate({role: roles.ADMIN});
        const otherUser = await factory.create('User')

        const response = await request(app)
            .put(`/users/${otherUser.id}`)
            .authenticate(user)
            .send({
                role: roles.ADMIN
            })

        const updatedUser = await User.findByPk(otherUser.id)

        expect(response.status).toBe(200);
        expect(updatedUser.role).toBe(roles.ADMIN);
    })

    it('should update other user', async () => {
        const user = await authenticate({role: roles.ADMIN});
        const otherUser = await factory.create('User')
        const newUsername = await factory.chance('string')()

        const response = await request(app)
            .put(`/users/${otherUser.id}`)
            .authenticate(user)
            .send({
                username: newUsername
            })

        const updatedUser = await User.findByPk(otherUser.id)

        expect(response.status).toBe(200);
        expect(updatedUser.username).toBe(newUsername);
    })

    it('should delete user', async () => {
        const user = await authenticate({role: roles.ADMIN});

        const response = await request(app)
            .delete(`/users/${user.id}`)
            .authenticate(user)

        const deletedUser = await User.findByPk(user.id)

        expect(response.status).toBe(200);
        expect(deletedUser).toBe(null);
    })

    it('should delete other user', async () => {
        const user = await authenticate({role: roles.ADMIN});
        const otherUser = await factory.create('User')

        const response = await request(app)
            .delete(`/users/${otherUser.id}`)
            .authenticate(user)

        const deletedUser = await User.findByPk(otherUser.id)

        expect(response.status).toBe(200);
        expect(deletedUser).toBe(null);
    })
});