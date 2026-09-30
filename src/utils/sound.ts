// Sound Effects utility - Completely muted / disabled
class SoundEngine {
  private soundEnabled: boolean = false;

  public setEnabled(_enabled: boolean) {
    this.soundEnabled = false;
  }

  public isEnabled(): boolean {
    return false;
  }

  // All sound effects completely muted & no-op
  public playClick() {}
  public playDrop() {}
  public playWindowOpen() {}
  public playTrash() {}
  public playChime() {}
  public playBoop() {}
}

export const sound = new SoundEngine();
