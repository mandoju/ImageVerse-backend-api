import * as dynamoose from 'dynamoose';
import * as uuid from 'uuid';

const imageSchema = new dynamoose.Schema(
  {
    id: {
      type: String,
      hashKey: true,
      default: uuid.v1()
    },
    title: {
      type: String
    },
    url: {
      type: String
    }
  },
  {
    timestamps: true
  }
);
export const Image = dynamoose.model('Image', imageSchema);
