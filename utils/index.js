const RandExp = require("randexp");
require("dotenv/config");
const mailjet = require("node-mailjet").connect(
  "e43cfad1d55fc8c7938f9051550ee99d",
  "747c82482ceb04210262dd0f2558bdad"
);

const GenerateCode = (num) => {
  const token = new RandExp(`[0-9]{${num}}`).gen();

  return token;
};

const mailSender = async (to, subject, text, html) => {
  const request = mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: "sammieyisau@gmail.com",
          Name: "Abdussamad",
        },
        To: [to],
        Subject: subject,
        TextPart: text,
        HTMLPart: html,
        CustomID: "AppGettingStartedTest",
      },
    ],
  });

  await request
    .then((result) => {
      console.log(result.body);
    })
    .catch((err) => {
      console.log({ err });
    });
};





module.exports = {
  GenerateCode,
  mailSender,
};
