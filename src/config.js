const config = {
  prod: {
    endpoint: 'https://k852kxzvyi.execute-api.us-east-1.amazonaws.com/prod',
    civicSip: {
      appId: 'ryTqZdCtz',
    },
  },
};

const defaultStage = 'prod';
const exportedConfig = config[process.env.LOGIN_CONFIG];

export default exportedConfig || config[defaultStage];
