import MP4Demuxer from "./mp4Demuxer.js";
import VideoProcessor from "./videoProcessor.js";

const qvgaConstraints = {
  width: 320,
  height: 240,
};

const vgaConstraints = {
  width: 640,
  height: 480,
};

const hdConstraints = {
  width: 1280,
  height: 720,
};

//codec VP9: https://www.youtube.com/redirect?event=video_description&redir_token=QUFFLUhqazg3ZkFhWW82QVRsRlNFN3dYYUg5NnhtbWNyd3xBQ3Jtc0trdkdCSnNOWVJlN1UzOGE0UkxIMkEtb19GWE1mSDZjUTlaOWlEaEpXQ0VXQnBxbVhKS0d6Y2lKY2wtWFF3a0pIZTJNdmhmR3pXUnNvbW9XdjZOcEFvaUlrRV9RcXVhYVI4clQ3SHhTNmNzNWg3OTRJTQ&q=https%3A%2F%2Fgithub.com%2Fw3c%2Fwebcodecs%2Fblob%2Fb0448b3f559a69509dd4011877c34866b05f806e%2Fsamples%2Fcapture-to-file%2Fencode-worker.js%23L31&v=_1K8dFdZhBg
const encoderConfig = {
  ...qvgaConstraints,
  bitrate: 10e6,
  //WebM
  codec: "vp09.00.10.08",
  pt: 4,
  hardwareAcceleration: "prefer-software",

  // MP4
  // codec: 'avc1.42002A',
  // pt: 1,,
  // hardwareAcceleration: 'prefer-hardware',
  // avc: {format: 'annexb'}
};
const mp4Demuxer = new MP4Demuxer();
const videoProcessor = new VideoProcessor({
  mp4Demuxer,
});

onmessage = async ({ data }) => {
  await videoProcessor.start({
    file: data.files[0],
    encoderConfig,
    sendMessage(message) {
      self.postMessage(message);
    },
  });

  self.postMessage("Mensagem do worker para o app");
};
