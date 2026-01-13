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
    const image = req.file;
    const userID = req._id;

    const user = await User.findById(userID);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found!",
      });
    }

    const imageURL = getFileUrl(image);
    const cloudinaryResponse = await cloudinary.uploader.upload(imageURL);

    user.image = imageURL;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User image updated successfully!",
    });
  } catch (err) {
    console.log("Error in Updating User Image: ", err);
    return res.status(500).json({
      success: false,
      message: "Failed to update user image!",
    });
  }
};

const deleteUserImage = async (req, res) => {
  try {
    const userID = req._id;
    const user = await User.findById(userID);

    if (!user) {
      return res.status(400).json({
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

    const imageURL = user.image;
    const cloudinaryResponse = await cloudinary.uploader.destroy(imageURL);

    user.image = "";
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User image deleted successfully!",
    });
  } catch (err) {
    console.log("Error in Deleting User Image: ", err);
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
