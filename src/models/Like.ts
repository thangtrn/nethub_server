import {Entity, JoinColumn, ManyToOne, PrimaryColumn} from 'typeorm';
import User from './User';
import Post from './Post';

@Entity('like')
export default class Like {
   @PrimaryColumn({type: 'bigint'})
   userId: number;

   @PrimaryColumn({type: 'bigint'})
   postId: number;

   @ManyToOne(() => User, (user) => user.likes, {onDelete: 'CASCADE'})
   @JoinColumn({name: 'userId'})
   user: User;

   @ManyToOne(() => Post, (post) => post.likes, {onDelete: 'CASCADE'})
   @JoinColumn({name: 'postId'})
   post: Post;

   constructor(userId: number, postId: number) {
      this.userId = userId;
      this.postId = postId;
   }
}
