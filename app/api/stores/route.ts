import { NextResponse } from 'next/server';

import { auth } from '@clerk/nextjs';

import { prisma } from '@/lib/db';

// TODO: validate with zod ?
export async function POST(request: Request) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();

    // TODO: find a way to properly validate body (zod again ?).
    const { name } = body as { name: string };

    if (!name) {
      return new NextResponse('Name is required', { status: 400 });
    }

    const store = prisma.store.create({
      data: {
        name,
        userId,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    return new NextResponse('Internal error', { status: 500 });
  }
}
