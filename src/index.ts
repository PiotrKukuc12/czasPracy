import express, { Application, Request, Response } from 'express';
import Pracownik from './models/Pracownik';
import { connect, disconnect } from './connect';
import moment from 'moment';

const app: Application = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const port = 3000;


app.post('/', async (req: Request, res: Response) => {
  try {
    await connect();
    const newPracownik = new Pracownik({
      name: req.body.name,
      historia: [
        {
          opis: req.body.opis,
          rozpoczęcie: Date.now(),
        },
      ],
    });
    await newPracownik.save()
    res.status(200).json({
      message: 'Pracownik został dodany',
      pracownik: newPracownik,
    });
  } catch (e) {
    res.status(500).json({
        message: 'Nie udało się dodać pracownika',
        error: e,
    });
  }
});

app.put('/zakonczenie', async (req: Request, res: Response) => {
  try {
    await connect();

    const pracownik = await Pracownik.findOne({ name: req.body.name });
    if (pracownik) {
      if (pracownik.pracuje === false) {
        res.status(500).json({ message: 'Pracownik nie może zakończyć nie rozpoczętej pracy' });
        return;
      }

      pracownik.pracuje = false;
      const newDate = new Date();
      pracownik.historia[pracownik.historia.length - 1].zakończenie = new Date(
        newDate
      );

      const duration = moment.duration(
        moment(newDate).diff(
          moment(pracownik.historia[pracownik.historia.length - 1].rozpoczęcie)
        )
      );
      const minutes = duration.asMinutes();
      pracownik.historia[pracownik.historia.length - 1].czasPracy = Math.floor(minutes);

      pracownik.save();
      res.status(200).json({
        msg: 'Pracownik zakończył obecną prace',
      });
    } else {
      res.status(500).json({
        message: 'Pracownik nie istnieje',
      });
    }
  } catch (error) {
    res.status(500).json({
      msg: 'Nie udało się zakończyć pracy',
      error,
    });
  }
});

app.put('/rozpoczecie', async (req: Request, res: Response) => {
  try {
    await connect();
    const pracownik = await Pracownik.findOne({ name: req.body.name });
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
      });
    } else {
      res.status(500).json({
        msg: 'Pracownik nie istnieje',
      });
    }
  } catch (error) {
    res.status(500).json({
        msg: 'Nie udało się rozpocząć pracy',
        error,
    });
  }
});

app.get('/historia/:name', async (req: Request, res: Response) => {
  try {
    await connect();
    const pracownik = await Pracownik.findOne({ name: req.params.name });
    await disconnect();
    if (pracownik) {
      res.json({
        msg: 'Historia pracy',
        historia: pracownik.historia,
      });
    } else {
      res.status(500).json({
        msg: 'Pracownik nie istnieje',
      });
    }
  } catch (error) {
    res.status(500).json({
        msg: 'Nie udało się pobrać historii pracy',
        error,
    })
  }
});

app.listen(port, () => {
  console.log(`server listening at ${port}`);
});

export default app;
