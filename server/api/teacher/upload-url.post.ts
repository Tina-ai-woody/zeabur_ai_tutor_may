import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// Explicitly import r2 to ensure it's available
// @ts-ignore
import { r2 } from "../../utils/r2";

export default defineEventHandler(async (event) => {
  const session = await requireAuthSession(event);
  if (session.user.role !== "teacher" && session.user.role !== "admin") {
    throw createError({
      statusCode: 403,
      statusMessage: "Unauthorized",
    });
  }

  const body = await readBody(event);
  const { filename, contentType } = body;

  if (!filename || !contentType) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing filename or contentType",
    });
  }

  const config = useRuntimeConfig();

  // Debug logging
  console.log("R2 Config Check:", {
    hasAccessKey: !!config.r2AccessKeyId,
    hasSecretKey: !!config.r2SecretAccessKey,
    hasAccountId: !!config.r2AccountId,
    hasBucketName: !!config.r2BucketName,
    bucketName: config.r2BucketName,
  });

  if (
    !config.r2AccessKeyId ||
    !config.r2SecretAccessKey ||
    !config.r2AccountId ||
    !config.r2BucketName
  ) {
    console.error("Missing R2 configuration");
    throw createError({
      statusCode: 500,
      statusMessage: "R2 configuration is missing",
    });
  }

  const key = `problems/${Date.now()}-${filename}`;

  const command = new PutObjectCommand({
    Bucket: config.r2BucketName,
    Key: key,
    ContentType: contentType,
  });

  try {
    const url = await getSignedUrl(r2, command, { expiresIn: 3600 });

    return {
      uploadUrl: url,
      key: key,
      publicUrl: `${config.r2PublicDomain}/${key}`,
    };
  } catch (error) {
    console.error("Error generating signed URL:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to generate upload URL",
    });
  }
});
