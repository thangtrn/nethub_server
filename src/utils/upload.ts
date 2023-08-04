import {MediaType} from '~/enum';
import {IPostMedia} from '~/interface';
import cloudinary from '~/middleware/cloudinary';
import {ErrorException} from '~/response';

export const uploadSingle = async (filePath: string, type: MediaType): Promise<IPostMedia> => {
   try {
      const result = await cloudinary.uploader.upload(filePath, {
         folder: 'social_network',
         resource_type: type === MediaType.IMAGE ? 'image' : 'video',
      });
      return {
         cloudinaryId: result.public_id,
         mediaUrl: result.secure_url,
         type: type,
      };
   } catch (error) {
      throw new ErrorException(500, 'Cloudinary server error' + error);
   }
};

export const uploadMultiple = async (files: Express.Multer.File[]): Promise<IPostMedia[]> => {
   try {
      let result: IPostMedia[] = [];
      for (const file of files) {
         const rs: IPostMedia = await uploadSingle(
            file.path,
            file.mimetype === 'video/mp4' ? MediaType.VIDEO : MediaType.IMAGE
         );
         result.push(rs);
      }
      return result;
   } catch (error) {
      throw new ErrorException(500, 'Cloudinary server error Multiple');
   }
};
