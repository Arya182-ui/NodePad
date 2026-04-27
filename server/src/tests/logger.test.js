const logger = require('../utils/logger');

describe('logger', () => {
  it('exposes info, warn, error methods', () => {
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.warn).toBe('function');
    expect(typeof logger.error).toBe('function');
  });

  it('does not throw when called with message only', () => {
    expect(() => logger.info('test message')).not.toThrow();
    expect(() => logger.warn('test warning')).not.toThrow();
    expect(() => logger.error('test error')).not.toThrow();
  });

  it('does not throw when called with meta object', () => {
    expect(() => logger.info('msg', { uid: 'abc', path: '/api/notes' })).not.toThrow();
  });
});
