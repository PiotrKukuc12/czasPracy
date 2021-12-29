import app from '../index'
import request = require("supertest");

// describe('Connect to db', () => {
//     it('Powinno zwrócić objekt z bazy danych w postaci przykładowego pracownika', async () => {
//         await connect();
//         const response = await Pracownik.findOne({ name: 'Jan' });
//         await disconnect();
//         if (response) {
//             expect(response.name).toBe('Jan');
//         } else {
//             expect(response).toBe(null);
//         }
//     })
// })

describe("Testy endpointów", () => {
    const randomString = (Math.random() + 1).toString(36).substring(7);
    it("Stworzenie nowego pracownika", async () => {
        const result = await request(app).post("/").send({
            name: randomString,
            opis: randomString
        });
        expect(result.status).toBe(200);
        if (result) {
            expect(result.body.message).toBe("Pracownik został dodany");
            expect(result.body.pracownik.name).toBe(randomString);
        }

    })
    it("Zakończenie pracy pracownika", async () => {
        const result = await request(app).put("/zakonczenie").send({
            name: randomString
        });
        expect(result.status).toBe(200);

    })
    it("Rozpoczęcie nowej pracy pracownika", async () => {
        const result = await request(app).put("/rozpoczecie").send({
            name: randomString,
            opis: randomString
        })
        expect(result.status).toBe(200);
    })
    it("Pobranie listy czasów pracy pracownika", async () => {
        const result = await request(app).get("/historia/" + randomString);
        expect(result.status).toBe(200);
    })
})