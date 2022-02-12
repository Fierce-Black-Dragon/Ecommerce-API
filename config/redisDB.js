const { createClient } = require("redis");

const client = createClient();

//to redis db is connection

client.connect();

// when redis db  is ready to use
client.on("ready", () => {
  console.log("Client connected to redis and ready to use...");
});

// if any error occur  (err handler for redis connection)
client.on("error", (err) => {
  console.log(err.message);
});

// when redis db  is close
client.on("end", () => {
  console.log("Client disconnected from redis");
});

//to turn off the process or redis connection terminator
process.on("SIGINT", () => {
  client.quit();
});

module.exports = client;
