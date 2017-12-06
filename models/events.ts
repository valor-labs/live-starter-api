/* tslint:disable:no-any */

import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

/**
 @typedef {Object} Event
 @property {String} genre - genres of a music
 */

export interface Event extends mongoose.Document {
    name: string;
    creator: string;
    description: string;
    artist: string;
    genres: string[];
    posters: string[];
    audios: string[];
    videos: string[];
    appreciations: string[];
    info: string;
    live: boolean;
    completed: boolean;
    location: {
        country: string;
    };
    dateCreated: string;
    datePerformance: string;
    timePerfomance: {
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
    statisctics: {
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
    appreciations: [String],
    info: String,
    live: Boolean,
    completed: Boolean,
    location: {
        country: String
    },
    dateCreated: String,
    datePerformance: String,
    timePerfomance: {
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
    statisctics: {
        likes: [String],
        viewers: [String],
        followers: [String]
    },
    wowza: {
        id: String
    }
});

export default mongoose.model('Events', eventsSchema);
