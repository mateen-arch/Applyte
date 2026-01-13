const { User } = require("../../models/user");
const { cloudinary } = require("../../utils/FileUploadUtils/Cloudinary");
const { getFileUrl } = require("../../utils/FileUploadUtils/dataURI");

const getUserStats = async (req, res) => {
  try {
    const userID = req._id;

    const user = await User.findById(userID);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found!",
      });
    }

    const resumeCount = user.resume.length;
    return res.status(200).json({
      success: true,
      ResumeCount: resumeCount,
    });
  } catch (err) {
    console.log("Error in fetching User stats: ", err);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user stats!",
    });
  }
};

const updateUserImage = async (req, res) => {
  try {
    // Validate file exists
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No image file provided!",
      });
    }

    const userID = req._id;
    const user = await User.findById(userID);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    // Convert file buffer to data URI
    const imageDataURI = getFileUrl(req.file);

    // Upload to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(imageDataURI, {
      folder: "user-profiles",
      transformation: [
        { width: 400, height: 400, crop: "fill", gravity: "face" },
        { quality: "auto" },
      ],
    });

    // Delete old image from Cloudinary if it exists
    if (user.image) {
      try {
        // Extract public_id from old image URL
        const oldImagePublicId = user.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`user-profiles/${oldImagePublicId}`);
      } catch (deleteErr) {
        // Log but don't fail if old image deletion fails
        console.log("Warning: Could not delete old image:", deleteErr.message);
      }
    }

    // Save Cloudinary URL instead of data URI
    user.image = cloudinaryResponse.secure_url;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User image updated successfully!",
      imageUrl: cloudinaryResponse.secure_url,
    });
  } catch (err) {
    console.error("Error in Updating User Image:", err);
    
    // Provide more specific error messages
    let errorMessage = "Failed to update user image!";
    if (err.message && err.message.includes("image")) {
      errorMessage = err.message;
    } else if (err.http_code) {
      errorMessage = `Cloudinary error: ${err.message}`;
    }

    return res.status(500).json({
      success: false,
      message: errorMessage,
    });
  }
};

const deleteUserImage = async (req, res) => {
  try {
    const userID = req._id;
    const user = await User.findById(userID);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found!",
      });
    }

    if (!user.image) {
      return res.status(400).json({
        success: false,
        message: "User image not found!",
      });
    }

    // Extract public_id from Cloudinary URL
    try {
      const imageUrl = user.image;
      // Extract public_id from URL (format: https://res.cloudinary.com/.../user-profiles/public_id)
      const urlParts = imageUrl.split("/");
      const publicIdIndex = urlParts.findIndex((part) => part === "user-profiles");
      
      if (publicIdIndex !== -1 && urlParts[publicIdIndex + 1]) {
        const publicId = `user-profiles/${urlParts[publicIdIndex + 1].split(".")[0]}`;
        await cloudinary.uploader.destroy(publicId);
      }
    } catch (deleteErr) {
      console.log("Warning: Could not delete image from Cloudinary:", deleteErr.message);
      // Continue to delete from database even if Cloudinary deletion fails
    }

    user.image = "";
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User image deleted successfully!",
    });
  } catch (err) {
    console.error("Error in Deleting User Image:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to delete user image!",
    });
  }
};

const getUserInfo = async (req, res) => {
  try {
    const userID = req._id;
    const user = await User.findById(userID);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found!",
      });
    }
    return res.status(200).json({
      success: true,
      message: "User info fetched successfully!",
      User: {
        username: user.username,
        email: user.email,
        image: user.image,
      },
    });
  } catch (err) {
    console.log("Error in Getting User Info: ", err);
    return res.status(500).json({
      success: false,
      message: "Failed to get user info!",
    });
  }
};

const updateUserInfo = async (req, res) => {
  try {
    const userID = req._id;
    const user = await User.findById(userID);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found!",
      });
    }

    const { username, email } = req.body;

    if (email) {
      isEmailPresent = await User.findOne({ email: email });

      if (isEmailPresent) {
        return res.status(400).json({
          success: false,
          message: "Email already exists!",
        });
      }
    }

    if (username) user.username = username;
    if (email) user.email = email;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User info updated successfully!",
      User: {
        username: user.username,
        email: user.email,
        image: user.image,
      },
    });
  } catch (err) {
    console.log("Error in Updating User Info: ", err);
    return res.status(500).json({
      success: false,
      message: "Failed to update user info!",
    });
  }
};

const getUser = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        success: false,
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(400).json({
        success: false,
      });
    }

    return res.status(200).json({
      success: true,
      User: {
        username: user.username,
        email: user.email,
        image: user.image,
        isVerified: user.isVerified,
      },
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      success: false,
      message: "Internal Error!",
    });
  }
};

module.exports = {
  updateUserImage,
  deleteUserImage,
  getUserInfo,
  getUser,
  getUserStats,
  updateUserInfo,
};
