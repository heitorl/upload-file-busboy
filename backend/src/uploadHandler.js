import Busboy from "busboy";
import { logger, pipelineAsync } from "./util.js";
import path, { dirname, join } from "path";
import { createWriteStream, existsSync, fsync, mkdirSync } from "fs";

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
    // const saveTo = path.join(__dirname, "../", "downloads", filename);

    const currentDir = new URL(import.meta.url).pathname;
    const saveTo = join(currentDir, "../", "downloads", filename);

    console.log("saveTo", saveTo);
    const saveDir = dirname(saveTo);

    console.log("saveDir", saveDir);

    logger.info("Uploading: " + saveTo);
    await pipelineAsync(
      file,
      this.handleFileBytes.apply(this, [filename]),
      createWriteStream(saveTo)
    );

    logger.info(`File [${filename}] Finished`);
  }
}
