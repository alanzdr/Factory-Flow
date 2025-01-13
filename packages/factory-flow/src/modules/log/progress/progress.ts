const BAR_WIDTH = 30;

class ProgressBar {
  public current = 0;

  constructor(
    private message: string,
    public limit: number,
    private disabled: boolean
  ) {}

  private draw(progress: number) {
    const filledWidth = Math.floor((progress / 100) * BAR_WIDTH);
    const emptyWidth = BAR_WIDTH - filledWidth;
    const progressBar = "█".repeat(filledWidth) + "▒".repeat(emptyWidth);
    return `${this.message.trim()} [${progressBar}] ${progress}%`;
  }

  public update(index: number) {
    if (this.disabled) return;

    const progress = Math.round((index / this.limit) * 100);

    process.stdout.clearLine(0);
    process.stdout.cursorTo(0);
    process.stdout.write(this.draw(progress));
  }
}

export default ProgressBar;
