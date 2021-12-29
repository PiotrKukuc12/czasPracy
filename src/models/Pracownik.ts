import { Schema, model, connect } from 'mongoose';

interface Historia {
  opis: string;
  rozpoczęcie: Date;
  zakończenie?: Date;
    czasPracy?: number;
}

interface Pracownik {
  name: string;
  pracuje: boolean;
  historia: Historia[];
}

const schema = new Schema<Pracownik>({
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

const Pracownik = model<Pracownik>('Pracownik', schema);

export default Pracownik;
