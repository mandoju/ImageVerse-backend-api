export const getGoogleEnviromentVariables = () => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId) {
    throw new Error('Missing google clientId');
  }
  if (!clientSecret) {
    throw new Error('Missing google client');
  }

  return {
    clientId,
    clientSecret
  };
};

export const getAwsEnviromentVariables = () => {
  const awsImagesBucket = process.env.AWS_IMAGES_BUCKET;
  const awsRegion = process.env.AWS_REGION;
  if (!awsImagesBucket) {
    throw new Error('Missing aws bucket variable');
  }
  if (!awsRegion) {
    throw new Error('Missing aws region variable');
  }

  return {
    awsImagesBucket,
    awsRegion
  };
};

export const getApiEnviromentVariables = () => {
  const port = process.env.PORT || '8000';
  const cookieKey = process.env.COOKIE_KEY;
  if (!cookieKey) {
    throw new Error('Missing cookie key variable');
  }

  return {
    port,
    cookieKey
  };
};

export const getJwtEnviromentVariables = () => {
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    throw new Error('missing jwt secret variable');
  }
  return { jwtSecret };
};
