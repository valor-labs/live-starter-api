/* tslint:disable:no-any */

import * as mongoose from 'mongoose';
import { Query } from 'mongoose';

import { Event, EventResponse, LinkWithEmbedCode } from '../models/events.model';
import { UpdateModel } from './update.interface';

const eventsModel = mongoose.model('Events');

export interface GetEvetInterface {
  query: {[key: string]: any};
  projection?: {[key: string]: any};
  limit?: number;
  sort?: any;
  select?:  {[key: string]: any};
}

export interface AudiosFromDB {
  audios: LinkWithEmbedCode[];
}

export function updateEvent(params: UpdateModel): Query<any> {
  return eventsModel
    .update(params.conditions, params.doc);
}

export function getEvent(params: GetEvetInterface): Promise<any[]> {
  const projection = params.projection ? params.projection : {};

  return eventsModel
    .find(params.query, projection)
    .sort(params.sort)
    .limit(params.limit)
    .lean(true)
    .exec();
}

export function getEventsAudio(params: GetEvetInterface): Promise<AudiosFromDB[]> {
  return eventsModel
    .find(params.query)
    .sort(params.sort)
    .limit(params.limit)
    .select(params.select)
    .lean(true)
    .exec();
}

export function transformEventToResponceObj(shows: Event[], userId = ''): EventResponse[] {
  return shows.map(show => {
    return {
      ...show,
      statistics: {
        followers: show.statistics.followers.length,
        viewers: show.statistics.viewers.length,
        likes: show.statistics.likes.length
      },
      buyers: show.buyers.length,
      isBought: show.buyers.some(buyer => buyer.userId === userId),
      isFreeForMe: checkIsEventFreeForUser(show, userId)
    };
  });
}

function checkIsEventFreeForUser(show: Event, userId: string): boolean {
  return show.creator === userId || show.artist === userId;
}
