import { environment } from '../../environments/environment';

export class MusicPlayer {
  private static fileDirectory = `https://${environment.supabaseProject}.supabase.co/storage/v1/object/public/pdla-extraits`;
  static playMusic(music: string) {
    if (music) {
      const audio: HTMLAudioElement = new Audio(`${this.fileDirectory}/${music}.mp3`);
      audio.play();
    }
  }
}
