// src/app/api/read-content/route.ts
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get('slug')
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json({ error: 'Invalid slug' }, { status: 400 })
  }

  const filePath = path.join(process.cwd(), 'src', 'content', 'readings', `${slug}.md`)

  if (!fs.existsSync(filePath)) {
    // Return placeholder if content not written yet
    return NextResponse.json({
      content: `## Your Reading\n\nThis reading is being prepared. Check back shortly.\n\nThe full analysis for this topic will be available very soon.`
    })
  }

  const content = fs.readFileSync(filePath, 'utf8')
  return NextResponse.json({ content })
}
