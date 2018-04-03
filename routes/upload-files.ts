/* tslint:disable:no-any */
import { Request, Express, Response, NextFunction } from 'express';
import * as mongoose from 'mongoose';
import * as fs from 'fs';
import * as multer from 'multer';
import * as uniqueString from 'unique-string';

import { updateUser } from '../servises/users.service';
import { updateEvent } from '../servises/events.service';
import { UpdateModel } from '../servises/update.interface';
import { BACKEND_URL } from '../config/express.config';
import { HttpStatus } from '../enums/http-status';

const events = mongoose.model('Events');
const upload = multer();

interface SaveFileResponse {
  isSuccess: boolean;
  err?: Error;
}

interface MiddlewareResponse extends Response {
  destroy: Function;
}

module.exports = (app: Express): void => {
  app.get('/api', (req, res) => {
    res.end('file catcher example');
  });
  app.post('/api', upload.array('file'), uploadPoster);
  app.put('/upload-avatar', fileUploaderMiddleware,  uploadAvatar);
};

interface FileUploaderRequest extends Request {
  files: [{
    originalname: string;
    buffer: string;
    mimetype: string;
    size?: number;
    encoding?: string
  }];
}

async function uploadAvatar(req: Request, res: Response): Promise<void> {
  const file = req.body.fileBody;
  const headers = req.headers;
  const filename = headers.filename || new Date().getTime().toString();
  const pathName = `uploads/avatars/${filename}`;
  const allowedMimeTypes = ['image/gif', 'image/jpeg', 'image/pjpeg', 'image/x-png', 'image/png', 'image/svg+xml'];

  if (allowedMimeTypes.indexOf(headers['content-type']) === -1) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({message: 'Unsupported type of file'});
  }

  const savedFile = await saveFile(`./${pathName}`, file);

  if (!savedFile.isSuccess) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(savedFile.err);
  }

  const newImageUrl = `${BACKEND_URL}/${pathName}`;

  const updateParams: UpdateModel = {
    conditions: {_id: headers.userid},
    doc: {
      $set: {avatar: newImageUrl}
    }
  };

  await updateUser(updateParams);

  res.json({
    message: 'Avatar was updating',
    imageUrl: newImageUrl
  });
}

async function uploadPoster(req: FileUploaderRequest, res: Response): Promise<void> {
  const files = req.files;
  const body = req.body;
  const allowedMimeTypes = ['image/gif', 'image/jpeg', 'image/pjpeg', 'image/x-png', 'image/png', 'image/svg+xml'];

  if (!files.length) {
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({message: 'Field is required'});
  }

  files.forEach(file => {
    if (allowedMimeTypes.indexOf(file.mimetype) === -1) {
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({message: 'Unsupported type of file'});
    }

    const uniqName = `${uniqueString()}_${file.originalname}`;
    const pathName = `uploads/posters/${uniqName}`;

    saveFile(`./${pathName}`, file.buffer)
      .then(savedFile => {
        if (!savedFile.isSuccess) {
          res.status(HttpStatus.INTERNAL_SERVER_ERROR).send(savedFile.err);
        }

        const updateParams: UpdateModel = {
          conditions: {_id: body.eventId},
          doc: {
            $push: {posters: uniqName}
          }
        };

        updateEvent(updateParams)
          .then(() => {
            return res.json({success: true, data: 'success'});
          });
      })
      .catch(err => {
        res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({message: err});
      });
  });
}

function saveFile(fileName: string, buffer: Buffer | string): Promise<SaveFileResponse> {
  return new Promise((resolve, reject) => {
    fs.writeFile(fileName, buffer, (err: Error) => {
      const result = {
        isSuccess: true,
        err: undefined
      };

      if (err) {
        result.isSuccess = false;
        result.err = err;
      }
      result.isSuccess = true;

      resolve(result);
    });
  });
}

function fileUploaderMiddleware(req: Request, res: MiddlewareResponse, next: NextFunction) {
  const chunks: Buffer[] = [];

  req.on('end', () => {
    req.body.fileBody = Buffer.concat(chunks);
    next();
  });

  req.on('data', (chunk: Buffer) => {
    chunks.push(chunk);
  });

  req.on('error', (err: Error) => {
    res.destroy(err);
  });
}
