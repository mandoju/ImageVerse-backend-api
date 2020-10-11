import express from 'express';
import * as dynamoose from 'dynamoose';
import { routes } from './handlers/image';

const sdk = dynamoose.aws.sdk;
sdk.config.update({
  region: process.env.AWS_REGION || 'us-east-2'
});
if (process.env.NODE_ENV === 'development') {
  dynamoose.aws.ddb.local('http://localhost:8001');
}

const app = express();
const port = process.env.PORT || '8000';

app.use(routes);

app.listen(port, () => {
  return console.log(`Server is listening on ${port}`);
});
