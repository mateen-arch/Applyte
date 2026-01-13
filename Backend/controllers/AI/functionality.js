require("dotenv").config();
const {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} = require("@google/genai");
const mime = require("mime-types");
const {
  resumeAnalyzerPrompt,
  jobSearchQueryGeneratorPromt,
} = require("./prompts");
const { text } = require("express");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_KEY,
});

// const resumeAnalyzerHelper = async (resume) => {
//   try {

//     const uploadFile = await ai.files.upload({
//         file: resume.buffer,
//         config: {mimeType: resume.mimetype}
//     })

//     console.log("Is uploaded!");

//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash",
//       contents: createUserContent([
//         createPartFromUri(uploadFile.uri,uploadFile.mimeType),
//         resumeAnylyzerPrompt
//       ])
//     });

//     return response.text;
//   } catch (err) {
//     console.log("Error in Resume Analyzer Helper: ", err);
//     throw err;
//   }
// };

// const resumeAnalyzerHelper = async (resume) => {
//   try {
//     // 1. Upload the file
//     const uploadResult = await ai.files.upload({
//       file: resume.buffer,
//       config: { mimeType: resume.mimetype },
//     });

//     console.log("File uploaded successfully!", uploadResult.file.name);

//     // 2. Generate content using the file reference
//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash",
//       contents: [
//         {
//           role: "user",
//           parts: [
//             {
//               fileData: {
//                 mimeType: uploadResult.file.mimeType,
//                 fileUri: uploadResult.file.uri,
//               },
//             },
//             { text: resumeAnylyzerPrompt },
//           ],
//         },
//       ],
//     });

//     return response.text;
//   } catch (err) {
//     console.log("Error in Resume Analyzer Helper: ", err);
//     throw err;
//   }
// };

const resumeAnalyzerHelper = async (resume) => {
  try {
    // Convert the buffer to a base64 string
    const base64Data = resume.buffer.toString("base64");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          role: "user",
          parts: [
            {
              inlineData: {
                mimeType: resume.mimetype,
                data: base64Data,
              },
            },
            { text: resumeAnalyzerPrompt },
          ],
        },
      ],
    });

    return response.text;
  } catch (err) {
    console.log("Error in Resume Analyzer Helper: ", err);
    throw err;
  }
};

const generateQuery = async (resumeData) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: jobSearchQueryGeneratorPromt(resumeData),
    });

    return response.text;
  } catch (err) {
    console.log("Error in Query Generator: ", err);
    throw err;
  }
};

module.exports = { resumeAnalyzerHelper, generateQuery };
