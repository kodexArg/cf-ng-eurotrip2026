interface Env {
  DB: D1Database;
  AUTH_PASSPHRASE: string;
  AUTH_SECRET: string;
}

export const onRequestPost: PagesFunction<Env> = async (_ctx) => {
  // Clear the auth cookie by setting Max-Age=0
  const cookie = 'auth_token=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0';

  return Response.json(
    { authenticated: false },
    {
      headers: {
        'Set-Cookie': cookie,
      },
    }
  );
};
