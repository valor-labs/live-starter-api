/* tslint:disable:no-any */

import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

/**
 @typedef {Object} Event
 @property {String} genre - genres of a music
 */

export interface EventResponse {
  name: string;
  creator: string;
  description: string;
  artist: string;
  info: string;
  genres: string[];
  posters: string[];
  audios: string[];
  videos: string[];
  buyers: number;
  live: boolean;
  completed: boolean;
  isFree: boolean;
  isFreeForMe: boolean;
  isBought: boolean;
  location: {
    country: string;
  };
  dateCreated: number;
  datePerformance: number;
  timePerformance: {
    start: string;
    end: string;
  };
  tickets: {
    count: number;
    ticketPrice: number;
    ticketsToFund: number;
    ticketsSold: number;
    fundedPercentage: number;
  };
  statistics: {
    likes: number;
    viewers: number;
    followers: number;
  };
  wowza: {
    id: string;
  };
}

export interface Event extends mongoose.Document {
    name: string;
    creator: string;
    description: string;
    artist: string;
    info: string;
    genres: string[];
    posters: string[];
    audios: string[];
    videos: string[];
    buyers: {[key: string]: any}[];
    appreciations: string[];
    live: boolean;
    completed: boolean;
    isFree: boolean;
    location: {
        country: string;
    };
    dateCreated: number;
    datePerformance: number;
    timePerformance: {
        start: string;
        end: string;
    };
    tickets: {
        count: number;
        ticketPrice: number;
        ticketsToFund: number;
        ticketsSold: number;
        fundedPercentage: number;
    };
    statistics: {
        likes: string[];
        viewers: string[];
        followers: string[];
    };
    wowza: {
        id: string;
    };
}

export const eventsSchema = new Schema({
    name: String,
    creator: String,
    description: String,
    artist: String,
    genres: [String],
    posters: [String],
    audios: [String],
    videos: [String],
    buyers: [{
      userId: String,
      isFree: Boolean
    }],
    appreciations: [String],
    info: String,
    live: Boolean,
    completed: Boolean,
    isFree: Boolean,
    location: {
        country: String
    },
    dateCreated: { type: Date, default: Date.now },
    datePerformance: { type: Date, default: Date.now },
    timePerformance: {
        start: String,
        end: String
    },
    tickets: {
        count: Number,
        ticketPrice: Number,
        ticketsToFund: Number,
        ticketsSold: Number,
        fundedPercentage: Number
    },
    statistics: {
        likes: [String],
        viewers: [String],
        followers: [String]
    },
    wowza: {
        id: String
    }
});

export default mongoose.model('Events', eventsSchema);
