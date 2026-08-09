import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;

  beforeEach(() => {
    logger = new JsonLogger();
  });

  it('formats message as JSON', () => {
    const result = logger.formatMessage('log', 'hello', ['ctx']);
    expect(result).toBe(
      JSON.stringify({
        level: 'log',
        message: 'hello',
        optionalParams: ['ctx'],
      }),
    );
  });

  it('writes formatted log to console.log', () => {
    const spy = jest.spyOn(console, 'log').mockImplementation();
    logger.log('hello', 'FilmsController');
    expect(spy).toHaveBeenCalledWith(
      JSON.stringify({
        level: 'log',
        message: 'hello',
        optionalParams: ['FilmsController'],
      }),
    );
    spy.mockRestore();
  });

  it('writes formatted error to console.error', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation();
    logger.error('fail', 'stack');
    expect(spy).toHaveBeenCalledWith(
      JSON.stringify({
        level: 'error',
        message: 'fail',
        optionalParams: ['stack'],
      }),
    );
    spy.mockRestore();
  });
});
