import { NextRequest, NextResponse } from 'next/server'

/**
 * ロードバランサー死活監視用APIです
 * @param _req
 * @constructor
 */
export async function GET(_req: NextRequest) {
  return NextResponse.json({ status: 'ok' })
}
