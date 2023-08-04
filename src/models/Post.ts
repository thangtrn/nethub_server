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
import PostMedia from './PostMedia';
import Comment from './Comment';
import Like from './Like';

@Entity('post')
export default class Post {
   @PrimaryGeneratedColumn('increment', {type: 'bigint'})
   id: number;

   @Column({default: true})
   isGlobal: boolean;

   @Column({type: 'nvarchar', length: 'max'})
   content: string;

   @Column({type: 'bigint'})
   userId: number;

   @ManyToOne(() => User, (user) => user.posts)
   @JoinColumn()
   user: User;

   @OneToMany(() => PostMedia, (postMedia) => postMedia.post)
   postMedia: PostMedia[];

   @OneToMany(() => Comment, (comment) => comment.post)
   comments: Comment[];

   @OneToMany(() => Like, (like) => like.post)
   likes!: Like[];

   @CreateDateColumn()
   createdAt?: Date;

   @UpdateDateColumn()
   updatedAt?: Date;

   constructor(userId: number, content: string, isGlobal: boolean = true) {
      this.userId = userId;
      this.content = content;
      this.isGlobal = isGlobal;
   }
}
