import dataSource from '~/config/data-source';
import {Follower} from '~/models';

export default dataSource.getRepository(Follower);
