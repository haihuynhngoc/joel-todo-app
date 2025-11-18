jest.setTimeout(10000);

beforeAll(async () => {
  console.log('Test environment initialized');
});

afterAll(async () => {
  console.log('Test environment cleaned up');
});
