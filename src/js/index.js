"use strict";
// import "dotenv/config";
// import express from "express";
// import { InteractionType, InteractionResponseType } from "discord-interactions";
// import { VerifyDiscordRequest } from "./utils"; // utils.ts は後で作成
// import { Body } from "./message"; // message.ts は後で作成
// const app = express();
// const PORT = process.env.PORT || 3000;
// app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));
// app.post("/interactions", async function (req, res) {
//   const {
//     type,
//     member: { user },
//     data,
//     message,
//   } = req.body;
//   const body = new Body();
//   switch (type) {
//     case InteractionType.PING:
//       return res.send({ type: InteractionResponseType.PONG });
//     default:
//       return res.sendStatus(400);
//   }
// });
// app.listen(PORT, () => {
//   console.log(`Listening on port ${PORT}`);
// });
