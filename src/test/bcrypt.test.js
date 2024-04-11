import { createHash, passwordValidation } from "../utils/index.js";
import chai from "chai";

const expect = chai.expect;

describe('Test de la funcionalidad de bcrypt', () => {
    it('La contraseña debe ser hasheada correctamente', async function(){
        const password = await createHash('123456789');
        const hashExp = /(?=[A-Za-z0-9@#$%/^.,{}&+!=]+$)^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#$%^&+!=])(?=.{8,}).*$/g;
        expect(password).to.match(hashExp);
    });

    it('El hasheo realizado debe poder compararse de manera efectiva con la contraseña original', async () => {
        const password = '123456789';
        const hashedPassword = await createHash(password);
        const isValid = await passwordValidation({password: hashedPassword}, password);
        expect(isValid).to.be.true;
    });

    it('Si la contraseña se altera, debe fallar en comparación a la contraseña original', async () => {
        const password = '123456789';
        let hashedPassword = await createHash(password);
        hashedPassword = hashedPassword.slice(0, -1) + '$';
        const isValid = await passwordValidation({password: hashedPassword}, password);
        expect(isValid).to.be.false;
    });
});