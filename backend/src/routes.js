import url from "url";
import { UploadHandler } from "./uploadHandler.js";
import { logger, pipelineAsync } from "./util.js";

class Routes {
  #io;
  constructor(io) {
    this.#io = io;
  }

  options(request, response) {
    response.set({
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "OPTIONS, POST, GET",
    });
    response.status(204).end();
  }

  async post(request, response) {
    const { headers } = request;
    const urlData = url.parse(request.url, true);
    const {
      query: { socketId },
    } = url.parse(request.url, true);
    // const { socketId } = url.parse(request.url, true).query;
    const redirectTo = headers.origin;

    console.log("socket", socketId);
    const uploadHandler = new UploadHandler(this.#io, socketId);

    const onFinish = (response, redirectTo) => () => {
      response.writeHead(303, {
        Connection: "close",
        Location: `${redirectTo}?msg=Files uploaded with success!`,
      });
      response.end();
    };

    const busboyInstance = uploadHandler.registerEvents(
      headers,
      onFinish(response, redirectTo)
    );

    await pipelineAsync(request, busboyInstance);

    logger.info("Request finish with success!");
    // return onFinish(response, headers.origin);
  }
}

export default Routes;
