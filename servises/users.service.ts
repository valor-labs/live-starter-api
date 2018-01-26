/* tslint:disable:no-any */

import * as mongoose from 'mongoose';
import { Query } from 'mongoose';

import { UpdateModel } from './update.interface';

const usersModel = mongoose.model('Users');

export function updateUser(params: UpdateModel): Query<any> {
  return usersModel
    .update(params.conditions, params.doc);
}
