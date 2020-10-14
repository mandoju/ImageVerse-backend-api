import * as dynamoose from 'dynamoose';
import { Schema } from 'dynamoose';
import * as uuid from 'uuid';
import { User, UserSchema } from './User';

const imageSchema = new dynamoose.Schema(
  {
    id: {
      type: String,
      hashKey: true,
      default: uuid.v1
    },
    title: {
      type: String
    },
    url: {
      type: String
    },
    likeCount: {
      type: String
    },
    // @ts-ignore: Right acordding argumentation
    creator: User
  },
  {
    timestamps: true
  }
);
export const Image = dynamoose.model('Image', imageSchema);
