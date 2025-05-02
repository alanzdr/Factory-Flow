import { Robot } from "factory-flow/core";

import UnsplashService from '@/services/unsplash'
import { IImageData, RobotState } from "@/types";

const IMAGE_PER_PAGE = 10;

class FetchImagesRobot extends Robot<any> {
  private unsplashService = new UnsplashService();

  public async initialize(max: number): Promise<void> {
    
  }

  public async execute(): Promise<void> {
    const count = await this.state.get("count");
    const imagesRecord = await this.state.get("images");
    const page = await this.state.get("nextPage");
    
    const imagesLoaded = await this.unsplashService.listPage(page, IMAGE_PER_PAGE);
    
    let addCount = 0;

    for (const image of imagesLoaded) {
      const key = image.id;
      if (imagesRecord[key]) {
        continue
      }

      const data: IImageData = {
        width: image.width,
        height: image.height,
        downloadedFile: null,
        url: image.urls.regular,
      };
      
      imagesRecord[key] = data
      addCount++;
    }

    this.state.set("images", imagesRecord);
    this.state.set("count", count + addCount);
    this.state.set("nextPage", page + 1);
  }
}

export default FetchImagesRobot;