const { PutObjectCommand } = require('@aws-sdk/client-s3');
const { s3 } = require('../lib/s3');

const upload = async (req, res) => {
  try {
    const file = req.file;
    const fileName = file.originalname + Date.now();
    const bucketName = process.env.IMAGE_BUCKET_NAME;
    const params = {
      Body: file.buffer,
      Bucket: bucketName,
      Key: fileName,
      ContentType: file.mimetype,
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);
    res.status(200).json({
      message: 'Image uploaded successfully',
      imageUrl: `${process.env.S3_URI}/${fileName}`,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).send('Error');
  }
};

module.exports = upload;
