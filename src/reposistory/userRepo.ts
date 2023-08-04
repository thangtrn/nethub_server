import dataSource from '~/config/data-source';
import {User} from '~/models';

export default dataSource.getRepository(User);
