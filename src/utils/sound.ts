// Sound Effects utility - Completely muted / disabled
class SoundEngine {
  private soundEnabled: boolean = false;

  public setEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
  }

  public isEnabled(): boolean {
    return this.soundEnabled;
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
