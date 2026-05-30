'use server'

import { prisma } from '@/lib/prisma'
import { createSession, deleteSession } from '@/lib/session'
import crypto from 'crypto'
import { redirect } from 'next/navigation'

function computeSha256Hash(rawData: string) {
  return crypto.createHash('sha256').update(rawData).digest('hex')
}

export async function login(formData: FormData) {
  const username = formData.get('username') as string
  const password = formData.get('password') as string

  if (!username || !password) {
    redirect('/login?error=Username+and+password+are+required')
  }

  const hashedPassword = computeSha256Hash(password)

  const user = await prisma.user.findFirst({
    where: {
      username: username,
      password: hashedPassword,
    },
  })

  if (!user) {
    redirect('/login?error=Invalid+username+or+password')
  }

  await createSession(user.id, user.username, user.admin)
  redirect('/')
}

export async function register(formData: FormData) {
  const username = formData.get('username') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirm-password') as string

  if (!username || !password || !confirmPassword) {
    redirect('/register?error=All+fields+are+required')
  }

  if (password !== confirmPassword) {
    redirect('/register?error=Passwords+do+not+match')
  }

  if (username.length < 3) {
    redirect('/register?error=Username+is+too+short')
  }
  if (username.length > 50) {
    redirect('/register?error=Username+is+too+long')
  }
  if (password.length < 3) {
    redirect('/register?error=Password+is+too+short')
  }
  if (password.length > 50) {
    redirect('/register?error=Password+is+too+long')
  }

  const existingUser = await prisma.user.findUnique({
    where: { username },
  })

  if (existingUser) {
    redirect('/register?error=Username+already+exists')
  }

  const hashedPassword = computeSha256Hash(password)

  const user = await prisma.user.create({
    data: {
      username,
      password: hashedPassword,
    },
  })

  await createSession(user.id, user.username, user.admin)
  redirect('/')
}

export async function logout() {
  await deleteSession()
  redirect('/')
}
