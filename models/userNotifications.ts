import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

export interface UserNotications extends mongoose.Document {
  userId: string;
  recommendedArtitsShows: boolean;
  featuredShows: boolean;
  alertMeAboutMessage: boolean;
  showAlreadyBegun: boolean;
  followingArtistCreatesNewEvent: boolean;
  showBeginIn: {
    isNotification: boolean;
    timeperiod: string;
  };
}

const userNoticationsSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    index: true,
    ref: 'Users'
  },
  recommendedArtitsShows: {type: Boolean, default: false},
  featuredShows: {type: Boolean, default: false},
  alertMeAboutMessage: {type: Boolean, default: false},
  showAlreadyBegun: {type: Boolean, default: false},
  followingArtistCreatesNewEvent: {type: Boolean, default: false},
  showBeginIn: {
    isNotification: {type: Boolean, default: false},
    timeperiod: {type: String, default: '1hrs'}
  }
});

export default mongoose.model('UserNotications', userNoticationsSchema);
