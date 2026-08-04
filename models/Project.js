import mongoose from 'mongoose';

const TechnologySchema = new mongoose.Schema({
  tech: {
    type: String,
    required: true,
    trim: true,
  },
}, { _id: false });

const ProjectSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      required: false,
    },
    projectName: {
      type: String,
      required: [true, 'Please provide a project name.'],
      trim: true,
      maxlength: [120, 'Project name cannot be more than 120 characters'],
    },
    url: {
      type: String,
      trim: true,
      default: '#',
    },
    image: {
      type: String,
      required: [true, 'Please provide an image URL or path.'],
      trim: true,
    },
    projectDetail: {
      type: String,
      required: [true, 'Please provide project details.'],
      trim: true,
    },
    technologiesUsed: {
      type: [TechnologySchema],
      default: [],
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);
