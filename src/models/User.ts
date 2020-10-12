import * as dynamoose from 'dynamoose';
import * as uuid from 'uuid';

export const UserSchema = new dynamoose.Schema(
  {
    id: {
      type: String,
      hashKey: true,
      default: uuid.v1
    },
    email: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    provider: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);
export const User = dynamoose.model('User', UserSchema);
