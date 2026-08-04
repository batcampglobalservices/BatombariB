import mongoose from 'mongoose';
import dbConnect from '../../../utils/dbConnect';
import Project from '../../../models/Project';

export default async function handler(req, res) {
  if (req.method !== 'PUT') {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
  }

  try {
    await dbConnect();

    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid or empty items array provided.' });
    }

    const bulkOps = items.map((item, index) => {
      const targetId = typeof item === 'object' && item !== null ? (item._id || item.id) : item;
      const targetOrder = typeof item === 'object' && item !== null && item.order !== undefined ? Number(item.order) : index;

      let filter = {};
      if (mongoose.Types.ObjectId.isValid(targetId)) {
        filter = { _id: targetId };
      } else if (!isNaN(Number(targetId))) {
        filter = { id: Number(targetId) };
      } else {
        filter = { _id: targetId };
      }

      return {
        updateOne: {
          filter,
          update: { $set: { order: targetOrder } },
        },
      };
    });

    if (bulkOps.length > 0) {
      await Project.bulkWrite(bulkOps);
    }

    // Return all projects updated and sorted
    const updatedProjects = await Project.find({}).sort({ order: 1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: 'Projects reordered successfully.',
      data: updatedProjects,
    });
  } catch (error) {
    console.error('Portfolio reorder API error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to reorder projects',
      error: error.message,
    });
  }
}
