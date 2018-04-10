const config = {
  prod: {
    endpoint: 'https://k852kxzvyi.execute-api.us-east-1.amazonaws.com/prod',
    civicSip: {
      appId: 'ryTqZdCtz',
    },
  },
};

const defaultStage = 'prod';
const exportedConfig = process.env.STAGE;

// export default exportedConfig || config[defaultStage];
module.exports = {
  exportedConfig: exportedConfig || config[defaultStage],
};
