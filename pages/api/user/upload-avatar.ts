import { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File } from 'formidable'; // Import the File type
import { v2 as cloudinary } from 'cloudinary';

// Disable Next.js body parser for this route to handle multipart/form-data
export const config = {
  api: {
    bodyParser: false,
  },
};

// Configure Cloudinary with your environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const form = formidable({});

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing form data:', err);
        return res.status(500).json({ message: 'Error parsing form data' });
      }

      // --- FIX STARTS HERE ---
      const fileArray = files.avatar;

      // 1. Check if the 'avatar' key exists and if it's a non-empty array.
      if (!fileArray || fileArray.length === 0) {
        console.warn('Validation failed: No file was uploaded under the "avatar" key.');
        return res.status(400).json({ message: 'No file uploaded.' });
      }

      // 2. Get the first (and only) file from the array.
      const uploadedFile: File = fileArray[0];

      console.log(`File found. Uploading to Cloudinary from path: ${uploadedFile.filepath}`);

      // 3. Upload using the correct filepath.
      const result = await cloudinary.uploader.upload(uploadedFile.filepath, {
        folder: 'teacher_avatars',
      });
      // --- FIX ENDS HERE ---

      console.log('Cloudinary upload successful. URL:', result.secure_url);
      return res.status(200).json({ avatarUrl: result.secure_url });
    });
  } catch (error) {
    console.error('An unexpected error occurred in the avatar upload handler:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}