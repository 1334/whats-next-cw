import { environment } from '../environments/environment';

const imagesUrl = environment.imagesBaseUrl;
const bdSize = environment.backdropSizes[0];

export default class TVShow {
  showId: number;
  name: string;
  backdrop_path: string;
  poster_path: string;
  similar: { results: TVShow[] };

  static from(show: object) {
    return Object.assign(new TVShow(), show);
  }

  get image() {
    return `${imagesUrl}/${bdSize}/${this.backdrop_path}`;
  }
}
