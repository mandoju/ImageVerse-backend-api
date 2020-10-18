import { S3 } from 'aws-sdk';
import multer from 'multer';
import multerS3 from 'multer-s3';
import * as uuid from 'uuid';
import { getAwsEnviromentVariables } from '../utils/enviroment';

const s3 = new S3();

const fileFilter = (
  _: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type, only JPEG and PNG is allowed!'));
  }
};

const upload = multer({
  fileFilter,
  storage: multerS3({
    acl: 'public-read',
    s3,
    bucket: getAwsEnviromentVariables().awsImagesBucket,
    key: function (req, file, cb) {
      const filename = `${uuid.v1()}-${file.originalname}`;
      cb(null, filename);
    }
  })
});

export { upload };
