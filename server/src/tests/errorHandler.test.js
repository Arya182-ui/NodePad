const errorHandler = require('../middleware/errorHandler');

const makeRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json   = jest.fn().mockReturnValue(res);
  return res;
};

describe('errorHandler middleware', () => {
  const req = { method: 'GET', path: '/api/notes', user: { uid: 'u1' } };

  it('returns 500 for generic errors', () => {
    const res = makeRes();
    errorHandler(new Error('boom'), req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: false }));
  });

  it('uses err.statusCode when provided', () => {
    const res = makeRes();
    const err = Object.assign(new Error('not found'), { statusCode: 404 });
    errorHandler(err, req, res, jest.fn());
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('returns success: false always', () => {
    const res = makeRes();
    errorHandler(new Error('x'), req, res, jest.fn());
    const body = res.json.mock.calls[0][0];
    expect(body.success).toBe(false);
  });

  it('includes message in response', () => {
    const res = makeRes();
    errorHandler(new Error('specific error'), req, res, jest.fn());
    const body = res.json.mock.calls[0][0];
    expect(body.message).toBe('specific error');
  });
});
