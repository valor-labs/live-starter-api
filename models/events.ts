/* tslint:disable:no-any */

import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

/**
 @typedef {Object} Event
 @property {String} genre - genres of a music
 */

export interface Event extends mongoose.Document {
    showName: string;
    tickets: {
        count: number;
        ticketPrice: number;
        ticketsToFund: number;
        ticketsSold: number;
        fundedPercentage: number;
    };
    creator: string;
    dateCreated: string;
    showLocation: string;
    datePerformance: string;
    timePerfomance: {
        start: string;
        end: string;
    };
    artist: string;
    genres: string[];
    poster: any;
    description: string;
    audio: string;
    video: string;
    info: string;
    live: boolean;
    appreciations: any;
    wowza: {
        id: string;
    };
}

export const eventsSchema = new Schema({
    showName: String,
    tickets: {
        count: Number,
        ticketPrice: Number,
        ticketsToFund: Number,
        ticketsSold: Number,
        fundedPercentage: Number
    },
    creator: String,
    dateCreated: String,
    showLocation: String,
    datePerformance: String,
    timePerfomance: {
        start: String,
        end: String
    },
    artist: String,
    genres: [String],
    poster: Object,
    description: String,
    audio: String,
    video: String,
    info: String,
    live: Boolean,
    appreciations: Object,
    wowza: {
        id: String
    }
});

export default mongoose.model('Events', eventsSchema);
