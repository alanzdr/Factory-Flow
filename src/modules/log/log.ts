import { inspect } from "node:util";
import chalk from "chalk";
import { ProgressBar } from "./progress";

export type ILog = "deep" | "shallow" | "none";

class LogModule {
  type: ILog;

  isDeepDisabled: boolean;
  isShallowDisabled: boolean;
  isAllDisabled: boolean;

  constructor(private name: string) {
    this.type = String(process.env.EXECUTION_LOGGIN ?? "deep") as ILog;

    this.isDeepDisabled = this.type !== "deep";
    this.isShallowDisabled = this.type === "none";
    this.isAllDisabled = this.type === "none";
  }

  private logName() {
    return chalk.bold.magenta(`[${this.name}]`);
  }

  private log(...message: any[]) {
    if (this.isAllDisabled) return;
    console.log(this.logName(), ...message);
  }

  public error(...message: any[]) {
    this.log(chalk.red("ERROR:"), ...message);
  }

  public info(...message: any[]) {
    this.log(chalk.blue("INFO:"), ...message);
  }

  public infoList(name: string, ...list: string[]) {
    this.log(chalk.blue(`${name.toLocaleUpperCase()}`), list.join(", "));
  }

  public infoValue(message: string, value: any, padValue = 3) {
    if (this.isDeepDisabled) return;
    const valueText = String(value).padEnd(padValue, " ");
    this.log(chalk.cyan(valueText), "-", message);
  }

  public errorValue(message: string, value: any, padValue = 3) {
    if (this.isDeepDisabled) return;
    const valueText = String(value).padEnd(padValue, " ");
    this.log(chalk.red(valueText), "-", message);
  }

  public success(...message: any[]) {
    this.log(chalk.green("SUCCESS:"), ...message);
  }

  public successValue(message: string, value: any, padValue = 3) {
    if (this.isDeepDisabled) return;
    const valueText = String(value).padEnd(padValue, " ");
    this.log(chalk.green(valueText), "-", message);
  }

  public warning(...message: any[]) {
    if (this.isShallowDisabled) return;
    this.log(chalk.yellow("WARNING:"), ...message);
  }

  public countIndex(name: string, index: number, total: number) {
    if (this.isDeepDisabled) return;
    this.log(`${name}: [${Number(index) + 1}/${total}]`);
  }

  public progress(name: string, total: number) {
    const message = `${this.logName()} ${name}:`;
    return new ProgressBar(message, total, this.isAllDisabled);
  }

  public object(object: any) {
    if (this.isDeepDisabled) return;
    this.info("Loggin Object:");
    console.log(inspect(object, false, undefined, true));
  }

  public separator() {
    if (this.isShallowDisabled) return;
    console.log(
      "---------------------------------------------------------------------------"
    );
  }

  public processInfo(message: string) {
    this.log(chalk.underline.yellowBright(message));
  }
}

export default LogModule;
