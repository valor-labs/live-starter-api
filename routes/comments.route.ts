/* tslint:disable:no-any */

import { Request, Express, Response } from 'express';

import { HttpStatus } from '../enums/http-status';
import { addCommentToDB, getCommentsFromDB } from '../servises/comments.sertvice';

module.exports = (app: Express): void => {
  app.post('/new-comment', newComment);
  app.get('/get-comments', getComments);
};

async function newComment(req: Request, res: Response): Promise<void> {
  const body = req.body;

  if (!body.commentator || !body.commentedUser || !body.comment) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR)
      .send({message: 'commentator or commentedUser or comment are empty. Add new comment without thats prohibited.'});
  }

  try {
    const respObj = await addCommentToDB(body);

    res.json(respObj);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
}

async function getComments(req: Request, res: Response): Promise<void> {
  const params = {
    query: {},
    projection: {
      __v: false,
      commentedUser: false
    }
  };

  try {
    const respObj = await getCommentsFromDB(params);

    res.json(respObj);
  } catch (error) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(error);
  }
}
