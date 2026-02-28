import { NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

// This automatically connects using your environment variables
const redis = Redis.fromEnv();

export async function GET() {
  try {
    // Fetch our shared data array from the Redis database
    // If it doesn't exist yet, default to an empty array
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
      timestamp: new Date().toISOString(),
    };

    // 1. Get the existing array of data from Redis
    const existingData: any = (await redis.get('shared-data')) || [];
    
    // 2. Add the new item to the array
    existingData.push(newItem);
    
    // 3. Save the updated array back to Redis
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
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Item ID is required' },
        { status: 400 }
      );
    }

    // 1. Fetch current data
    const existingData: any[] = (await redis.get('shared-data')) || [];
    
    // 2. Find the specific item and update it
    const itemIndex = existingData.findIndex(item => item.id === id);
    if (itemIndex > -1) {
      existingData[itemIndex].completed = completed;
      
      // 3. Save back to Redis
      await redis.set('shared-data', existingData);
      
      return NextResponse.json({ success: true, data: existingData[itemIndex] });
    }

    return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update data' },
      { status: 500 }
    );
  }
}