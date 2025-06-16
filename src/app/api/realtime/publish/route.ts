import { NextResponse } from 'next/server';
import { publish } from '@/lib/redis';
import { getServerAuthSession } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await getServerAuthSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { channel, data } = await req.json();
    if (!channel || !data) {
      return NextResponse.json({ error: 'Missing channel or data' }, { status: 400 });
    }

    await publish(channel, JSON.stringify(data));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error publishing message:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 