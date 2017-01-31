const mongoose = require('mongoose');
const Schema = mongoose.Schema;
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
const usersSchema = new Schema({
    active: Boolean,
    avatar: String,
    username: { type: String, unique: true },
    password: String,
    firstName: String,
    lastName: String,
    gender: String,
    email: { type: String, unique: true },
    role: { type: String, default: 'user' },
    type: String,
    city: String,
    country: String,
    // location: {type: Schema.Types.ObjectId, ref: 'Locations'},
    viewers: { type: Schema.Types.ObjectId, ref: 'Users' },
    appreciations: { type: Schema.Types.ObjectId, ref: 'Users' },
    followers: { type: Schema.Types.ObjectId, ref: 'Users' },
    followings: { type: Schema.Types.ObjectId, ref: 'Users' },
    website: String,
    joinDate: String,
    biography: String,
    contacts: {
        phone: String,
        skype: String,
        hangouts: String },
    shows: { type: Schema.Types.ObjectId, ref: 'Events' },
    socials: {
        google: String,
        facebook: String,
        twitter: String },
    comments: { type: Schema.Types.ObjectId, ref: 'Comments' },
    reviews: { type: Schema.Types.ObjectId, ref: 'Reviews' },
    video: { type: Schema.Types.ObjectId, ref: 'Media' },
    audio: { type: Schema.Types.ObjectId, ref: 'Media' },
    photo: { type: Schema.Types.ObjectId, ref: 'Media' },
    // genres: {type: Schema.Types.ObjectId, ref: 'Genres'},
    genres: String,
    groupName: String
});
mongoose.model('Users', usersSchema);
