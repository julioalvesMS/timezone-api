const request = require('../apitest');
const truncate = require('../utils/truncate');
const app = require('../../src/app');
const factory = require('../factories');
const User = require('../../src/models/User');
const roles = require('../../src/constants/roles');
const { authenticate } = require('../utils/auth');
const TimeZone = require('../../src/models/TimeZone');


describe('TimeZone as Admin', () => {

    beforeEach(async () => {
        await truncate();
    });

    it('should list timezones', async () => {
        const user = await authenticate({role: roles.ADMIN});
        await factory.createMany('TimeZone', 3, {
            idUser: user.id
        })
        const response = await request(app)
            .get('/timezones')
            .authenticate(user)

        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(3);
    })

    it('should list time zones from other users', async () => {
        const user = await authenticate({role: roles.ADMIN});
        await factory.createMany('TimeZone', 2, {
            idUser: user.id
        })
        await factory.createMany('TimeZone', 3)
        const response = await request(app)
            .get('/timezones')
            .authenticate(user)

        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(5);
    })

    it('should get time zone', async () => {
        const user = await authenticate({role: roles.ADMIN});
        const timeZone = await factory.create('TimeZone', { idUser: user.id })
        const response = await request(app)
            .get(`/timezones/${timeZone.id}`)
            .authenticate(user)

        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(timeZone.id);
    })

    it('should get time zone from other user', async () => {
        const user = await authenticate({role: roles.ADMIN});
        const timeZone = await factory.create('TimeZone')
        const response = await request(app)
            .get(`/timezones/${timeZone.id}`)
            .authenticate(user)

        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(timeZone.id);
    })

    it('should update time zone', async () => {
        const user = await authenticate({role: roles.ADMIN});
        const timeZone = await factory.create('TimeZone', { idUser: user.id })
        const newName = await factory.chance('string')()

        const response = await request(app)
            .put(`/timezones/${timeZone.id}`)
            .authenticate(user)
            .send({
                name: newName
            })

        const updatedUser = await TimeZone.findByPk(timeZone.id)

        expect(response.status).toBe(200);
        expect(updatedUser.name).toBe(newName);
    })

    it('should update time zone from other user', async () => {
        const user = await authenticate({role: roles.ADMIN});
        const timeZone = await factory.create('TimeZone')
        const newName = await factory.chance('string')()

        const response = await request(app)
            .put(`/timezones/${timeZone.id}`)
            .authenticate(user)
            .send({
                name: newName
            })

        const updatedUser = await TimeZone.findByPk(timeZone.id)

        expect(response.status).toBe(200);
        expect(updatedUser.name).toBe(newName);
    })

    it('should delete time zone', async () => {
        const user = await authenticate({role: roles.ADMIN});
        const timeZone = await factory.create('TimeZone', { idUser: user.id })

        const response = await request(app)
            .delete(`/timezones/${timeZone.id}`)
            .authenticate(user)

        const deletedRecord = await TimeZone.findByPk(timeZone.id)

        expect(response.status).toBe(200);
        expect(deletedRecord).toBe(null);
    })

    it('should delete time zone from other user', async () => {
        const user = await authenticate({role: roles.ADMIN});
        const timeZone = await factory.create('TimeZone')

        const response = await request(app)
            .delete(`/timezones/${timeZone.id}`)
            .authenticate(user)

        const deletedRecord = await TimeZone.findByPk(timeZone.id)

        expect(response.status).toBe(200);
        expect(deletedRecord).toBe(null);
    })
});