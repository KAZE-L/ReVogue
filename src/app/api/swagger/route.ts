import { NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET() {
  try {
    const content = readFileSync(join(process.cwd(), 'src/app/api-docs/swagger.yaml'), 'utf-8')
    return new NextResponse(content, {
      headers: {
        'Content-Type': 'application/yaml; charset=utf-8',
      },
    })
  } catch (error) {
    return new NextResponse('File not found', { status: 404 })
  }
} 