import { S3Client } from "@aws-sdk/client-s3";

const config = useRuntimeConfig();

export const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${config.r2AccountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: config.r2AccessKeyId,
    secretAccessKey: config.r2SecretAccessKey,
  },
});

export const classMaterialsR2 = new S3Client({
  region: "auto",
  endpoint: `https://${config.classMaterialsR2AccountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: config.classMaterialsR2AccessKeyId,
    secretAccessKey: config.classMaterialsR2SecretAccessKey,
  },
});
