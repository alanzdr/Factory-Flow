import { createApi } from 'unsplash-js';

class UnsplashService {
  private unsplash = createApi({
    accessKey: String(process.env.UNSPLASH_ACCESS_KEY)
  })
  
  constructor() {
    if (!process.env.UNSPLASH_ACCESS_KEY) {
      throw new Error('Unsplash access key is missing')
    }
  }

  async listPage(page = 1, perPage = 10) {
    const { response } = await this.unsplash.photos.list({
      page,
      perPage,
    })


    if (!response) {
      throw new Error('Failed to fetch images from Unsplash')
    }

    return response.results
  }


}

export default UnsplashService;