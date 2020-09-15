import moment from 'moment-timezone';

const isTesting = () => process.env.NODE_ENV === 'test';
const logText = text => [`[${moment().format('Y-MM-DD H:mm:ss')}]`, text];
const makeLogger = logger => (...items) => items.map(logText)
  .forEach(t => !isTesting() && logger(...t));
export default {
  info: makeLogger(console.log),
  error: makeLogger(console.error),
};
