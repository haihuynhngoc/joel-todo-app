import { StartedPostgreSqlContainer } from '@testcontainers/postgresql';

declare global {
  // eslint-disable-next-line no-var
  var __TESTCONTAINER__: StartedPostgreSqlContainer;
}

export default async function globalTeardown() {
  const container = global.__TESTCONTAINER__;

  if (container) {
    console.log('🐳 Stopping PostgreSQL test container...');
    await container.stop();
    console.log('✓ PostgreSQL container stopped');
  }
}
