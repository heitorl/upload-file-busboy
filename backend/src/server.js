import app from "./app.js";

const startServer = async () => {
  try {
    const port = 3000;
    await app.listen(port);
    console.log(`App running on http://localhost:${port}/`);
  } catch (err) {
    console.error(err);
  }
};

startServer();
