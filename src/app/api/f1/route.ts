import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let path = searchParams.get('path');
    if (!path) {
      return NextResponse.json({ error: 'Missing path parameter' }, { status: 400 });
    }

    // Strip leading slash if present
    if (path.startsWith('/')) {
      path = path.slice(1);
    }

    // Security whitelist check: only allow 2026 or current season paths
    if (!path.startsWith('2026') && !path.startsWith('current')) {
      return NextResponse.json({ error: 'Unauthorized path query' }, { status: 400 });
    }

    // Reconstruct the full Jolpica F1 API URL with query parameters (e.g. limit=1000)
    const targetUrl = new URL(`https://api.jolpi.ca/ergast/f1/${path}`);
    searchParams.forEach((value, key) => {
      if (key !== 'path') {
        targetUrl.searchParams.set(key, value);
      }
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
