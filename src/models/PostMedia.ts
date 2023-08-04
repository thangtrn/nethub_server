import {
   Column,
   CreateDateColumn,
   Entity,
   JoinColumn,
   ManyToOne,
   PrimaryColumn,
   UpdateDateColumn,
} from 'typeorm';
import Post from './Post';
import {MediaType} from '../enum';

@Entity('post_media')
export default class PostMedia {
   @PrimaryColumn({type: 'varchar'})
   cloudinaryId: string;

   @Column({type: 'bigint'})
   postId: number;

   @Column({type: 'varchar', length: 20, default: MediaType.IMAGE})
   type: MediaType;

   @Column({type: 'varchar', nullable: true})
   mediaUrl: string;

   @ManyToOne(() => Post, (post) => post.postMedia, {onDelete: 'CASCADE'})
   @JoinColumn()
   post: Post;

   @CreateDateColumn()
   createdAt?: Date;

   @UpdateDateColumn()
   updatedAt?: Date;

   constructor(
      postId: number,
      cloudinaryId: string,
      mediaUrl: string,
      type: MediaType = MediaType.IMAGE
   ) {
      this.postId = postId;
      this.cloudinaryId = cloudinaryId;
      this.mediaUrl = mediaUrl;
      this.type = type;
   }
}
