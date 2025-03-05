import * as dotenv from "dotenv";

import { createPipeline } from './pipelines'

dotenv.config();

const pipeline = createPipeline()
const cli = pipeline.createCLI()

cli.run(process.argv)
