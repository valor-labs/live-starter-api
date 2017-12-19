import * as path from 'path';
import * as nconf from 'nconf';

export class AppConfig {
  public constructor(app: any){
    nconf.argv().env().file(path.join(__dirname, '/env/livestarter.config.json'));

    if (!nconf.get('REDIS_PORT')) {
      nconf.set('REDIS_PORT', '6379');
    }

    if (!nconf.get('REDIS_HOST')) {
      nconf.set('REDIS_HOST', 'localhost');
    }

    if (!nconf.get('MONGO_DB')) {
      // nconf.set('MONGO_DB', 'mongodb://localhost/livestarter');
      nconf.set('MONGO_DB', 'mongodb://maxie:livestarter2017@ds161026.mlab.com:61026/livestarter2');
      // nconf.set('MONGO_DB', 'mongodb://maxie:livestarter2017@ds061355.mlab.com:61355/livestarter');
    }

    app.set('nconf', nconf);
  }
}
