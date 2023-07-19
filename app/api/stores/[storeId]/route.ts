import { NextResponse } from 'next/server';

import { auth } from '@clerk/nextjs';

import { prisma } from '@/lib/db';

export async function PATCH(
  request: Request,
  {
    params,
  }: {
    params: { storeId: string };
  },
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { name } = body as { name: string };

    if (!params.storeId) {
      return new NextResponse('Store id is required', { status: 400 });
    }

    if (!name) {
      return new NextResponse('Name is required', { status: 400 });
    }

    const store = await prisma.store.update({
      where: { id: params.storeId, userId },
      data: { name },
    });

    return NextResponse.json(store);
  } catch (error) {
    return new NextResponse('Internal error', { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  {
    params,
  }: {
    params: { storeId: string };
  },
) {
  try {
    const { userId } = auth();

    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse('Store id is required', { status: 400 });
    }

    const store = await prisma.store.delete({
      where: {
        id: params.storeId,
        userId,
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    return new NextResponse('Internal error', { status: 500 });
  }
}
