import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Readable } from "stream";

const s3Client = new S3Client({ region: "us-east-1" });

export async function getConfig(key: string) {
  const response = await s3Client.send(
    new GetObjectCommand({
      Bucket: "newsrevealer-config",
      Key: key,
    })
  );
  const chunks = [];
  for await (const chunk of response.Body as Readable) {
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString());
}
