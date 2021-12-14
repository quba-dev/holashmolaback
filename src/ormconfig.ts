import { ConnectionOptions } from 'typeorm';
import {Location} from "./locations/entities/location.entity";
import {Account} from "./accounts/entities/account.entity";
import {Activity} from "./activities/entities/activity.entity";

const config: ConnectionOptions={
    type: 'postgres',
    host: 'postgres',
    port: 5432,
    username: 'blocknote',
    password: 'blocknote',
    database: 'blocknote',
    entities: [Account, Location, Activity],
    synchronize: true,
}// Env variables npm i @nestjs/config
// Then inject into app.module.ts. From imports: [ConfigModule.forRoot({pathFile: '.env'})]
export default config