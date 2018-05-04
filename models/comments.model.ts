import * as mongoose from 'mongoose';
import { Schema } from 'mongoose';

export interface CommentResponse {
  commentator: {
    avatar: string;
    username: string;
    _id: string;
  };
  comment: string;
  dateCreated: string;
  _id: string;
}

export interface Comment extends mongoose.Document {
  comment: string;
  commentator: string;
  commentedUser: string;
  dateCreated?: string;
}

const commentsSchema = new Schema({
  commentator: {
    type: mongoose.Schema.Types.ObjectId,
    index: true,
    ref: 'Users'
  },
  commentedUser: {
    type: mongoose.Schema.Types.ObjectId,
    index: true,
    ref: 'Users'
  },
  dateCreated: { type: Date, default: Date.now },
  comment: String
});

export default mongoose.model('Comment', commentsSchema);
