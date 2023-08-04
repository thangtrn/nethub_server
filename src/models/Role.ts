import {
   Entity,
   PrimaryGeneratedColumn,
   Column,
   OneToMany,
   CreateDateColumn,
   UpdateDateColumn,
} from 'typeorm';
import User from './User';
import {RoleName} from '../enum';

@Entity('role')
export default class Role {
   @PrimaryGeneratedColumn('increment', {type: 'int'})
   id: number;

   @Column({type: 'varchar', unique: true})
   role: RoleName;

   @Column({nullable: true})
   desc?: string;

   @OneToMany(() => User, (user) => user.role)
   users?: User[];

   @CreateDateColumn()
   createdAt?: Date;

   @UpdateDateColumn()
   updatedAt?: Date;

   constructor(role: RoleName, desc?: string) {
      this.role = role;
      this.desc = desc;
   }
}
