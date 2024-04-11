import mongoose from "mongoose";
import User from '../dao/Users.dao.js';
import chai from "chai";

const expect = chai.expect;

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
       expect(result).to.be.an('array');
    });

    it('El Dao debe agregar un usuario correctamente a la base de datos', async function(){
        const mockedUser = {
            first_name: 'Fernando',
            last_name: 'Giraudo',
            email: 'fergiraudo91@gmail.com',
            password: '123456789'
        }

        const result = await this.userDao.save(mockedUser);
        expect(result).to.be.an('object');
        expect(result).to.not.be.empty;
    });

    it('El DAO agregará al documento un array vacío de mascotas', async function(){
        const mockedUser = {
            first_name: 'Fernando',
            last_name: 'Giraudo',
            email: 'fergiraudo91@gmail.com',
            password: '123456789'
        }

        const result = await this.userDao.save(mockedUser);
        expect(result.pets).to.be.deep.an('array');
        expect(result.pets).to.be.empty;
    });

    it('El DAO puede obtener un usuario por email', async function(){
        const mockedUser = {
            first_name: 'Fernando',
            last_name: 'Giraudo',
            email: 'fergiraudo91@gmail.com',
            password: '123456789'
        }
        const objectIdRegex = /^[0-9a-fA-F]{24}$/;
        const result = await this.userDao.save(mockedUser);
        const user = await this.userDao.getBy({email: result.email});
        expect(user).to.be.an('object');
        expect(user._id).to.match(objectIdRegex);
    });

    it('Verificar el delete del DAO', async function(){
        const mockedUser = {
            first_name: 'Fernando',
            last_name: 'Giraudo',
            email: 'fergiraudo91@gmail.com',
            password: '123456789'
        }

        const result = await this.userDao.save(mockedUser);
        const deletedUser = await this.userDao.delete(result._id);
        const objectIdRegex = /^[0-9a-fA-F]{24}$/;
        expect(deletedUser._id).to.match(objectIdRegex);
        const searchDeletedUser = await this.userDao.getBy({_id: result._id});
        expect(searchDeletedUser).to.not.exist;
    });

    it('Verificar el update del DAO', async function(){
        const mockedUser = {
            first_name: 'Fernando',
            last_name: 'Giraudo',
            email: 'fergiraudo91@gmail.com',
            password: '123456789'
        }

        const result = await this.userDao.save(mockedUser);
        const dataToModified = {
            first_name: 'Sergio',
            last_name: 'Sosa',
            email: 'sersosa@gmail.com',
            password: '987654321'
        }
        
        await this.userDao.update(result._id, dataToModified);
        const userModified = await this.userDao.getBy({_id: result._id});
        expect(userModified.first_name).to.be.equal(dataToModified.first_name);
        expect(userModified.last_name).to.be.equal(dataToModified.last_name);
        expect(userModified.email).to.be.equal(dataToModified.email);
    });
});