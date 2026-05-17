interface Env {
  DB: D1Database;
  MEDIA: R2Bucket;
}

function generateId(): string {
  return crypto.randomUUID().replace(/-/g, '');
}

function extFromMime(mime: string): string {
  const map: Record<string, string> = {
    'image/jpeg': 'jpg', 'image/jpg': 'jpg', 'image/png': 'png',
    'image/gif': 'gif', 'image/webp': 'webp', 'image/avif': 'avif',
    'image/heic': 'heic', 'image/heif': 'heif',
    'video/mp4': 'mp4', 'video/quicktime': 'mov', 'video/webm': 'webm',
    'video/x-msvideo': 'avi', 'video/mpeg': 'mpeg', 'video/ogg': 'ogv',
  };
  return map[mime] ?? 'bin';
}

export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const { results } = await ctx.env.DB.prepare(
    `SELECT id, city_id AS cityId, r2_key AS r2Key, caption,
            date_taken AS dateTaken, uploader_note AS uploaderNote,
            created_at AS createdAt, media_type AS mediaType, mime
     FROM photos ORDER BY date_taken ASC`
  ).all();
  return Response.json(results);
};

export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  // Auth enforced by _middleware.ts — owner only.
  let formData: FormData;
  try { formData = await ctx.request.formData(); }
  catch { return Response.json({ error: 'Expected multipart/form-data' }, { status: 400 }); }

  const fileEntry = formData.get('file');
  if (!(fileEntry instanceof File))
    return Response.json({ error: 'Field "file" is required' }, { status: 400 });

  const mime = fileEntry.type;
  if (!mime.startsWith('image/') && !mime.startsWith('video/'))
    return Response.json({ error: 'Only image/* or video/* files are accepted' }, { status: 400 });

  const mediaType: 'photo' | 'video' = mime.startsWith('video/') ? 'video' : 'photo';

  const cityId = (formData.get('city_id') ?? '').toString().trim();
  if (!cityId) return Response.json({ error: 'Field "city_id" is required' }, { status: 400 });

  const cityRow = await ctx.env.DB.prepare('SELECT id FROM cities WHERE id = ?')
    .bind(cityId).first<{ id: string }>();
  if (!cityRow) return Response.json({ error: `city_id "${cityId}" not found` }, { status: 400 });

  const captionRaw = formData.get('caption');
  const caption = captionRaw !== null ? captionRaw.toString().trim() : null;
  if (caption !== null && caption.length > 150)
    return Response.json({ error: 'caption must be 150 characters or fewer' }, { status: 400 });

  const dateTakenRaw = formData.get('date_taken');
  const dateTaken = dateTakenRaw !== null ? dateTakenRaw.toString().trim() || null : null;

  const id = generateId();
  const r2Key = `${cityId}/${crypto.randomUUID()}.${extFromMime(mime)}`;

  await ctx.env.MEDIA.put(r2Key, await fileEntry.arrayBuffer(), {
    httpMetadata: { contentType: mime },
  });

  const now = new Date().toISOString();
  try {
    await ctx.env.DB.prepare(
      `INSERT INTO photos (id, city_id, r2_key, caption, date_taken, uploader_note, created_at, media_type, mime)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(id, cityId, r2Key, caption, dateTaken, null, now, mediaType, mime).run();
  } catch {
    await ctx.env.MEDIA.delete(r2Key).catch(() => undefined);
    return Response.json({ error: 'Database insert failed' }, { status: 500 });
  }

  return Response.json({ id, cityId, r2Key, caption, dateTaken, uploaderNote: null,
    createdAt: now, mediaType, mime }, { status: 201 });
};
