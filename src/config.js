const config = {
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
