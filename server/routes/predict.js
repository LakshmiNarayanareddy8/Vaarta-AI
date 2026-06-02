const router = require("express").Router();
const multer = require("multer");
const axios = require("axios");
const auth = require("../middleware/auth");
const Prediction = require("../models/Prediction");
const FormData = require("form-data");
const fs = require("fs");
const path = require("path");

const upload = multer({ dest: "uploads/" });

router.post(
  "/predict",
  auth,
  upload.single("image"),
  async (req, res) => {
    try {
      console.log("=== PREDICTION REQUEST STARTED ===");
      console.log("User ID:", req.user.id);
      console.log("Request Body:", { text: req.body.text ? "text provided" : "no text", hasImage: !!req.file });
      
      const form = new FormData();

      if (req.file) {
        console.log("Image file detected:", { 
          filename: req.file.originalname, 
          mimetype: req.file.mimetype, 
          size: req.file.size 
        });
        form.append(
          "image",
          fs.createReadStream(path.resolve(req.file.path)),
          {
            filename: req.file.originalname,
            contentType: req.file.mimetype
          }
        );
      }

      if (req.body.text) {
        form.append("text", req.body.text);
        console.log("Text appended:", req.body.text.substring(0, 100) + "...");
      }

      const mlServiceUrl = `${process.env.ML_SERVICE_URL}/predict`;
      console.log("ML_SERVICE_URL environment variable:", process.env.ML_SERVICE_URL);
      console.log("Full ML Service endpoint:", mlServiceUrl);
      console.log("Request headers:", form.getHeaders());

      console.log("Sending request to ML service...");
      const startTime = Date.now();
      
      const response = await axios.post(
        mlServiceUrl,
        form,
        {
          headers: {
            ...form.getHeaders()
          },
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
          timeout: 60000
        }
      );
      
      const responseTime = Date.now() - startTime;
      console.log("ML Service response received:", { 
        statusCode: response.status, 
        responseTime: `${responseTime}ms`,
        prediction: response.data.prediction,
        confidence: response.data.confidence
      });
      console.log("Full ML response:", JSON.stringify(response.data, null, 2));

      const result = response.data;

      let imageBase64 = null;
      let imageType = null;

      if (req.file) {
        imageBase64 = fs.readFileSync(req.file.path, { encoding: "base64" });
        imageType = req.file.mimetype;
      }

      const predictionData = {
        userId: req.user.id,
        text: req.body.text || null,
        result: result.prediction || "Unknown",
        confidence: result.confidence || 0,
        explanation: result.explanation_summary || null,
        modelScores: result.model_scores || null,
        attention_heatmap: result.attention_heatmap || null,
        image: imageBase64 || null,
        imageType: imageType || null,
        newsTitle: result.news_title || null,
        newsPreview: result.news_preview || null,
        newsImage: result.news_image || null,
        url: result.url || null,
        analysisType: result.analysis_type || (req.file ? "image" : "text")
      };

      console.log("Saving prediction to database...");
      console.log("Prediction Data:", { 
        userId: predictionData.userId,
        result: predictionData.result,
        confidence: predictionData.confidence,
        hasImage: !!predictionData.image,
        hasText: !!predictionData.text
      });
      
      const savedPrediction = await Prediction.create(predictionData);
      console.log("Prediction saved successfully:", { id: savedPrediction._id });

      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      console.log("=== PREDICTION REQUEST COMPLETED SUCCESSFULLY ===");
      res.json(result);

    } catch (error) {
      console.error("=== PREDICTION ERROR OCCURRED ===");
      console.error("Error Type:", error.constructor.name);
      console.error("Error Message:", error.message);
      console.error("Error Stack:", error.stack);
      
      if (error.response) {
        console.error("ML Service Response Status:", error.response.status);
        console.error("ML Service Response Data:", error.response.data);
        console.error("ML Service Response Headers:", error.response.headers);
      } else if (error.request) {
        console.error("No response from ML Service");
        console.error("Request attempted to:", error.config?.url);
        console.error("Request was made but no response:", error.request);
      } else {
        console.error("Error setting up request:", error.message);
      }

      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      res.status(500).json({
        message: error.response?.data?.message || error.message || "Prediction failed",
        errorType: error.constructor.name,
        details: error.response?.data || null
      });
    }
  }
);

module.exports = router;