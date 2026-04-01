import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
    try {
        revalidatePath('/');
        return NextResponse.json({ revalidated: true, now: Date.now() });
    } catch (err: any) {
        return NextResponse.json({ message: 'Error revalidating' }, { status: 500 });
    }
}
