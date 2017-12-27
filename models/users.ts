import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

/**
 @typedef {Object} Users
 @property {String} active - enable or disable user
 @property {String} avatar - avatar of user
 @property {String} username - username of user
 @property {String} password - password of user
 @property {String} firstName - firstName of user
 @property {String} lastName - lastName of user
 @property {String} gender - gender of user
 @property {String} email - email of user
 @property {String} role - role of user
 @property {ObjectId} type - type of user
 @property {ObjectId} location - location of user
 @property {ObjectId} viewers - registered users who attended page of certain user
 @property {ObjectId} appreciations - likes of user
 @property {ObjectId} followers - registered users who followed certain user
 @property {ObjectId} followings - registered users who are followed by certain user
 @property {String} website - website of user
 @property {String} joinDate - date when user joined application
 @property {String} biography - biography of user
 @property {{phone: String, skype: String, hangouts: String}} contacts - contacts of user
 @property {ObjectId} shows - events created by user
 @property {{facebook: String, google: String, twitter: String}} socials - social network links of user
 @property {ObjectId} comments - comments created by user
 @property {ObjectId} reviews - reviews of events created by user
 @property {String} video - links to video files uploaded by user
 @property {String} audio - links to audio files uploaded by user
 @property {String} photo - links to photo files uploaded by user
 */

export interface User extends mongoose.Document {
  _id: string;
  active: boolean;
  avatar: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  gender: string;
  role: string;
  type: string;
  position: string;
  city: string;
  country: string;
  groupName: string;
  website: string;
  joinDate: Date;
  biography: string;
  contacts: {
    phone: string;
    skype: string;
    hangouts: string;
  };
  shows: {
    owned: string[];
    purchased: string[];
  };
  socials: {
    google: string;
    facebook: string;
    twitter: string;
  };
  statistics: {
    likes: {
      liked: string[],
      likeUser: string[],
      likeShow: string[]
    },
    viewers: number,
    followers: number,
    following: number
  };
  viewers: string[];
  appreciations: string[];
  comments: string[];
  reviews: string[];
  videos: string[];
  audios: string[];
  photos: string[];
  genres: string[];
}

const usersSchema = new Schema({
  active: Boolean,
  avatar: String,
  email: {type: String, unique: true},
  username: String,
  firstName: String,
  lastName: String,
  gender: String,
  role: {type: String, default: 'user'},
  type: String,
  position: String,
  city: String,
  country: String,
  groupName: String,
  website: String,
  joinDate: String,
  biography: String,
  contacts: {
    phone: String,
    skype: String,
    hangouts: String
  },
  shows: {
    owned: [String],
    purchased: [String]
  },
  socials: {
    google: String,
    facebook: String,
    twitter: String
  },
  statistics: {
    likes: {
      liked: [String],
      likeUser: [String],
      likeShow: [String]
    },
    viewers: [String],
    followers: [String],
    following: [String]
  },
  viewers: [String],
  appreciations: [String],
  comments: [String],
  reviews: [String],
  videos: [String],
  audios: [String],
  photos: [String],
  genres: [String]
});

export default mongoose.model('Users', usersSchema);
