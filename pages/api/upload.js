import { v2 as cloudinary } from 'cloudinary';

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
    const { image, folder = 'portfolio_uploads' } = req.body || {};

    if (!image) {
      return res.status(400).json({ success: false, message: 'Please provide an image payload' });
    }

    const apiKey = process.env.CLOUDINARY_API_KEY;
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    // Check if Cloudinary credentials are missing or default
    if (!apiKey || apiKey === '' || !cloudName || cloudName === 'demo' || !apiSecret) {
      return res.status(200).json({
        success: true,
        message: 'Cloudinary API credentials missing or incomplete. Using fallback payload.',
        url: image,
        isFallback: true,
      });
    }

    // Configure Cloudinary per request dynamically
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    });

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
    console.warn('Cloudinary upload error, using payload fallback:', error?.message || error);
    
    // Return image payload gracefully to avoid 500 error on client
    const fallbackImage = req.body?.image;
    if (fallbackImage) {
      return res.status(200).json({
        success: true,
        message: 'Cloudinary upload fallback activated.',
        url: fallbackImage,
        isFallback: true,
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to upload image',
      error: error?.message || 'Unknown upload error',
    });
  }
}
