import { Factory, Pipeline } from "factory-flow/core";

import FetchImagesRobot from "@/robots/fetchImages";
import DownloadImagesRobot from "@/robots/downloadImages";
import state from "@/state";

export function createPipeline(): Pipeline {
  const pipeline = Pipeline
    .createFlow()
      .pipe(FetchImagesRobot, 3)
      .pipe(DownloadImagesRobot, {
        save: false
      })
    .end()
    

  return pipeline
}


