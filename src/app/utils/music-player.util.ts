export class MusicPlayer {
  private static fileDirectory = '/assets/extraits';
  static playMusic(music: string) {
    if (music) {
      const audio: HTMLAudioElement = new Audio(`${this.fileDirectory}/${music}.mp3`);
      audio.play();
    }
  }
}
