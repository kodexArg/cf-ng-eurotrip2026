import { describe, expect, it } from 'vitest';
import { onRequestGet } from '../../functions/media/[[path]]';

const DATA = new TextEncoder().encode('0123456789');

function bucket() {
  return {
    async get(key: string, opts: { range?: Headers }) {
      if (key !== 'mad/a.mp4') return null;
      const header = opts.range?.get('Range');
      const match = header?.match(/bytes=(\d+)-(\d+)/);
      const range = match ? { offset: Number(match[1]), length: Number(match[2]) - Number(match[1]) + 1 } : undefined;
      const slice = range ? DATA.slice(range.offset, range.offset + range.length) : DATA;
      return {
        size: DATA.length,
        httpEtag: '"e"',
        range,
        body: new Blob([slice]).stream(),
        writeHttpMetadata: (h: Headers) => h.set('Content-Type', 'video/mp4'),
      };
    },
  };
}

async function get(path: string[], headers: Record<string, string> = {}) {
  const ctx = {
    params: { path },
    request: new Request('https://x/media/' + path.join('/'), { headers }),
    env: { MEDIA: bucket() },
  };
  return (onRequestGet as unknown as (c: typeof ctx) => Promise<Response>)(ctx);
}

describe('media proxy', () => {
  it('streams the whole object with metadata', async () => {
    const res = await get(['mad', 'a.mp4']);
    expect(res.status).toBe(200);
    expect(res.headers.get('Content-Type')).toBe('video/mp4');
    expect(res.headers.get('Cache-Control')).toContain('private');
    expect(await res.text()).toBe('0123456789');
  });

  it('answers byte ranges with 206', async () => {
    const res = await get(['mad', 'a.mp4'], { Range: 'bytes=2-5' });
    expect(res.status).toBe(206);
    expect(res.headers.get('Content-Range')).toBe('bytes 2-5/10');
    expect(await res.text()).toBe('2345');
  });

  it('returns 404 for unknown or traversal keys', async () => {
    expect((await get(['mad', 'b.jpg'])).status).toBe(404);
    expect((await get(['..', 'secret'])).status).toBe(404);
    expect((await get([])).status).toBe(404);
  });
});
