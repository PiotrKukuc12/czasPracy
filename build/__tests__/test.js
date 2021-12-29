"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../index"));
const request = require("supertest");
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
    it("Stworzenie nowego pracownika", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield request(index_1.default).post("/").send({
            name: randomString,
            opis: randomString
        });
        expect(result.status).toBe(200);
        if (result) {
            expect(result.body.pracownik.name).toBe(randomString);
            expect(result.body.pracownik.historia[0].opis).toBe(randomString);
        }
    }));
    it("Zakończenie pracy pracownika", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield request(index_1.default).put("/zakonczenie").send({
            name: randomString
        });
        expect(result.status).toBe(200);
        if (result) {
            expect(result.body.praca.opis).toBe(randomString);
            expect(result.body.praca.czasPracy).toEqual(0);
        }
    }));
    it("Rozpoczęcie nowej pracy pracownika", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield request(index_1.default).put("/rozpoczecie").send({
            name: randomString,
            opis: randomString
        });
        expect(result.status).toBe(200);
        if (result) {
            expect(result.body.praca.opis).toBe(randomString);
        }
    }));
    it("Pobranie pracownika", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield request(index_1.default).get("/historia/" + randomString);
        expect(result.status).toBe(200);
    }));
});
