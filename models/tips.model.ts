import { Schema, Document, model } from 'mongoose';

import { City } from './cities.model';
import { Country } from './countries.model';

export interface TipsResponse {
  addresser: {
    avatar: string;
    username: string;
    type: string;
    location: {
      city: City,
      country: Country
    };
  };
  date: Date;
  amountTip: string;
}

export interface Tips extends Document {
  addresser: string;
  addressee: string;
  date: Date;
  amountTip: string;
}

const tips = new Schema({
  addresser: {
    type: Schema.Types.ObjectId,
    index: true,
    ref: 'Users'
  },
  addressee: {
    type: Schema.Types.ObjectId,
    index: true,
    ref: 'Users'
  },
  date: Date,
  amountTip: String
});

export default model('Tips', tips);
