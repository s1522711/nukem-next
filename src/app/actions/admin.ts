'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { revalidatePath } from 'next/cache'
import { writeFile, mkdir, unlink } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

async function checkAdmin() {
  const session = await getSession()
  if (!session || !session.admin) {
    throw new Error('Unauthorized')
  }
}

export async function deleteUser(formData: FormData) {
  await new Promise<void>(resolve => setTimeout(resolve, 800))
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
  await new Promise<void>(resolve => setTimeout(resolve, 800))
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
  await new Promise<void>(resolve => setTimeout(resolve, 800))
  await checkAdmin()
  const itemId = parseInt(formData.get('itemId') as string, 10)
  
  if (itemId) {
    const item = await prisma.item.findUnique({ where: { id: itemId } })
    if (item && item.imageLocation?.startsWith('/img/products/')) {
      try {
        const filePath = join(process.cwd(), 'public', item.imageLocation)
        if (existsSync(filePath)) {
          await unlink(filePath)
        }
      } catch (e) {
        console.error('Failed to delete image file:', e)
      }
    }

    await prisma.item.delete({ where: { id: itemId } })
    revalidatePath('/admin')
  }
}

export async function addItem(formData: FormData) {
  await new Promise<void>(resolve => setTimeout(resolve, 800))
  await checkAdmin()
  
  const itemCode = formData.get('itemCode') as string
  const itemName = formData.get('itemName') as string
  const price = parseFloat(formData.get('price') as string)
  const flairText = formData.get('flairText') as string
  const flairColorClass = formData.get('flairColorClass') as string
  const flairTextColorClass = formData.get('flairTextColorClass') as string
  const flairLink = formData.get('flairLink') as string
  const imageFile = formData.get('imageFile') as File
  const highYield = formData.get('highYield') === 'true'

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
        flairLink: flairLink || null,
        highYield
      }
    })
    revalidatePath('/admin')
  }
}
