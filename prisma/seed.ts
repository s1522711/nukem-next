import { PrismaClient } from '@prisma/client'
import crypto from 'crypto'

const prisma = new PrismaClient()

function computeSha256Hash(rawData: string) {
  return crypto.createHash('sha256').update(rawData).digest('hex')
}

async function main() {
  const adminPassword = computeSha256Hash('admin123')
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: {
      username: 'admin',
      password: adminPassword,
      admin: true,
    },
  })

  const userPassword = computeSha256Hash('user123')
  await prisma.user.upsert({
    where: { username: 'user' },
    update: {},
    create: {
      username: 'user',
      password: userPassword,
      admin: false,
    },
  })

  const items = [
    {
      itemCode: 'TsarBomba',
      itemName: 'Tsar Bomba',
      price: 15000000.0,
      imageLocation: '/img/index/tsar-bobma.webp',
      flairText: 'New!',
      flairColorClass: 'bg-secondary',
      flairTextColorClass: 'text-white',
      flairLink: '#',
    },
    {
      itemCode: 'DukeNukem',
      itemName: 'Duke Nukem',
      price: 50.0,
      imageLocation: '/img/index/duke-nukem.jpg',
      flairText: 'Rare!',
      flairColorClass: 'bg-primary',
      flairTextColorClass: 'text-white',
      flairLink: '#',
    },
    {
      itemCode: 'CS2Bomb',
      itemName: 'CS2 Bomb',
      price: 1500.0,
      imageLocation: '/img/index/cs-bomb.jpeg',
      flairText: 'New!',
      flairColorClass: 'bg-secondary',
      flairTextColorClass: 'text-white',
      flairLink: '#',
    },
    {
      itemCode: 'OggyCopter',
      itemName: 'OggyCopter',
      price: 250.0,
      imageLocation: '/img/index/oggycopter.png',
      flairText: 'New!',
      flairColorClass: 'bg-warning',
      flairTextColorClass: 'text-black',
      flairLink: '/secret',
    },
    {
      itemCode: 'CBS',
      itemName: 'Computer Breaking Service',
      price: 100.0,
      imageLocation: '/img/index/computer-breaker.jpg',
      flairText: 'New!',
      flairColorClass: 'bg-secondary',
      flairTextColorClass: 'text-white',
      flairLink: '#',
    },
    {
      itemCode: 'TamirGTA',
      itemName: 'Tamir GTA Missile',
      price: 500000.0,
      imageLocation: '/img/index/tamir-missile.jpg',
      flairText: 'Missile!',
      flairColorClass: 'bg-primary',
      flairTextColorClass: 'text-white',
      flairLink: '#',
    },
    {
      itemCode: 'Nick',
      itemName: 'Nick',
      price: 1.0,
      imageLocation: '/img/index/nick.png',
      flairText: 'Barely used!',
      flairColorClass: 'bg-warning',
      flairTextColorClass: 'text-black',
      flairLink: '/img/index/secret.jpg',
    },
    {
      itemCode: 'LittleBoy',
      itemName: 'Little Boy',
      price: 1000000.0,
      imageLocation: '/img/index/Little_boy.jpg',
      flairText: 'Rare!',
      flairColorClass: 'bg-primary',
      flairTextColorClass: 'text-white',
      flairLink: '#',
    },
  ]

  for (const item of items) {
    await prisma.item.upsert({
      where: { itemCode: item.itemCode },
      update: {},
      create: item,
    })
  }

  console.log('Seeded database successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
