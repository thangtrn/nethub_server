import dataSource from '~/config/data-source';
import {Comment} from '~/models';

export default dataSource.getRepository(Comment);
