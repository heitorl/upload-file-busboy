import Busboy from "busboy";
import {
  generateUniqueFileNameWithPrefix,
  logger,
  pipelineAsync,
} from "./util.js";
import path, { dirname, join } from "path";
import { createWriteStream, existsSync, fsync, mkdirSync } from "fs";
import { s3Upload } from "./serviceS3.js";

const FILE_EVENT_NAME = "file-uploaded";

export class UploadHandler {
  #io;
  #socketId;

  constructor(io, socketId) {
    this.#io = io;
    this.#socketId = socketId;
  }

  registerEvents(headers, onFinish) {
    const busboy = new Busboy({ headers });

    busboy.on("file", this.onFile.bind(this));
    busboy.on("finish", onFinish);

    return busboy;
  }

  handleFileBytes(filename) {
    async function* handleData(data) {
      for await (const item of data) {
        const size = item.length;
        // logger.info(`File [${filename}] got ${size} bytes to ${this.#socketId}`)
        this.#io.to(this.#socketId).emit(FILE_EVENT_NAME, size);

        yield item;
      }
    }

    return handleData.bind(this);
  }

  async onFile(fieldname, file, filename) {
    const uniqueFileName = generateUniqueFileNameWithPrefix(filename);

    const currentDir = new URL(import.meta.url).pathname;
    const saveTo = join(currentDir, "../", "downloads", uniqueFileName);
    const saveDir = dirname(saveTo);
    console.log(filename);

    await s3Upload(file, `uploads`, filename);

    logger.info("Uploading: " + saveTo);
    await pipelineAsync(
      file,
      this.handleFileBytes.apply(this, [uniqueFileName]),
      createWriteStream(saveTo)
    );

    logger.info(`File [${filename}] Finished`);
  }
}
