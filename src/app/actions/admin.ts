'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { revalidatePath } from 'next/cache'

async function checkAdmin() {
  const session = await getSession()
  if (!session || !session.admin) {
    throw new Error('Unauthorized')
  }
}

export async function deleteUser(formData: FormData) {
  await checkAdmin()
  const userId = parseInt(formData.get('userId') as string, 10)
  
  if (userId) {
    // Delete user's orders first (foreign key constraint)
    await prisma.order.deleteMany({ where: { userId } })
    await prisma.user.delete({ where: { id: userId } })
    revalidatePath('/admin')
  }
}

export async function toggleAdmin(formData: FormData) {
  await checkAdmin()
  const userId = parseInt(formData.get('userId') as string, 10)
  const currentAdmin = formData.get('currentAdmin') === 'true'
  
  if (userId) {
    await prisma.user.update({
      where: { id: userId },
      data: { admin: !currentAdmin }
    })
    revalidatePath('/admin')
  }
}

export async function deleteItem(formData: FormData) {
  await checkAdmin()
  const itemId = parseInt(formData.get('itemId') as string, 10)
  
  if (itemId) {
    await prisma.item.delete({ where: { id: itemId } })
    revalidatePath('/admin')
  }
}

import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function addItem(formData: FormData) {
  await checkAdmin()
  
  const itemCode = formData.get('itemCode') as string
  const itemName = formData.get('itemName') as string
  const price = parseFloat(formData.get('price') as string)
  const flairText = formData.get('flairText') as string
  const flairColorClass = formData.get('flairColorClass') as string
  const flairTextColorClass = formData.get('flairTextColorClass') as string
  const flairLink = formData.get('flairLink') as string
  const imageFile = formData.get('imageFile') as File

  let imageLocation = '/img/index/tsar-bobma.webp'

  if (imageFile && imageFile.size > 0) {
    const bytes = await imageFile.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadsDir = join(process.cwd(), 'public', 'img', 'products')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    const fileName = `${Date.now()}-${imageFile.name.replace(/[^a-zA-Z0-9.-]/g, '')}`
    const path = join(uploadsDir, fileName)
    
    await writeFile(path, buffer)
    imageLocation = `/img/products/${fileName}`
  }
  
  if (itemCode && itemName && !isNaN(price)) {
    await prisma.item.create({
      data: {
        itemCode,
        itemName,
        price,
        imageLocation,
        flairText: flairText || null,
        flairColorClass: flairColorClass || null,
        flairTextColorClass: flairTextColorClass || null,
        flairLink: flairLink || null
      }
    })
    revalidatePath('/admin')
  }
}
