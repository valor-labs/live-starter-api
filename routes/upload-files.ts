/* tslint:disable:no-any */
import { Request, Express } from 'express';
import * as mongoose from 'mongoose';
import * as fs from 'fs';
import * as multer from 'multer';
import * as uniqueString from 'unique-string';

const events = mongoose.model('Events');
const upload = multer();

module.exports = (app: Express): void => {
  app.get('/api', (req, res) => {
    res.end('file catcher example');
  });
  app.post('/api', upload.array('file'), uploadPoster);
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

function uploadPoster(req: FileUploaderRequest, res: any) {
  const files = req.files;
  const body = req.body;
  const allowedMimeTypes = ['image/gif', 'image/jpeg', 'image/pjpeg', 'image/x-png', 'image/png', 'image/svg+xml'];

  if (!files.length) {
    return res.json({success: false, data: null, error: 'Field is required'});
  }

  files.forEach(file => {
    if (allowedMimeTypes.indexOf(file.mimetype) === -1) {
      return res.json({success: false, data: null, error: 'Unsupported type of file'});
    }
    const uniqName = `${uniqueString()}_${file.originalname}`;

    fs.writeFile(`./uploads/posters/${uniqName}`, file.buffer, (err: Error) => {
      if (err) {
        return res.json({success: !err, data: null, err});
      }

      return events
        .update(
          {_id: body.eventId},
          {
            $push: {
              posters: uniqName
            }
          })
        .exec((error: Error) => {
          if (error) {
            return res.json({success: !error, data: null, error});
          }

          return res.json({success: error, data: 'success'});
        });
    });
  });
}
