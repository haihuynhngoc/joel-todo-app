jest.setTimeout(10000);

global.fetch = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});
