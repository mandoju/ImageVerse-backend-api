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
