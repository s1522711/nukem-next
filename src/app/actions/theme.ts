'use server'

import { cookies } from 'next/headers'

export async function setTheme(theme: 'modern' | 'classic') {
  const cookieStore = await cookies()
  cookieStore.set('nukem-theme', theme, { path: '/' })
}
