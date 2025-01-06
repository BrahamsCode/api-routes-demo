import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json([
    { id: 1, text: 'Aprender Next.js', completed: false },
    { id: 2, text: 'Crear API Routes', completed: true }
  ]);
}