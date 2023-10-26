import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { v4 as uuid } from "uuid";
import * as dotenv from "dotenv";

dotenv.config();

const BUCKET = process.env.BUCKET;
const REGION = process.env.REGION;
const ACCESS_KEY = process.env.ACCESS_KEY;
const SECRET_KEY = process.env.ACCESS_SECRET_KEY;

export const s3Upload = async (fileStream, destinationPath, originalname) => {
  const s3Client = new S3Client({
    region: REGION,
    credentials: {
      accessKeyId: ACCESS_KEY,
      secretAccessKey: SECRET_KEY,
    },
  });

  const uploader = new Upload({
    client: s3Client,
    params: {
      Bucket: BUCKET,
      Key: `${destinationPath}/${uuid()}-${originalname}`,
      Body: fileStream,
    },
  });

  try {
    const result = await uploader.done();
    console.log("Upload Success s3:", result);
  } catch (err) {
    console.error("Error:", err);
  }
};

// export const getS3Object = async (key) => {
//   const s3Client = new S3Client({
//     region: REGION,
//     credentials: {
//       accessKeyId: ACCESS_KEY,
//       secretAccessKey: SECRET_KEY,
//     },
//   });

//   const params = {
//     Bucket: BUCKET,
//     Key: key,
//   };

//   try {
//     const command = new GetObjectCommand(params);
//     const response = await s3Client.send(command);
//     console.log("response", response);

//     return response.Body.toString("utf-8");
//   } catch (err) {
//     console.error("Error:", err);
//     throw err;
//   }
// };
