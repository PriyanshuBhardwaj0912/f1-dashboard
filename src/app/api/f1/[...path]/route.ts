import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await params;
    const pathStr = path.join('/');

    // Security whitelist check: only allow 2026 or current season paths
    if (!pathStr.startsWith('2026') && !pathStr.startsWith('current')) {
      return NextResponse.json({ error: 'Unauthorized path query' }, { status: 400 });
    }

    // Reconstruct the full Jolpica F1 API URL with query parameters (e.g. limit=1000)
    const { searchParams } = new URL(request.url);
    const targetUrl = new URL(`https://api.jolpi.ca/ergast/f1/${pathStr}`);
    searchParams.forEach((value, key) => {
      targetUrl.searchParams.set(key, value);
    });

    const res = await fetch(targetUrl.toString(), {
      next: { revalidate: 300 } // Cache for 5 minutes server-side
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch from F1 API' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
