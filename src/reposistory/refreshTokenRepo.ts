import dataSource from '~/config/data-source';
import {RefreshToken} from '~/models';

export default dataSource.getRepository(RefreshToken);
