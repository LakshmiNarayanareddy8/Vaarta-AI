const mongoose = require("mongoose");

const PredictionSchema = new mongoose.Schema(
{
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  text: {
    type: String,
    default: null
  },

  result: {
    type: String,
    required: true
  },

  confidence: {
    type: Number,
    required: true
  },

  explanation: {
    type: String,
    default: null
  },

  modelScores: {
    type: mongoose.Schema.Types.Mixed,
    default: null
  },

  attention_heatmap: {
    type: String,
    default: null
  },

  image: {
    type: String,
    default: null
  },

  imageType: {
    type: String,
    default: null
  },

  newsTitle: {
    type: String,
    default: null
  },

  newsPreview: {
    type: String,
    default: null
  },

  newsImage: {
    type: String,
    default: null
  },

  url: {
    type: String,
    default: null
  },

  analysisType: {
    type: String,
    default: null
  }

},
{ timestamps: true }
);

module.exports = mongoose.model("Prediction", PredictionSchema);