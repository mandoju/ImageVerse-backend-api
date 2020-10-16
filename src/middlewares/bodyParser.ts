import * as BodyParser from 'body-parser';

export const bodyParserBodyMiddleware = BodyParser.urlencoded({
  extended: false
});
