import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary from Environment Variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'demo',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || '',
  secure: true,
});

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ success: false, message: `Method ${req.method} Not Allowed` });
  }

  try {
    const { image, folder = 'portfolio_uploads' } = req.body;

    if (!image) {
      return res.status(400).json({ success: false, message: 'Please provide an image payload' });
    }

    const apiKey = process.env.CLOUDINARY_API_KEY;
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;

    // Check if Cloudinary credentials are fully configured
    if (!apiKey || apiKey === '' || cloudName === 'demo') {
      // Fallback response if user hasn't put API key yet
      return res.status(200).json({
        success: true,
        message: 'Cloudinary API credentials missing in .env.local. Preserved image payload.',
        url: image, // Returns input image data URL or relative URL
        isFallback: true,
      });
    }

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(image, {
      folder: folder,
      resource_type: 'auto',
    });

    return res.status(200).json({
      success: true,
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      format: uploadResult.format,
      bytes: uploadResult.bytes,
    });
  } catch (error) {
    console.error('Cloudinary Upload API Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to upload image to Cloudinary',
      error: error.message,
    });
  }
}
