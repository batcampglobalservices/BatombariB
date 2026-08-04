import mongoose from 'mongoose';
import dbConnect from '../../../utils/dbConnect';
import Project from '../../../models/Project';

export default async function handler(req, res) {
  const {
    query: { id },
    method,
  } = req;

  try {
    await dbConnect();

    let queryFilter = {};
    if (mongoose.Types.ObjectId.isValid(id)) {
      queryFilter = { _id: id };
    } else if (!isNaN(Number(id))) {
      queryFilter = { id: Number(id) };
    } else {
      return res.status(400).json({ success: false, message: 'Invalid project ID format' });
    }

    switch (method) {
      case 'GET': {
        const project = await Project.findOne(queryFilter);
        if (!project) {
          return res.status(404).json({ success: false, message: 'Project not found' });
        }
        return res.status(200).json({ success: true, data: project });
      }

      case 'PUT': {
        const { projectName, url, image, projectDetail, technologiesUsed, order } = req.body;

        let formattedTech = technologiesUsed;
        if (Array.isArray(technologiesUsed) && technologiesUsed.length > 0) {
          if (typeof technologiesUsed[0] === 'string') {
            formattedTech = technologiesUsed.map((t) => ({ tech: t }));
          }
        }

        const updatedData = {
          ...(projectName && { projectName }),
          ...(url !== undefined && { url }),
          ...(image && { image }),
          ...(projectDetail && { projectDetail }),
          ...(formattedTech !== undefined && { technologiesUsed: formattedTech }),
          ...(order !== undefined && { order: Number(order) }),
        };

        const updatedProject = await Project.findOneAndUpdate(
          queryFilter,
          updatedData,
          { new: true, runValidators: true }
        );

        if (!updatedProject) {
          return res.status(404).json({ success: false, message: 'Project not found' });
        }

        return res.status(200).json({ success: true, data: updatedProject });
      }

      case 'DELETE': {
        const deletedProject = await Project.findOneAndDelete(queryFilter);

        if (!deletedProject) {
          return res.status(404).json({ success: false, message: 'Project not found' });
        }

        return res.status(200).json({ success: true, data: {} });
      }

      default:
        res.setHeader('Allow', ['GET', 'PUT', 'DELETE']);
        return res.status(405).json({ success: false, message: `Method ${method} Not Allowed` });
    }
  } catch (error) {
    console.error('Project ID API Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Database error',
      error: error.message,
    });
  }
}
