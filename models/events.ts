import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

/**
 @typedef {Object} Event
 @property {String} genre - genres of a music
 */

export interface IEvent extends mongoose.Document {
  showName: string;
  tickets: number;
  fundedPercentage: number;
  ticketsSold: number;
  ticketsToFund: number;
  ticketPrice: number;
  creator: string;
  showLocation: string;
  dateCreated: any;
  datePerformance: string;
  artist: string;
  genre: any;
  description: string;
  audio: string;
  video: string;
  info: string;
  live: boolean;
  appreciations: any;
}

export const eventsSchema = new Schema({
  showName: String,
  tickets: Number,
  fundedPercentage: Number,
  ticketsSold: Number,
  ticketsToFund: Number,
  ticketPrice: Number,
  creator: String,
  showLocation: String,
  dateCreated: String,
  datePerformance: String,
  artist: String,
  genre: [String],
  description: String,
  audio: [String],
  video: [String],
  info: String,
  live: Boolean,
  appreciations: {
    views: Number,
    likes: Number,
    followers: Number,
    shows: Number
  }
});

export default mongoose.model('Events', eventsSchema);
