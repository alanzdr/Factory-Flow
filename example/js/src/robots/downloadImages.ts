import fs from 'node:fs';
import https from 'node:https';
import path from 'node:path';
import { Robot } from "factory-flow/core";
import { getTempFolderPath } from "factory-flow/utils";
import { RobotState } from "@/types"

interface Config {
  save: boolean
}

class DownloadImagesRobot extends Robot<any> {
  async donwloadImage(url: string, dest: string): Promise<void> {
    const file = fs.createWriteStream(dest);
    return new Promise((resolve, reject) => {
      const request = https
        .get(url, (response) => {
          response.pipe(file);
          file.on('finish', () => {
            file.close();
            resolve();
          });
        })
        .on('error', (error) => {
          fs.unlink(dest, () => reject(error));
        });
      
      request.on('error', function (err) {
        console.error(err);
      });
    });
  }

  public async initialize(configs: Config) {
    if (configs.save) {
      this.log.info('Saving images...');
    }
  }

  async execute(): Promise<void> {
    
    const images = await this.state.get('images');
    // console.log(images)
    // const keys = Object.keys(images);

    // this.log.info('Downloading images...');

    // const progressBar = this.log.progress('Download', keys.length)

    // for (let i = 0; i < keys.length; i++) {
    //   const key = keys[i];
    //   const image = images[key];
    //   if (image.downloadedFile) {
    //     continue;
    //   }

    //   const tempPath = await getTempFolderPath('images-source');
    //   const filePath = path.join(tempPath, `${key}.jpg`);

    //   try {
    //     await this.donwloadImage(image.url, filePath);
    //     image.downloadedFile = filePath;
    //     this.state.set('images', images);
    //     await this.state.save()
    //   } catch (error) {
    //     this.log.error(`Error downloading image ${image.url}`);
    //   }

    //   progressBar.update(i)
    // }

    // progressBar.finish()
  }
}

export default DownloadImagesRobot;