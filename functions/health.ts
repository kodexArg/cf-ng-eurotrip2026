export const onRequest: PagesFunction = () => {
  return Response.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
};
