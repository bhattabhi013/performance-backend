import app from './app';
import config from './config';
import logger from './utils/logger';

const PORT = config.port;

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});