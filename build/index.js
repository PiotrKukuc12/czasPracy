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
const express_1 = __importDefault(require("express"));
const Pracownik_1 = __importDefault(require("./models/Pracownik"));
const connect_1 = require("./connect");
const moment_1 = __importDefault(require("moment"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
const port = 3000;
app.post('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, connect_1.connect)();
        const newPracownik = new Pracownik_1.default({
            name: req.body.name,
            historia: [
                {
                    opis: req.body.opis,
                    rozpoczęcie: Date.now(),
                },
            ],
        });
        yield newPracownik.save();
        res.status(200).json({
            message: 'Pracownik został dodany',
            pracownik: newPracownik,
        });
    }
    catch (e) {
        res.status(500).json({
            message: 'Nie udało się dodać pracownika',
            error: e,
        });
    }
}));
app.put('/zakonczenie', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, connect_1.connect)();
        const pracownik = yield Pracownik_1.default.findOne({ name: req.body.name });
        if (pracownik) {
            if (pracownik.pracuje === false) {
                res.status(500).json({ msg: 'Pracownik nie może zakończyć nie rozpoczętej pracy' });
                return;
            }
            pracownik.pracuje = false;
            const newDate = new Date();
            pracownik.historia[pracownik.historia.length - 1].zakończenie = new Date(newDate);
            const duration = moment_1.default.duration((0, moment_1.default)(newDate).diff((0, moment_1.default)(pracownik.historia[pracownik.historia.length - 1].rozpoczęcie)));
            const minutes = duration.asMinutes();
            pracownik.historia[pracownik.historia.length - 1].czasPracy = Math.floor(minutes);
            pracownik.save();
            res.status(200).json({
                msg: 'Pracownik zakończył obecną prace',
                praca: pracownik.historia[pracownik.historia.length - 1],
            });
        }
        else {
            res.status(500).json({
                message: 'Pracownik nie istnieje',
            });
        }
    }
    catch (error) {
        res.status(500).json({
            msg: 'Nie udało się zakończyć pracy',
            error,
        });
    }
}));
app.put('/rozpoczecie', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, connect_1.connect)();
        const pracownik = yield Pracownik_1.default.findOne({ name: req.body.name });
        if (pracownik) {
            if (pracownik.pracuje === true) {
                res.status(500).json({
                    msg: 'Pracownik nie może rozpocząć kolejnej pracy.',
                });
                return;
            }
            pracownik.pracuje = true;
            pracownik.historia.push({
                opis: req.body.opis,
                rozpoczęcie: new Date(),
            });
            pracownik.save();
            res.status(200).json({
                msg: 'Pracownik rozpoczął pracę',
                praca: pracownik.historia[pracownik.historia.length - 1],
            });
        }
        else {
            res.status(500).json({
                msg: 'Pracownik nie istnieje',
            });
        }
    }
    catch (error) {
        res.status(500).json({
            msg: 'Nie udało się rozpocząć pracy',
            error,
        });
    }
}));
app.get('/historia/:name', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, connect_1.connect)();
        console.log(req.params.name);
        const pracownik = yield Pracownik_1.default.findOne({ name: req.params.name });
        yield (0, connect_1.disconnect)();
        if (pracownik) {
            res.json({
                msg: 'Historia pracy',
                historia: pracownik.historia,
            });
        }
        else {
            res.status(500).json({
                msg: 'Pracownik nie istnieje',
            });
        }
    }
    catch (error) {
        res.status(500).json({
            msg: 'Nie udało się pobrać historii pracy',
            error,
        });
    }
}));
app.listen(port, () => {
    console.log(`server listening at ${port}`);
});
exports.default = app;
