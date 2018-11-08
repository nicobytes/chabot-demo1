import * as dotenv from 'dotenv';
import * as fs from 'fs';

export class ConfigService {

  private readonly envConfig: { [key: string]: string };

  constructor(
    private filePath: string,
  ) {
    this.envConfig = dotenv.parse(fs.readFileSync(filePath));
  }

  get(key) {
    return this.envConfig[key];
  }
}