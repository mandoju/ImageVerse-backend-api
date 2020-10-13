require('dotenv').config();
import express from 'express';
import * as dynamoose from 'dynamoose';
import { routes } from './handlers/image';
import { configurePassport } from './utils/passport';
import { AuthRoutes } from './handlers/auth';
import cookieSession from 'cookie-session';
import passport from 'passport';
import {
  getApiEnviromentVariables,
  getAwsEnviromentVariables
} from './utils/enviroment';

const sdk = dynamoose.aws.sdk;
sdk.config.update({
  region: getAwsEnviromentVariables().awsRegion
});
if (process.env.NODE_ENV === 'development') {
  dynamoose.aws.ddb.local('http://localhost:8001');
}
configurePassport();

const app = express();
const port = getApiEnviromentVariables().port;

app.use(
  cookieSession({
    // milliseconds of a day
    maxAge: 24 * 60 * 60 * 1000,
    name: 'imageverse-cookie',
    keys: [getApiEnviromentVariables().cookieKey]
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(routes);
app.use('/auth', AuthRoutes);

app.listen(port, () => {
  return console.log(`Server is listening on ${port}`);
});
