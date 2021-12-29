"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    name: { type: String, required: true },
    pracuje: { type: Boolean, required: true, default: true },
    historia: [
        {
            opis: { type: String, required: true },
            rozpoczęcie: { type: Date, required: true },
            zakończenie: { type: Date, required: false },
            czasPracy: { type: Number, required: false },
        },
    ],
});
const Pracownik = (0, mongoose_1.model)('Pracownik', schema);
exports.default = Pracownik;
