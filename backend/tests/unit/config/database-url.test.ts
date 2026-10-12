const loadDatabaseUrl = (env: Record<string, string | undefined>): string => {
  const previous = { ...process.env };
  delete process.env.DATABASE_URL;
  Object.assign(process.env, env);

  try {
    let databaseUrl = '';
    jest.isolateModules(() => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      databaseUrl = require('../../../src/config').config.databaseUrl;
    });
    return databaseUrl;
  } finally {
    process.env = previous;
  }
};

describe('database URL from split settings', () => {
  const baseEnv = {
    DB_HOST: 'db.example.internal',
    DB_PORT: '5432',
    DB_USER: 'atlas',
    DB_PASSWORD: 'p@ss/word',
  };

  it('builds the URL from the individual DB_* settings', () => {
    const url = new URL(loadDatabaseUrl({ ...baseEnv, DB_NAME: 'atlasclean', DB_SSLMODE: 'require' }));

    expect(url.hostname).toBe('db.example.internal');
    expect(url.pathname).toBe('/atlasclean');
    expect(decodeURIComponent(url.password)).toBe('p@ss/word');
    expect(url.searchParams.get('sslmode')).toBe('require');
    expect(url.searchParams.get('schema')).toBe('public');
  });

  it('percent-encodes the database name so ? and # stay part of the path', () => {
    const url = new URL(loadDatabaseUrl({ ...baseEnv, DB_NAME: 'atlas?clean#1' }));

    expect(url.pathname).toBe('/atlas%3Fclean%231');
    expect(decodeURIComponent(url.pathname.slice(1))).toBe('atlas?clean#1');
    expect(url.hash).toBe('');
    expect(url.searchParams.get('schema')).toBe('public');
    expect([...url.searchParams.keys()]).toEqual(['schema']);
  });
});
