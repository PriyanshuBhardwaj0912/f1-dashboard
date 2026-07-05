import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const res = await fetch('https://www.motorsport.com/rss/f1/news/', {
      next: { revalidate: 300 } // Cache for 5 minutes
    });
    if (!res.ok) throw new Error('Failed to fetch RSS');
    
    const xmlText = await res.text();
    
    const items: any[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;
    
    while ((match = itemRegex.exec(xmlText)) !== null) {
      const itemContent = match[1];
      
      const titleMatch = /<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>|<title>([\s\S]*?)<\/title>/.exec(itemContent);
      const linkMatch = /<link>([\s\S]*?)<\/link>/.exec(itemContent);
      const descMatch = /<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>|<description>([\s\S]*?)<\/description>/.exec(itemContent);
      const categoryMatch = /<category>([\s\S]*?)<\/category>/.exec(itemContent);
      const dateMatch = /<pubDate>([\s\S]*?)<\/pubDate>/.exec(itemContent);
      const imageMatch = /<enclosure[^>]*url="([^"]*)"/.exec(itemContent);
      
      const title = titleMatch ? (titleMatch[1] || titleMatch[2]) : '';
      const link = linkMatch ? linkMatch[1] : '';
      let summary = descMatch ? (descMatch[1] || descMatch[2]) : '';
      
      // Clean HTML from summary
      summary = summary
        .replace(/<[^>]*>/g, '')
        .replace(/Keep reading.*/i, '')
        .trim();
      
      const category = categoryMatch ? categoryMatch[1] : 'Racing';
      const rawDate = dateMatch ? dateMatch[1] : '';
      const image = imageMatch ? imageMatch[1] : '';
      
      let dateFormatted = rawDate;
      try {
        const d = new Date(rawDate);
        if (!isNaN(d.getTime())) {
          dateFormatted = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }
      } catch {}

      items.push({
        id: String(items.length + 1),
        title: title.trim(),
        summary: summary.trim(),
        link: link.trim(),
        category: category.trim(),
        readTime: '3 min read',
        source: 'Motorsport.com',
        date: dateFormatted,
        image
      });
    }
    
    return NextResponse.json(items.slice(0, 10));
  } catch (err: any) {
    console.error('Failed to parse F1 news RSS feed', err);
    return NextResponse.json([], { status: 200 }); // Return empty array on failure instead of throwing error
  }
}
