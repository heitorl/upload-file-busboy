import pino from "pino";
import { promisify } from "util";
import { pipeline } from "stream";
import path from "path";
import crypto from "crypto";

const logger = pino({
  prettyPrint: {
    ignore: "pid,hostname",
  },
});

const generateUniqueFileNameWithPrefix = (fileOriginalName) => {
  const randomBytes = crypto.randomBytes(4).toString("hex");
  const fileExtension = path.extname(fileOriginalName);
  const originalFileName = path.basename(fileOriginalName, fileExtension);
  const uniqueFileName = `${randomBytes}-${originalFileName}${fileExtension}`;
  return uniqueFileName;
};

const pipelineAsync = promisify(pipeline);

export { logger, pipelineAsync, generateUniqueFileNameWithPrefix };
