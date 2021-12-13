import { ConnectionOptions } from 'typeorm';
import {Location} from "./locations/entities/location.entity";
import {Account} from "./accounts/entities/account.entity";
import {Activity} from "./activities/entities/activity.entity";

const config: ConnectionOptions={
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'blocknote',
    password: 'blocknote',
    database: 'blocknote',
    entities: [Account, Location, Activity],
    synchronize: true,
}
export default config