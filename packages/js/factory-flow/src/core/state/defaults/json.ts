import fs from "node:fs/promises";
import path from "node:path";

import FactoryState from "../state";
import { getTempFolderPath, verifyPath } from '@/utils'
 
class JSONState<State extends object> extends FactoryState<State> {
  constructor(initialState: State, private outputName: string, private outputPath?: string) {
    super(initialState);
    if (!this.outputName.endsWith(".json")) {
      this.outputName = `${this.outputName}.json`;
    }
  }

  public async getSavePath() {
    if (this.outputPath) {
      return this.outputPath;
    }

    this.outputPath = await getTempFolderPath();

    return this.outputPath;
  }

  public async getFilePath() {
    const savePath = await this.getSavePath();
    return path.join(savePath, this.outputName);
  }

  public async initialize() {
    const filePath = await this.getFilePath();
    const exist = await verifyPath(filePath);

    if (exist) {
      const file = await fs.readFile(filePath);
      const data = JSON.parse(file.toString());
      if (data) {
        this.data = data;
      }
    }
  }

  public async save() {
    const string = JSON.stringify(this.data);
    const filePath = await this.getFilePath();
    await fs.writeFile(filePath, string);
  }
}

export default JSONState;
