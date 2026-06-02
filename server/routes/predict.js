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
      const form = new FormData();

      if (req.file) {
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
      }

      const response = await axios.post(
        `${process.env.ML_SERVICE_URL}/predict`,
        form,
        {
          headers: {
            ...form.getHeaders()
          },
          maxContentLength: Infinity,
          maxBodyLength: Infinity
        }
      );

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

      await Prediction.create(predictionData);

      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      res.json(result);

    } catch (error) {
      console.error("FULL ERROR:", error.response?.data || error.message);

      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      res.status(500).json({
        message: error.response?.data || error.message || "Prediction failed"
      });
    }
  }
);

module.exports = router;