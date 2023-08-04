import {
   Column,
   CreateDateColumn,
   Entity,
   JoinColumn,
   ManyToOne,
   OneToMany,
   PrimaryGeneratedColumn,
   UpdateDateColumn,
} from 'typeorm';
import User from './User';
import Post from './Post';
import {MediaType} from '../enum';

@Entity('comment')
export default class Comment {
   @PrimaryGeneratedColumn('increment', {type: 'bigint'})
   id: number;

   @Column({type: 'bigint', nullable: true})
   parentId?: number;

   @ManyToOne(() => Comment, (comment) => comment.replies)
   @JoinColumn({name: 'parentId'})
   parentComment: Comment;

   @OneToMany(() => Comment, (comment) => comment.parentComment)
   replies!: Comment[];

   @Column({type: 'bigint'})
   userId: number;

   @ManyToOne(() => User, (user) => user.comments, {onDelete: 'CASCADE'})
   @JoinColumn()
   user: User;

   @Column({type: 'bigint'})
   postId: number;

   @ManyToOne(() => Post, (post) => post.comments, {onDelete: 'CASCADE'})
   @JoinColumn()
   post: Post;

   @Column({type: 'nvarchar', length: 20, default: MediaType.NON})
   type: MediaType;

   @Column({type: 'nvarchar', length: 'max'})
   content: string;

   @Column({type: 'varchar', nullable: true})
   cloudinaryId?: string;

   @Column({nullable: true})
   mediaUrl?: string;

   @CreateDateColumn()
   createdAt?: Date;

   @UpdateDateColumn()
   updatedAt?: Date;

   constructor(
      userId: number,
      postId: number,
      content: string,
      parentId?: number | undefined,
      type: MediaType = MediaType.NON,
      cloudinaryId?: string | undefined,
      mediaUrl?: string | undefined
   ) {
      this.userId = userId;
      this.postId = postId;
      this.content = content;
      this.parentId = parentId;
      this.type = type;
      this.cloudinaryId = cloudinaryId;
      this.mediaUrl = mediaUrl;
   }
}
