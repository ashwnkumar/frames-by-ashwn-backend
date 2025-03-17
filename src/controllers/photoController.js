const { cloudinary } = require("../config/cloudinary");
const Photo = require("../models/photoModel");
const { sendResponse } = require("../utils/sendResponse");

const uploadPhoto = async (req, res) => {
  try {
    const { title, description, album } = req.body;

    if (!req.file) {
      return sendResponse(res, 400, "Photo is required");
    }

    if (req.file.size > 10 * 1024 * 1024) {
      return sendResponse(res, 400, "Image size must be lower than 10MB");
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "frames-by-ashwn",
      use_filename: true,
      transformation: [{ quality: "auto", fetch_format: "auto" }],
      eager: [
        { width: 500, quality: "auto", fetch_format: "auto" }, // Preview Image
      ],
    });

    const image = {
      fullSizeUrl: result.secure_url, // Original Image
      previewUrl: result.eager[0].secure_url, // Optimized Preview Image
    };

    // Save `image.fullSizeUrl` and `image.previewUrl` in your database

    const uploadedPhoto = new Photo({
      title,
      description,
      imageUrl: result.secure_url, // Original Image
      previewUrl: result.eager[0].secure_url, // Optimized Preview Image
      album,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      aspectRatio: result.width / result.height,
    });

    await uploadedPhoto.save();
    sendResponse(res, 201, "Photo uploaded", { uploadedPhoto });
  } catch (error) {
    sendResponse(res, 500, "Error uploading photo", { error: error.message });
    console.error("Error uploading photo", error);
  }
};

const getPhotos = async (req, res) => {
  try {
    let { page, limit } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 7;

    const skip = (page - 1) * limit;

    const photos = await Photo.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalPhotos = await Photo.countDocuments();
    const hasMore = skip + photos.length < totalPhotos;

    sendResponse(res, 200, "Photos fetched", { photos, hasMore, totalPhotos });
  } catch (error) {
    sendResponse(res, 500, "Error fetching photos", { error: error.message });
    console.error("Error fetching photos", error);
  }
};

const getPhotoById = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      return sendResponse(res, 404, "Photo not found");
    }
    console.log("photo from get by id response", photo);
    sendResponse(res, 200, "Photo fetched", { photo });
  } catch (error) {
    sendResponse(res, 500, "Error fetching photo", { error: error.message });
    console.error("Error fetching photo", error);
  }
};

const deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      return sendResponse(res, 404, "Photo not found");
    }

    await cloudinary.uploader.destroy(photo.publicId);

    await photo.deleteOne();
    sendResponse(res, 200, "Photo deleted");
  } catch (error) {
    sendResponse(res, 500, "Error deleting photo", { error: error.message });
    console.error("Error deleting photo", error);
  }
};

const updatePhoto = async (req, res) => {
  try {
    console.log("req from update", req.body);
    console.log("req from update", req.file);
    const { title, description, category } = req.body;
    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      return sendResponse(res, 404, "Photo not found");
    }

    if (req.file) {
      await cloudinary.uploader.destroy(photo.publicId);
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "frames-by-ashwn",
        use_filename: true,
        transformation: [{ quality: "auto", fetch_format: "auto" }],
        eager: [
          { width: 500, quality: "auto", fetch_format: "auto" }, // Preview Image
        ],
      });

      console.log("result from update", result);

      photo.imageUrl = result.secure_url;
      photo.publicId = result.public_id;
      photo.width = result.width;
      photo.height = result.height;
      photo.aspectRatio = result.width / result.height;
      photo.previewUrl = result.eager[0].secure_url;
    }

    photo.title = title || photo.title;
    photo.description = description || photo.description;
    photo.category = category || photo.category;

    console.log("photo after save", photo);

    await photo.save();
    sendResponse(res, 200, "Photo updated", { photo });
  } catch (error) {
    sendResponse(res, 500, "Error updating photo", { error: error.message });
    console.error("Error updating photo", error);
  }
};

module.exports = {
  uploadPhoto,
  getPhotos,
  getPhotoById,
  deletePhoto,
  updatePhoto,
};
