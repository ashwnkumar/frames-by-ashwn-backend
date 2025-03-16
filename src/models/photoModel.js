const { default: mongoose } = require("mongoose");

const photoSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    imageUrl: { type: String, required: true },
    description: { type: String },
    category: { type: String },
    publicId: { type: String },
    width: { type: Number },
    height: { type: Number },
    aspectRatio: { type: Number },
    imageUrl: { type: String },
    previewUrl: { type: String },
  },
  { timestamps: true }
);

const Photo = mongoose.model("Photo", photoSchema);

module.exports = Photo;
