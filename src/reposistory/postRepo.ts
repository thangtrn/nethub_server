import dataSource from '~/config/data-source';
import {Post} from '~/models';

export default dataSource.getRepository(Post);
