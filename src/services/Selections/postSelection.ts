import authSelection from './authSelection';

const {role, ...userSelection} = authSelection;

export const createPostSelection = {
   id: true,
   isGlobal: true,
   content: true,
   userId: true,
   user: userSelection,
   postMedia: true,
   likes: true,
   createdAt: true,
   updatedAt: true,
};

export const postSelection = {
   id: true,
   isGlobal: true,
   content: true,
   userId: true,
   createdAt: true,
   updatedAt: true,
   user: userSelection,
   postMedia: true,
   likes: {
      userId: true,
      postId: true,
      user: userSelection,
   },
};

const replySelection = {
   id: true,
   userId: true,
   postId: true,
   content: true,
   parentId: true,
   user: userSelection,
   type: true,
   cloudinaryId: true,
   mediaUrl: true,
   createdAt: true,
   updatedAt: true,
};

export const commentSelection = {
   id: true,
   userId: true,
   postId: true,
   parentId: true,
   content: true,
   type: true,
   cloudinaryId: true,
   mediaUrl: true,
   user: userSelection,
   replies: replySelection,
   createdAt: true,
   updatedAt: true,
};
