interface Env {
  MEDIA: R2Bucket;
}

/** Streams a trip photo or video from R2 behind Access, with Range support for video seeking. */
export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const segments = ctx.params['path'];
  const key = (Array.isArray(segments) ? segments : [segments ?? '']).join('/');
  if (!key || key.split('/').some((s) => s === '' || s === '.' || s === '..')) {
    return new Response('Not Found', { status: 404 });
  }

  const object = await ctx.env.MEDIA.get(key, {
    range: ctx.request.headers,
    onlyIf: ctx.request.headers,
  });
  if (!object) return new Response('Not Found', { status: 404 });

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set('ETag', object.httpEtag);
  headers.set('Accept-Ranges', 'bytes');
  headers.set('Cache-Control', 'private, max-age=86400, immutable');

  if (!('body' in object)) return new Response(null, { status: 304, headers });

  const range = object.range as { offset?: number; length?: number; suffix?: number } | undefined;
  if (range && ctx.request.headers.has('Range')) {
    const offset = range.suffix !== undefined ? object.size - range.suffix : (range.offset ?? 0);
    const length = range.suffix ?? range.length ?? object.size - offset;
    headers.set('Content-Range', `bytes ${offset}-${offset + length - 1}/${object.size}`);
    headers.set('Content-Length', String(length));
    return new Response(object.body, { status: 206, headers });
  }

  headers.set('Content-Length', String(object.size));
  return new Response(object.body, { headers });
};
