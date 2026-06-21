import pc from 'picocolors';

export const logger = {
  info: (msg: string) => console.log(pc.blue('ℹ') + ' ' + msg),
  success: (msg: string) => console.log(pc.green('✔') + ' ' + msg),
  warn: (msg: string) => console.warn(pc.yellow('⚠') + ' ' + msg),
  error: (msg: string) => console.error(pc.red('✖') + ' ' + pc.red(msg)),
  debug: (msg: string) => {
    if (process.env.DEBUG) {
      console.log(pc.gray('⚙ ' + msg));
    }
  }
};
