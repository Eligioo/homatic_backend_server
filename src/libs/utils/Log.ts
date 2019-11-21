import chalk from "chalk";

// eslint-disable-next-line no-console
const log = console.log;

const error = chalk.redBright;
const info = chalk.blueBright;
const warning = chalk.keyword("orange");

export default class Log {
  static info(message:any) {
    log(info(`[${new Date().toLocaleString()}] INFO:   ${message}`));
  }

  static error(message:any) {    
    log(error(`[${new Date().toLocaleString()}] ERROR:  ${message}`));
  }

  static warn(message:any) {    
    log(warning(`[${new Date().toLocaleString()}] WARN:   ${message}`));
  }
}