import chai from "chai";
import supertest from "supertest";

const expect = chai.expect;
const requester = supertest("http://localhost:8080");

describe("Testing adoptme", () => {
  describe("Test de endpoint de mascotas", () => {
    it("El endpoint POST /api/pets debe crear una mascota correctamente", async () => {
      const petMock = {
        name: "Jenny",
        specie: "Dog",
        birthDate: "2011-03-03",
      };

      const { statusCode, _body } = await requester
        .post("/api/pets")
        .send(petMock);
      expect(statusCode).to.be.eql(200);
      expect(_body.payload).to.have.property("_id");
      expect(_body.payload.adopted).to.be.false;
    });

    it("Si se desea crear una mascota sin el campo  nombre, el módulo debe responder con un status 400", async () => {
      const mockPet = {
        specie: "Dog",
        birthDate: "2024-01-01",
      };

      const { statusCode } = await requester.post("/api/pets").send(mockPet);
      expect(statusCode).to.be.equal(400);
    });

    it("Al obtener a las mascotas con el método GET, la respuesta debe tener los campos status y payload. Además, payload debe ser de tipo arreglo", async () => {
      const { statusCode, _body } = await requester.get("/api/pets");
      expect(statusCode).to.be.equal(200);
      expect(_body.payload).to.be.ok;
      expect(_body.payload).to.be.an("array");
      expect(_body.status).to.be.equal("success");
    });

    it("El método PUT debe poder actualizar correctamente a una mascota determinada (esto se puede testear comparando el valor previo con el nuevo valor de la base de datos)", async () => {
      const petMock = {
        name: "Samantha",
        specie: "Dog",
        birthDate: "2013-03-03",
      };

      const { _body } = await requester.post("/api/pets").send(petMock);
      const id = _body.payload._id;
      const modifiedPet = {
        name: "Osito",
        specie: "Cat",
        birthDate: "2023-01-02",
      };

      await requester.put(`/api/pets/${id}`).send(modifiedPet);

      const { _body: updatedPets } = await requester.get("/api/pets");
      const pets = updatedPets.payload;
      const updatedPet = pets.find((p) => p._id === id);
      expect(updatedPet.name).to.be.equal(modifiedPet.name);
      expect(updatedPet.specie).to.be.equal(modifiedPet.specie);
    });

    it("El método DELETE debe poder borrar la última mascota agregada, ésto se puede alcanzar agregando a la mascota con un POST, tomando el id, borrando la mascota  con el DELETE, y luego corroborar si la mascota existe con un GET", async () => {
      const petMock = {
        name: "Bugs Bunny",
        specie: "Bunny",
        birthDate: "2024-01-02",
      };

      const { _body } = await requester.post("/api/pets").send(petMock);
      const id = _body.payload._id;
      await requester.delete(`/api/pets/${id}`);
      const { _body: updatedPets } = await requester.get("/api/pets");
      const pets = updatedPets.payload;
      const updatedPet = pets.find((p) => p._id === id);
      expect(updatedPet).to.not.exist;
    });
  });
  describe("Test avanzados", () => {
    let cookie;
    it("Debe registrar correctamente un usuario", async () => {
      const mockUser = {
        first_name: "Elias",
        last_name: "Ciriaci",
        email: "eliasciriaci@gmail.com",
        password: "123456789",
      };
      const { _body } = await requester
        .post("/api/sessions/register")
        .send(mockUser);
      expect(_body.payload).to.be.ok;
    });

    it("Debe loguear correctamente al usuario y devolver una cookie", async () => {
      const mockUser = {
        email: "eliasciriaci@gmail.com",
        password: "123456789",
      };
      const { headers } = await requester
        .post("/api/sessions/login")
        .send(mockUser);
      const cookieResult = headers["set-cookie"][0];
      expect(cookieResult).to.be.ok;
      cookie = {
        name: cookieResult.split("=")[0],
        value: cookieResult.split("=")[1],
      };
      expect(cookie.name).to.be.ok.and.equal("coderCookie");
      expect(cookie.value).to.be.ok;
    });
    it("Debe enviar la cookie que contiene el usuario y desestructurarla correctamente", async () => {
      const { _body } = await requester
        .get("/api/sessions/current")
        .set("Cookie", [`${cookie.name}=${cookie.value}`]);
      expect(_body.payload.name).to.be.equal("Elias Ciriaci");
      expect(_body.payload.email).to.be.equal("eliasciriaci@gmail.com");
    });
  });
  describe("Test updloads", () => {
    it("Debe poder crearse una mascota con la ruta de imágen", async () => {
      const mockPet = {
        name: "Luna",
        specie: "Cat",
        birthDate: "2022-06-06",
      };
      const { _body, status } = await requester
        .post("/api/pets/withimage")
        .field("name", mockPet.name)
        .field("specie", mockPet.specie)
        .field("birthDate", mockPet.birthDate)
        .attach("image", "src/test/cat.jpg");
      expect(status).to.be.equal(200);
      expect(_body.payload).to.have.property("_id");
      expect(_body.payload.image).to.have.lengthOf.above(2);
    });
  });
});
