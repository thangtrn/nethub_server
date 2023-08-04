import dataSource from '~/config/data-source';

import bcrypt from 'bcrypt';
import {Role, User} from '~/models';
import {Gender, RoleName} from '~/enum';

const seeding = async () => {
   try {
      // repository
      const roleRepo = dataSource.getRepository(Role);
      const userRepo = dataSource.getRepository(User);

      // role
      const roleAdmin = new Role(RoleName.ADMIN, 'This is Admin');
      const roleUser = new Role(RoleName.USER, 'This is User');
      await roleRepo.save([roleAdmin, roleUser]);

      // User
      const hashPwd = await bcrypt.hash('admin', Number(process.env.SALT));
      const admin = new User(
         'thangtrn01@gmail.com',
         hashPwd,
         'Thắng Trần',
         new Date('2002-01-05'),
         Gender.MALE,
         roleAdmin.id
      );
      await userRepo.save(admin);

      console.log('⚡️[database]: Seeding Successful.');
   } catch (error) {
      console.log('⚡️[database]: Seeding is Error.', error);
   }
};

dataSource
   .initialize()
   .then(() => {
      seeding();
   })
   .catch(() => {});
