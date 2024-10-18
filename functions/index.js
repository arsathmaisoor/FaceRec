const functions = require("firebase-functions");
const admin = require("firebase-admin");
const AWS = require("aws-sdk");
const path = require("path");
const os = require("os");
const fs = require("fs");

// Initialize Firebase Admin SDK
admin.initializeApp();

// AWS SDK v2 Configuration
AWS.config.update({
  region: "ap-south-1", // Replace with your AWS region
  accessKeyId: "AKIAQ4J5X6G4XRIQAOHV", // Replace with your AWS Access Key
  secretAccessKey: "DU4/My+GKQO5kcBEhY+b4bSv0xRiu/ygtPWiVGuh",
});

const rekognition = new AWS.Rekognition(); // Rekognition client from AWS SDK v2

// Function to check if the collection exists
const collectionExists = async (collectionId) => {
  try {
    const params = {CollectionId: collectionId};
    await rekognition.describeCollection(params).promise();
    console.log(`Collection "${collectionId}" exists.`);
    return true;
  } catch (error) {
    if (error.code === "ResourceNotFoundException") {
      console.log(`Collection "${collectionId}" does not exist.`);
      return false;
    } else {
      throw error; // Any other errors need to be handled
    }
  }
};

// Function to create the collection if it does not exist
const createCollection = async (collectionId) => {
  const params = {CollectionId: collectionId};
  const response = await rekognition.createCollection(params).promise();
  console.log(`Created collection "${collectionId}":`, response);
};

// Cloud Function that triggers on Firebase Storage image upload
exports.trainFace = functions.storage.object().onFinalize(async (object) => {
  const bucket = admin.storage().bucket(object.bucket);
  const filePath = object.name;
  const tempFilePath = path.join(os.tmpdir(), path.basename(filePath));

  try {
    // Collection ID (replace with your collection name)
    const collectionId = "employees";

    // Check if the collection exists; create it if not
    const exists = await collectionExists(collectionId);
    if (!exists) {
      await createCollection(collectionId);
    }

    // Download the image to a temporary directory
    await bucket.file(filePath).download({destination: tempFilePath});
    console.log(`Image downloaded locally to ${tempFilePath}`);

    // Read the image into a buffer to send to Rekognition
    const imageBuffer = fs.readFileSync(tempFilePath);

    // Create parameters to index the face in AWS Rekognition
    const params = {
      CollectionId: collectionId, // Your Rekognition Face Collection ID
      Image: {Bytes: imageBuffer},
      ExternalImageId: path.parse(object.name).name, // Extract the base name
      DetectionAttributes: ["ALL"],
    };

    // Index the face in Rekognition
    const rekognitionResponse = await rekognition.indexFaces(params).promise();

    // Clean up the temporary file
    fs.unlinkSync(tempFilePath);
  } catch (error) {
    console.error("Error indexing face:", error);
  }
});
