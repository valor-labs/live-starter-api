import { Express, Request, Response } from 'express';

import { HttpStatus } from '../enums/http-status';
import { addTipToDB, getTipsFromDB } from '../servises/tips.service';

module.exports = (app: Express): void => {
  app.post('/save-tip', saveTip);
  app.get('/get-tips', getTips);
};

async function saveTip(req: Request, res: Response): Promise<void> {
  const body = req.body;

  if (!body) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({message: 'Failed, eventId or userId is empty'});

    return;
  }

  body.date = new Date(body.date);

  try {
    const tip = await addTipToDB(body);

    res.json(tip);
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({message: err});
  }
}

async function getTips(req: Request, res: Response): Promise<void> {
  const query = req.query;

  if (!query || !query.findByAddressee) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({message: 'Failed, addressee is empty.'});

    return;
  }

  const queryObj = {
    query: {
      addressee: query.findByAddressee
    },
    projection: {
      __v: false,
      addressee: false
    },
    sort: { date: -1 }
  };

  try {
    const tips = await getTipsFromDB(queryObj);

    res.json(tips);
  } catch (err) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({message: err});
  }
}
