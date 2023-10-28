let bytesAmount = 0;

const API_URL = "http://localhost:3000";
const ON_UPLOAD_EVENT = "file-uploaded";

const worker = new Worker("worker/worker.js", {
  type: "module",
});

worker.onload = () => worker.postMessage("Mensagem do app para o worker");
// Agora que o Worker está pronto, você pode enviar mensagens para ele

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

function updateStatus(size) {
  const text = `Pending Bytes to upload: <strong> ${formatBytes(
    size
  )} </strong>`;
  document.getElementById("size").innerHTML = text;
}
const showSize = () => {
  const { files: fileElements } = document.getElementById("file");
  if (!fileElements.length) return;

  const files = Array.from(fileElements);

  worker.postMessage({ files });

  const { size } = files.reduce(
    (prev, next) => ({ size: prev.size + next.size }),
    {
      size: 0,
    }
  );

  bytesAmount = size;

  updateStatus(size);

  // const interval = setInterval(() => {
  //   console.count();
  //   const result = bytesAmount - 5e6;
  //   bytesAmount = result < 0 ? 0 : result;
  //   updateStatus(bytesAmount);
  //   if (bytesAmount === 0) clearInterval(interval);
  // }, 50);
};

const configureForm = (targetUrl) => {
  const form = document.getElementById("form");
  form.action = targetUrl;
};

const updateMessage = (message) => {
  const msg = document.getElementById("msg");
  msg.innerText = message;

  msg.classList.add("alert", "alert-success");

  setTimeout(() => (msg.hidden = true), 3000);
};

const showMessage = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const serverMsg = urlParams.get("msg");

  if (!serverMsg) return;

  updateMessage(serverMsg);
};

const onload = () => {
  showMessage();

  // mp4box.onReady = function (info) {
  //   console.log("Método onReady chamado");
  //   console.log(info);
  // };

  const ioClient = io.connect(API_URL, { withCredentials: false });
  ioClient.on("connect", (msg) => {
    console.log("connected!5", ioClient.id);
    const targetUrl = API_URL + `?socketId=${ioClient.id}`;
    configureForm(targetUrl);
  });

  ioClient.on(ON_UPLOAD_EVENT, (bytesReceived) => {
    const { files: fileElements } = document.getElementById("file");
    console.log("RECEBIDO 3.0");
    // const files = Array.from(fileElements);

    // worker.postMessage({ files });

    console.log("received", bytesReceived);
    bytesAmount = bytesAmount - bytesReceived;
    updateStatus(bytesAmount);
  });
  updateStatus(0);
};

window.onload = onload;
window.showSize = showSize;
