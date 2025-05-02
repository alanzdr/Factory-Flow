import * as dotenv from "dotenv";
dotenv.config();

import { createPipeline } from './pipelines'
import { state } from './state'
import { Factory, JSONState } from "factory-flow/core"
import { State } from "./types";

const pipeline = createPipeline()
const factory = new Factory(state)

factory.add("save-images", pipeline)

async function main() {
  await factory.execute(pipeline)
}

void main()
// const cli = pipeline.createCLI()

