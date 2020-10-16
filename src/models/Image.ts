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
      type: Number,
      default: 0
    },
    creator: {
      // @ts-ignore: Right acordding argumentation
      type: User,
      index: {
        name: 'creatorIndex',
        global: true
      }
    }
  },
  {
    timestamps: true
  }
);
export const Image = dynamoose.model('Image', imageSchema);
