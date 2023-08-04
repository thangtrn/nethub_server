import {
   Entity,
   PrimaryGeneratedColumn,
   Column,
   ManyToOne,
   JoinColumn,
   CreateDateColumn,
   UpdateDateColumn,
   OneToMany,
   OneToOne,
} from 'typeorm';
import Role from './Role';
import Like from './Like';
import Post from './Post';
import Comment from './Comment';
import RefreshToken from './RefreshToken';
import {Gender} from '../enum';
import Follower from './Follower';

const default_avatar: string =
   'https://res.cloudinary.com/thangtrn01/image/upload/v1687944965/social_network/default_avatar_ctknzr.png';

@Entity('user')
export default class User {
   @PrimaryGeneratedColumn('increment', {type: 'bigint'})
   id: number;

   @Column({length: 100})
   email: string;

   @Column({length: 100})
   password: string;

   @Column({type: 'nvarchar', length: 100})
   name: string;

   @Column()
   birthday: Date;

   @Column({type: 'nvarchar', length: 20})
   gender: Gender;

   @Column({default: default_avatar})
   avatar?: string;

   @Column({type: 'int'})
   roleId: number;

   @ManyToOne(() => Role, (role) => role.users)
   @JoinColumn()
   role: Role;

   @OneToMany(() => Post, (post) => post.user)
   posts: Post[];

   @OneToMany(() => Comment, (comment) => comment.user)
   comments: Comment[];

   @OneToMany(() => RefreshToken, (refreshToken) => refreshToken.user)
   refreshTokens: RefreshToken[];

   @OneToOne(() => Follower, (follower) => follower.user)
   followers: Follower[];

   @OneToMany(() => Like, (like) => like.user)
   likes: Like[];

   @CreateDateColumn()
   createdAt?: Date;

   @UpdateDateColumn()
   updatedAt?: Date;

   constructor(
      email: string,
      password: string,
      name: string,
      birthday: Date,
      gender: Gender,
      roleId: number,
      avatar?: string
   ) {
      this.email = email;
      this.password = password;
      this.name = name;
      this.birthday = birthday;
      this.gender = gender;
      this.roleId = roleId;
      this.avatar = avatar;
   }
}
