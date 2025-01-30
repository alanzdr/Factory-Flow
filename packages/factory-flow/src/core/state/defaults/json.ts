import fs from "node:fs/promises";
import FactoryState from "../state";

class JSONState<State extends object> extends FactoryState<State> {
  constructor(initialState: State, private outputPath: string) {
    super(initialState);
  }

  public async initialize() {
    await fs.access(this.outputPath);
    const file = await fs.readFile(this.outputPath);
    const data = JSON.parse(file.toString());
    if (data) {
      this.data = data;
    }
  }

  public async save() {
    const string = JSON.stringify(this.data);
    await fs.writeFile(this.outputPath, string);
  }
}

export default JSONState;
