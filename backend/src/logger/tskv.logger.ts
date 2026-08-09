import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class TskvLogger implements LoggerService {
  formatMessage(level: string, message: any, ...optionalParams: any[]) {
    const parts = [
      `level=${this.toStringValue(level)}`,
      `message=${this.toStringValue(message)}`,
    ];

    optionalParams.forEach((param, index) => {
      parts.push(`param${index}=${this.toStringValue(param)}`);
    });

    return `${parts.join('\t')}\n`;
  }

  log(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('log', message, ...optionalParams));
  }

  error(message: any, ...optionalParams: any[]) {
    console.error(this.formatMessage('error', message, ...optionalParams));
  }

  warn(message: any, ...optionalParams: any[]) {
    console.warn(this.formatMessage('warn', message, ...optionalParams));
  }

  debug(message: any, ...optionalParams: any[]) {
    console.debug(this.formatMessage('debug', message, ...optionalParams));
  }

  verbose(message: any, ...optionalParams: any[]) {
    console.log(this.formatMessage('verbose', message, ...optionalParams));
  }

  private toStringValue(value: any): string {
    if (value === undefined) {
      return 'undefined';
    }
    if (value === null) {
      return 'null';
    }
    if (typeof value === 'string') {
      return value.replace(/\t/g, ' ').replace(/\n/g, ' ');
    }
    try {
      return JSON.stringify(value).replace(/\t/g, ' ').replace(/\n/g, ' ');
    } catch {
      return String(value).replace(/\t/g, ' ').replace(/\n/g, ' ');
    }
  }
}
