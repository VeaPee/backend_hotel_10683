const createServer = require("./app");

const { app, PORT } = createServer();

app.listen(PORT, () => {
  console.log(`Listening on port http://localhost:${PORT}`);
});
