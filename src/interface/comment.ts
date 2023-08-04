import {MediaType} from '~/enum';
import {IPage} from './post';
import {Comment} from '~/models';

export interface IComment {
   userId: number;
   postId: number;
   content: string;
   type: MediaType;
   cloudinaryId?: string;
   mediaUrl?: string;
   parentId?: number;
}

export interface IReply {
   userId: number;
   postId: number;
   parentId: number;
   content: string;
   type: MediaType;
   cloudinaryId?: string;
   mediaUrl?: string;
}

export interface IGetComment {
   comments: Comment[];
   pagination: {
      page: number;
      limit: number;
      total: number;
   };
}
