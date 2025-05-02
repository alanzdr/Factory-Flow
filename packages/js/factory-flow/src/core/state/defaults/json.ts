import fs from "node:fs/promises";
import path from "node:path";

import { FactoryState } from "@/core/state";
import { getTempFolderPath, verifyPath } from '@/utils'

interface IJSONFileData {
  value: any;
  updatedAt: number;
}

class JSONState<State extends object = any> extends FactoryState<State> {
  
  constructor(initialState: State, private outputFolder: string, private basePath?: string) {
    super(initialState);
  }

  public async getBasePath() {
    if (this.basePath) {
      return this.basePath;
    }

    this.basePath = await getTempFolderPath(this.outputFolder);

    return this.basePath;
  }

  public async getFilePath(key: string) {
    const savePath = await this.getBasePath();
    const fileName = `${key}.json`;
    return path.join(savePath, fileName);
  }

  protected override async onLoad(key: string): Promise<any> {
    try {
      const filePath = await this.getFilePath(String(key));
      const exist = await verifyPath(filePath);

      if (!exist) {
        return undefined ;
      }

      const file = await fs.readFile(filePath);
      const data = JSON.parse(file.toString()) as IJSONFileData;
      if (data) {
        return data.value;
      }

      return undefined;
    } catch {
      return undefined;
    }
  }

  protected override async onSave(key: string, value: any): Promise<void> {
    const filePath = await this.getFilePath(String(key));
    const string = JSON.stringify({ value, updatedAt: Date.now() });
    await fs.writeFile(filePath, string);
  }

}

export default JSONState;
