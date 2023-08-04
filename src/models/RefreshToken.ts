import {Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import User from './User';

@Entity('refresh_token')
export default class RefreshToken {
   @PrimaryGeneratedColumn('increment')
   id: number;

   @Column()
   token: string;

   @Column({type: 'bigint'})
   userId: number;

   @ManyToOne(() => User, (user) => user.refreshTokens, {onDelete: 'CASCADE'})
   @JoinColumn()
   user: User;

   constructor(token: string, userId: number) {
      (this.token = token), (this.userId = userId);
   }
}
