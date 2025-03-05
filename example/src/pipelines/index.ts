import { Factory, FactoryPipeline } from "factory-flow/core";

import FetchImagesRobot from "@/robots/fetchImages";
import DownloadImagesRobot from "@/robots/downloadImages";
import state from "@/state";

export function createPipeline(): FactoryPipeline {
  const pipeline = Factory.createFlow(state)
    .describe('fetch-images')
      .pipe(FetchImagesRobot)
    .describe('download-images')
      .pipe(DownloadImagesRobot)
    .toPipeline()

  return pipeline
}


