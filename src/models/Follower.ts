import {Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn} from 'typeorm';
import User from './User';

@Entity('follower')
export default class Follower {
   @PrimaryColumn({type: 'bigint'})
   userId: number;

   @PrimaryColumn({type: 'bigint'})
   followerId: number;

   @ManyToOne(() => User, (user) => user.followers)
   @JoinColumn({name: 'userId'})
   user: User;

   @ManyToOne(() => User, (user) => user.followers)
   @JoinColumn({name: 'followerId'})
   follower: User;

   constructor(userId: number, followerId: number) {
      this.userId = userId;
      this.followerId = followerId;
   }
}
