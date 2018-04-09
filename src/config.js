const config = {
  local: {
    endpoint: 'http://localhost:3001',
    civicSip: {
      stage: 'dev',
      appId: 'SkgjG6TYM',
      api: 'https://kw9lj3a57c.execute-api.us-east-1.amazonaws.com/',
    },
  },
  dev: {
    endpoint: 'https://7kc91jmvea.execute-api.us-east-1.amazonaws.com/dev',
    civicSip: {
      stage: 'dev',
      appId: 'SkgjG6TYM',
      api: 'https://kw9lj3a57c.execute-api.us-east-1.amazonaws.com/',
    },
  },
  prod: {
    endpoint: 'https://k852kxzvyi.execute-api.us-east-1.amazonaws.com/prod',
    civicSip: {
      appId: 'ryTqZdCtz',
    },
  },
};

const defaultStage = 'local';
const exportedConfig = config[process.env.REACT_APP_STAGE];

export default exportedConfig || config[defaultStage];
