/* tslint:disable:no-any */

import { model } from 'mongoose';

import { Tips, TipsResponse } from '../models/tips.model';

const tip = model('Tips');

export function getTipsFromDB(params: {[key: string]: any}): Promise<TipsResponse[]> {
  const projection = params.projection ? params.projection : {};

  return tip
    .find(params.query, projection)
    .sort(params.sort)
    .populate({path: 'addressee', select: {avatar: true, username: true, type: true, location: true}})
    .lean(true)
    .limit(params.limit)
    .exec();
}

export async function addTipToDB(data: Tips): Promise<TipsResponse> {
  const newTip = new tip(data);
  const savedTip = await newTip.save();

  const queryObj = {
    query: {
      _id: savedTip._id
    },
    projection: {
      __v: false,
      addresser: false
    },
    limit: 1
  };
  const tipResponse = await getTipsFromDB(queryObj);

  return tipResponse[0];

}
