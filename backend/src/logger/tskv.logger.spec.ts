import { TskvLogger } from './tskv.logger';

describe('TskvLogger', () => {
  let logger: TskvLogger;

  beforeEach(() => {
    logger = new TskvLogger();
  });

  it('formats message as TSKV', () => {
    const result = logger.formatMessage('log', 'hello', 'FilmsController');
    expect(result).toBe('level=log\tmessage=hello\tparam0=FilmsController\n');
  });

  it('writes formatted log to console.log', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation();
    logger.log('hello', 'ctx');
    expect(spy).toHaveBeenCalledWith('level=log\tmessage=hello\tparam0=ctx\n');
    spy.mockRestore();
  });

  it('writes formatted warn to console.warn', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation();
    logger.warn('careful');
    expect(spy).toHaveBeenCalledWith('level=warn\tmessage=careful\n');
    spy.mockRestore();
  });
});
