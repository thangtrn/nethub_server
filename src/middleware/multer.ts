import multer from 'multer';
import path from 'path';
import {UnprocessableException} from '~/response';
const storage = multer.diskStorage({});

const upload = multer({
   storage,
   fileFilter: (req, file, cb) => {
      let ext = path.extname(file.originalname);
      if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png' && ext !== '.mp4') {
         return cb(new UnprocessableException('File type is not supported.'));
      }
      return cb(null, true);
   },
});

export default upload;
