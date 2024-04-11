import mongoose from "mongoose";
import User from '../dao/Users.dao.js';
import Assert from 'assert';

const assert = Assert.strict;

mongoose.connect('mongodb+srv://fergiraudo91:Luna.2024@coder.3hytpje.mongodb.net/test');

describe('Testing de UserDao', () => {
    before(function(){
        this.userDao = new User();
    });

    beforeEach(function(){
        this.timeout(5000);
        mongoose.connection.collections.users.drop();
    });

    it('El get debe devolver un arreglo', async function(){
        const result = await this.userDao.get();
        assert.strictEqual(Array.isArray(result), true);
    });

    it('El Dao debe agregar un usuario correctamente a la base de datos', async function(){
        const mockedUser = {
            first_name: 'Fernando',
            last_name: 'Giraudo',
            email: 'fergiraudo91@gmail.com',
            password: '123456789'
        }

        const result = await this.userDao.save(mockedUser);
        assert.ok(result._id);
    });

    it('El DAO agregará al documento un array vacío de mascotas', async function(){
        const mockedUser = {
            first_name: 'Fernando',
            last_name: 'Giraudo',
            email: 'fergiraudo91@gmail.com',
            password: '123456789'
        }

        const result = await this.userDao.save(mockedUser);
        assert.deepStrictEqual(result.pets, []);
    });

    it('El DAO puede obtener un usuario por email', async function(){
        const mockedUser = {
            first_name: 'Fernando',
            last_name: 'Giraudo',
            email: 'fergiraudo91@gmail.com',
            password: '123456789'
        }

        const result = await this.userDao.save(mockedUser);
        const user = await this.userDao.getBy({email: result.email});
        assert.ok(user._id);
        assert.strictEqual(typeof user, 'object');
    });
});