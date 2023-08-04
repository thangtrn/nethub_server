import {Follower} from '~/models';
import {followerRepo, userRepo} from '~/reposistory';
import {ConflictException, NotFoundException} from '~/response';

export default class userService {
   public static addFollow = async (userId: number, followerId: number): Promise<void> => {
      if (!(await this.isExistUser(userId))) throw new NotFoundException('userId  was not found.');

      if (!(await this.isExistUser(followerId)))
         throw new NotFoundException('followerId was not found.');

      if (await followerRepo.findOneBy({userId: userId, followerId: followerId})) {
         throw new ConflictException(`User with id = ${userId} has been followed`);
      }

      await followerRepo.save(new Follower(userId, followerId));
   };

   public static unfollow = async (userId: number, followerId: number): Promise<void> => {
      if (!(await this.isExistUser(userId))) throw new NotFoundException('userId  was not found.');

      if (!(await this.isExistUser(followerId)))
         throw new NotFoundException('followerId was not found.');

      if (!(await followerRepo.findOneBy({userId: userId, followerId: followerId}))) {
         throw new ConflictException(`User with id = ${userId} hasn't been followed`);
      }

      await followerRepo.delete({userId: userId, followerId: followerId});
   };

   public static isExistUser = async (userId: number) => {
      return (await userRepo.findOneBy({id: userId})) ? true : false;
   };
}
