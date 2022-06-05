const RandExp = require("randexp");
require("dotenv/config");
const mailjet = require("node-mailjet").connect(
  "e43cfad1d55fc8c7938f9051550ee99d",
  "747c82482ceb04210262dd0f2558bdad"
);
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "FileInventory",
    format: async (req, file) => "pdf" || "docx" || "docx", // supports promises as well
  },
});

const fileFilter = (_, file, cb) => {
  if (
    file.mimetype === "application/pdf" ||
    file.mimetype === "application/msword" ||
    file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const uploadDoc = multer({ storage: storage, fileFilter: fileFilter }).single(
  "document"
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
  uploadDoc,
};
