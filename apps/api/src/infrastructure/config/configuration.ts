export default () => ({
  port: parseInt(process.env.API_PORT ?? "4000", 10),
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN ?? "7d",
  },
  storage: {
    endpoint: process.env.STORAGE_ENDPOINT,
    bucket: process.env.STORAGE_BUCKET,
    accessKey: process.env.STORAGE_ACCESS_KEY,
    secretKey: process.env.STORAGE_SECRET_KEY,
    region: process.env.STORAGE_REGION,
  },
  transcription: {
    provider: process.env.TRANSCRIPTION_PROVIDER ?? "deepgram",
    deepgramApiKey: process.env.DEEPGRAM_API_KEY,
  },
  evaluation: {
    provider: process.env.EVALUATION_PROVIDER ?? "openai",
    openaiApiKey: process.env.OPENAI_API_KEY,
  },
  quota: {
    defaultPlanQuotaSeconds: parseInt(process.env.DEFAULT_PLAN_QUOTA_SECONDS ?? "1800", 10),
  },
});
