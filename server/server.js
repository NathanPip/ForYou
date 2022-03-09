const express = require("express");
const app = express();
const data = require("./db.js");
const path = require("path");
const PORT = process.env.PORT || 5001;

app.use("/", express.static(path.resolve(__dirname, "../client/build")));
app.use("/message", express.json());

app.get("/", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../client/build", "index.html"));
});

app.post("/message/send", async (req, res) => {
  try {
    console.log(req.body)
    const { message, msgFor } = req.body;
    await data.query("INSERT INTO messages (message, msgFor) VALUES ($1, $2)", [message, msgFor]);
    res.status(200).send("message sent");
  } catch (err) {
    res.status(400).send(err.message);
  }
});

app.get("/message/:msgFor", async (req, res) => {
    try {
        const {msgFor} = req.params;
        console.log(msgFor)
        const msgs = await data.query("SELECT m.message FROM messages m WHERE m.msgFor = $1", [msgFor])
        console.log(msgs.rows)
        res.send(msgs.rows);
    } catch (err) {
        console.log(err.message)
        res.status(400).send('failed to send message')
    }
})

app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
