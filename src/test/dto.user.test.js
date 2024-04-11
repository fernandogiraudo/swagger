import UserDTO from '../dto/User.dto.js';
import chai from 'chai';

const expect = chai.expect;

describe('Test en UserDTO', () => {
    it('Corroborar que el DTO unifique el nombre y apellido en una única propiedad', () => {
        const user = UserDTO.getUserTokenFrom({
            first_name: 'Fernando',
            last_name: 'Giraudo',
            role: 'admin',
            email: 'fergiraudo91@gmail.com',
            password: '123456789'
        });

        expect(user.name).to.be.equal('Fernando Giraudo');
    });

    it('Eliminar propiedades innecesarias como password, first_name y last_name', () => {
        const user = UserDTO.getUserTokenFrom({
            first_name: 'Fernando',
            last_name: 'Giraudo',
            role: 'admin',
            email: 'fergiraudo91@gmail.com',
            password: '123456789'
        });

        expect(user.first_name).to.not.exist;
        expect(user.last_name).to.not.exist;
        expect(user.password).to.not.exist;
    });
});