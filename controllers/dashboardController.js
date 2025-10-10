const Signup = require('../models/signup');
const Template = require('../models/Template');
const Category = require('../models/Category');
const Video = require('../models/Videos');
 
exports.getDashboardData = async (req, res) => {
  try {
    // --- USER STATS ---
   // Total users
const totalUsers = await Signup.countDocuments();
 
// Subscribed users
const subscribedUsers = await Signup.countDocuments({ is_subscribed: 1 });
 
// Trial users = everyone else
const trialUsers = totalUsers - subscribedUsers;
 
 
    // --- CATEGORY-WISE VIDEO COUNT ---
    const videoCounts = await Video.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryInfo'
        }
      },
      { $unwind: '$categoryInfo' },
      {
        $group: {
          _id: '$categoryInfo.name',
          totalVideos: { $sum: 1 }
        }
      }
    ]);
 
    // --- CATEGORY-WISE IMAGE COUNT ---
    const imageCounts = await Template.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryInfo'
        }
      },
      { $unwind: '$categoryInfo' },
      {
        $group: {
          _id: '$categoryInfo.name',
          totalImages: { $sum: 1 }
        }
      }
    ]);
 
    res.status(200).json({
      totalUsers,
      trialUsers,
      subscribedUsers,
      videoCounts,
      imageCounts
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error', error });
  }
};
 