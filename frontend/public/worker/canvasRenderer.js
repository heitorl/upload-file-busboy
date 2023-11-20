export default class CanvasRenderer {
  /**@param {HTMLCanvasElement} canvas */
  #canvas;
  #ctx;
  constructor(canvas) {
    this.#canvas = canvas;
    this.#ctx = canvas.getContext("2d");
  }

  /** @param {VideoFrame} frame*/
  draw(frame) {
    const { displayWidth, displayHeight } = frame;

    // Obtém o tamanho do canvas
    const canvasWidth = this.#canvas.width;
    const canvasHeight = this.#canvas.height;

    // Calcula as proporções de escala para ajustar o vídeo ao canvas
    const scaleX = canvasWidth / displayWidth;
    const scaleY = canvasHeight / displayHeight;

    // Escolhe a proporção menor para não ultrapassar o canvas
    const scale = Math.min(scaleX, scaleY);

    // Calcula as novas dimensões para o vídeo
    const videoWidth = displayWidth * scale;
    const videoHeight = displayHeight * scale;

    // Calcula as coordenadas para centralizar o vídeo no canvas
    const x = (canvasWidth - videoWidth) / 2;
    const y = (canvasHeight - videoHeight) / 2;

    this.#ctx.drawImage(frame, x, y, videoWidth, videoHeight);
    frame.close();
  }
  getRenderer() {
    const renderer = this;

    let pendingFrame = null;

    return (frame) => {
      const renderAnimationFrame = () => {
        renderer.draw(pendingFrame);
        pendingFrame = null;
      };

      if (!pendingFrame) {
        requestAnimationFrame(renderAnimationFrame);
      } else {
        pendingFrame.close();
      }

      pendingFrame = frame;
    };
  }
}
