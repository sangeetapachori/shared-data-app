import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

export const dynamic = 'force-dynamic'; 

const redis = Redis.fromEnv();

export async function GET() {
  try {
    const data = await redis.get('shared-data') || [];
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.content) {
      return NextResponse.json(
        { success: false, error: 'Content is required' },
        { status: 400 }
      );
    }

    const newItem = {
      id: crypto.randomUUID(),
      content: body.content,
      product: body.product || 'Unspecified',
      orderDate: body.orderDate || new Date().toISOString(),
      completed: false,
      location: body.location || 'Unspecified'
    };

    const existingData: any[] = (await redis.get('shared-data')) || [];
    existingData.push(newItem);
    await redis.set('shared-data', existingData);

    return NextResponse.json({ success: true, data: newItem }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to save data' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, completed } = await request.json();
    
    if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });

    const existingData: any[] = (await redis.get('shared-data')) || [];
    const itemIndex = existingData.findIndex(item => item.id === id);
    
    if (itemIndex > -1) {
      existingData[itemIndex].completed = completed;
      await redis.set('shared-data', existingData);
      return NextResponse.json({ success: true, data: existingData[itemIndex] });
    }

    return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Update failed' }, { status: 500 });
  }
}