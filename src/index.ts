import { AppCreator } from './app';
import { getApiEnviromentVariables } from './utils/enviroment';

const port = getApiEnviromentVariables().port;
const app = AppCreator();

app.listen(port, () => {
  return console.log(`Server is listening on ${port}`);
});
