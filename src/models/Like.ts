import * as dynamoose from 'dynamoose';
import * as uuid from 'uuid';

export const LikeSchema = new dynamoose.Schema(
  {
    userId: {
      type: String,
      hashKey: true,
      default: uuid.v1
    },
    imageId: {
      type: String,
      rangeKey: true,
      required: true
    }
  },
  {
    timestamps: true
  }
);
export const Like = dynamoose.model('Like', LikeSchema);
