import { Command } from 'commander'
import inquirer from "inquirer";

import FactoryPipeline from './pipeline';

class PipelineCLI {
  public program: Command;

  constructor (private pipeline: FactoryPipeline) {
    this.program = this.createProgram();
  }

  private createProgram() {
    const program = new Command();

    const flows = this.pipeline.getFlows()

    program
      .option('--p, --pipeline <char>', 'Set pipeline')
      .action(async (str) => {
        let pipeline = str.pipeline

        if (!pipeline || !flows.has(pipeline)) {
          const keys = flows.keys()

          const userResponse = await inquirer.prompt([{
            type: 'list',
            name: 'pipeline',
            message: 'Select a pipeline to execute',
            choices: Array.from(keys)
          }])

          pipeline = userResponse.pipeline
        }

        await this.pipeline.execute(pipeline)
      })

    // 
    return program
  }

  public version(version: string) {
    this.program.version(version);
  }
  
  public async parse(argv?: string[]) {
    return this.program.parse(argv || process.argv);
  }

  public async run(argv?: string[]) {
    await this.parse(argv)
  }
}

export default PipelineCLI;