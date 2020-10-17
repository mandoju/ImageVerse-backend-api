import * as dynamoose from 'dynamoose';

export const TokenSchema = new dynamoose.Schema(
  {
    tokenId: {
      type: String,
      hashKey: true
    },
    userId: {
      type: String,
      rangeKey: true
    }
  },
  {
    timestamps: true
  }
);

export const Token = dynamoose.model('Token', TokenSchema);
