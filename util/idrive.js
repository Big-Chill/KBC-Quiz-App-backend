const AWS = require('aws-sdk');
const endpoint = process.env.ENDPOINT;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;


const listAllBuckets = async () => {
  const s3 = new AWS.S3({
    endpoint: new AWS.Endpoint(endpoint),
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  });

  const { Buckets } = await s3.listBuckets().promise();
  
  return Buckets;
};


module.exports = {
  listAllBuckets,
};

