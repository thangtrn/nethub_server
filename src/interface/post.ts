import {MediaType} from '~/enum';
import {Post} from '~/models';

export interface IPostMedia {
   cloudinaryId: string;
   mediaUrl: string;
   type: MediaType;
}

export interface IPost {
   userId: number;
   content: string;
   isGlobal: boolean;
   media?: IPostMedia[];
}

export interface IPage {
   page: number;
   limit: number;
   totalPage?: number;
}

export interface INewsFeed {
   posts: Post[];
   pagination: {
      page: number;
      limit: number;
      total: number;
   };
}
