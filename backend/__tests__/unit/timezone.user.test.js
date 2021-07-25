const request = require('../apitest');
const truncate = require('../utils/truncate');
const app = require('../../src/app');
const factory = require('../factories');
const User = require('../../src/models/User');
const roles = require('../../src/constants/roles');
const { authenticate } = require('../utils/auth');
const TimeZone = require('../../src/models/TimeZone');


describe('TimeZone as User', () => {

    beforeEach(async () => {
        await truncate();
    });

    it('should list timezones', async () => {
        const user = await authenticate();
        await factory.createMany('TimeZone', 3, {
            idUser: user.id
        })
        const response = await request(app)
            .get('/timezones')
            .authenticate(user)

        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(3);
    })

    it('should not list time zones from other users', async () => {
        const user = await authenticate();
        await factory.createMany('TimeZone', 2, {
            idUser: user.id
        })
        await factory.createMany('TimeZone', 3)
        const response = await request(app)
            .get('/timezones')
            .authenticate(user)

        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(2);
    })

    it('should get time zone', async () => {
        const user = await authenticate();
        const timeZone = await factory.create('TimeZone', { idUser: user.id })
        const response = await request(app)
            .get(`/timezones/${timeZone.id}`)
            .authenticate(user)

        expect(response.status).toBe(200);
        expect(response.body.data.id).toBe(timeZone.id);
    })

    it('should not get time zone from other user', async () => {
        const user = await authenticate();
        const timeZone = await factory.create('TimeZone')
        const response = await request(app)
            .get(`/timezones/${timeZone.id}`)
            .authenticate(user)

        expect(response.status).toBe(404);
    })

    it('should create time zone', async () => {
        const user = await authenticate();

        const name = factory.chance('string')()
        const cityName = factory.chance('city')()
        const timeDifferenceGMT = factory.chance('floating', { fixed: 1, min: -12, max: 12 })()

        const response = await request(app)
            .post(`/timezones`)
            .authenticate(user)
            .send({
                name, cityName, timeDifferenceGMT
            })
        
        expect(response.status).toBe(200);

        const createdRecord = await TimeZone.findByPk(response.body.data.id)

        expect(createdRecord.idUser).toBe(user.id);
        expect(createdRecord.name).toBe(name);
        expect(createdRecord.cityName).toBe(cityName);
        expect(createdRecord.timeDifferenceGMT).toBe(timeDifferenceGMT);
    })

    it('should not create time zone for other user', async () => {
        const user = await authenticate();
        const otherUser = await factory.create('User');

        const name = factory.chance('string')()
        const cityName = factory.chance('city')()
        const timeDifferenceGMT = factory.chance('floating', { fixed: 1, min: -12, max: 12 })()

        const response = await request(app)
            .post(`/timezones`)
            .authenticate(user)
            .send({
                name, cityName, timeDifferenceGMT,
                idUser: otherUser.id
            })
        
        expect(response.status).toBe(403);
    })

    it('should update time zone', async () => {
        const user = await authenticate();
        const timeZone = await factory.create('TimeZone', { idUser: user.id })
        const newName = await factory.chance('string')()

        const response = await request(app)
            .put(`/timezones/${timeZone.id}`)
            .authenticate(user)
            .send({
                name: newName
            })

        const updatedRecord = await TimeZone.findByPk(timeZone.id)

        expect(response.status).toBe(200);
        expect(updatedRecord.name).toBe(newName);
    })

    it('should not update time zone from other user', async () => {
        const user = await authenticate();
        const timeZone = await factory.create('TimeZone')
        const newName = await factory.chance('string')()

        const response = await request(app)
            .put(`/timezones/${timeZone.id}`)
            .authenticate(user)
            .send({
                name: newName
            })

        const updatedRecord = await TimeZone.findByPk(timeZone.id)

        expect(response.status).not.toBe(200);
        expect(updatedRecord.name).not.toBe(newName);
    })

    it('should delete time zone', async () => {
        const user = await authenticate();
        const timeZone = await factory.create('TimeZone', { idUser: user.id })

        const response = await request(app)
            .delete(`/timezones/${timeZone.id}`)
            .authenticate(user)

        const deletedRecord = await TimeZone.findByPk(timeZone.id)

        expect(response.status).toBe(200);
        expect(deletedRecord).toBe(null);
    })

    it('should not delete time zone from other user', async () => {
        const user = await authenticate();
        const timeZone = await factory.create('TimeZone')

        const response = await request(app)
            .delete(`/timezones/${timeZone.id}`)
            .authenticate(user)

        const deletedRecord = await TimeZone.findByPk(timeZone.id)

        expect(response.status).not.toBe(200);
        expect(deletedRecord).not.toBe(null);
    })
});