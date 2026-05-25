import { NextResponse } from 'next/server';
import climateData from '@/data/ashrae-weather.json';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const searchInput = searchParams.get('q')?.toLowerCase() || '';

  if (!searchInput) {
    return NextResponse.json(climateData.slice(0, 8), {
      headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200' },
    });
  }

  const matches = climateData.filter(
    (record) =>
      record.city.toLowerCase().includes(searchInput) ||
      record.state.toLowerCase().includes(searchInput)
  );

  return NextResponse.json(matches.slice(0, 8), {
    headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200' },
  });
}
