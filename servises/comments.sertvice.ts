/* tslint:disable:no-any */

import * as mongoose from 'mongoose';

import { Comment, CommentResponse } from '../models/comments.model';

const comment = mongoose.model('Comment');

export function getCommentsFromDB(params: {[key: string]: any}): Promise<CommentResponse[]> {
  const projection = params.projection ? params.projection : {};

  return comment
    .find(params.query, projection)
    .populate({path: 'commentator', select: {avatar: true, username: true, type: true}})
    .lean(true)
    .limit(params.limit)
    .exec();
}

export async function addCommentToDB(commentObj): Promise<CommentResponse> {
  const newComment = new comment(commentObj);

  const savedComment = await newComment.save();
  const params = {
    query: {
      _id: savedComment._id
    },
    projection: {
      __v: false,

      commentedUser: false
    },
    limit: 1
  };

  const parsedComment = await getCommentsFromDB(params);

  return parsedComment[0];
}
