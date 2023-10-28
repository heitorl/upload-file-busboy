export default class VideoProcessor {
  #mp4Demuxer;
  /**
   * 
    @param {object} options
    @param {import('./mp4Demuxer.js').default} options.mp4Demuxer
   * 
   */

  constructor({ mp4Demuxer }) {
    this.#mp4Demuxer = mp4Demuxer;
  }

  /**@returns {ReadableStream} */
  mp4Decoder(encoderConfig, stream) {
    return new ReadableStream({
      start: async (controller) => {
        const decoder = new VideoDecoder({
          output(frame) {
            controller.enqueue(frame);
          },
          error(e) {
            console.error("error at mp4Decoder", e);
            controller.error(e);
          },
        });

        this.#mp4Demuxer.run(stream, {
          onConfig(config) {
            decoder.configure(config);
          },
          /**@param {EncodedVideoChunk} */
          onChunk(chunk) {
            decoder.decode(chunk);
            debugger;
          },
        });
      },
    });
  }

  async start({ file, encoderConfig }) {
    const stream = file.stream();
    console.log(file, "fileee");
    // const fileName = file[0].replace(".mp4", "");
    await this.mp4Decoder(encoderConfig, stream).pipeTo(
      new WritableStream({
        write(frame) {
          //obtendo cada frame do video
        },
      })
    );
  }
}
