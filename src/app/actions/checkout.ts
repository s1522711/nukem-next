'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'

export async function processCheckout(formData: FormData) {
  await new Promise<void>(resolve => setTimeout(resolve, 800))
  const session = await getSession()
  const cartItemsStr = formData.get('cartItems') as string

  if (!session) {
    redirect(`/checkout?error=You+must+be+logged+in`)
  }

  let cartItems: { itemCode: string, quantity: number }[] = []
  try {
    cartItems = JSON.parse(cartItemsStr)
  } catch (e) {
    redirect(`/checkout?error=Invalid+cart+data`)
  }

  if (!cartItems || cartItems.length === 0) {
    redirect(`/checkout?error=Cart+is+empty`)
  }

  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const email = formData.get('email') as string
  const country = formData.get('country') as string
  const address = formData.get('address') as string
  const zip = formData.get('zip') as string
  const paymentMethod = formData.get('paymentMethod') as string
  const ccNumber = formData.get('cc-number') as string
  const cryptoWallet = formData.get('crypto-wallet') as string
  const cryptoTx = formData.get('crypto-tx') as string

  // Validations matching original ASP.NET code
  if (!firstName || firstName.length < 3 || firstName.length > 50) redirect(`/checkout/payment?error=Invalid+first+name`)
  if (!lastName || lastName.length < 3 || lastName.length > 50) redirect(`/checkout/payment?error=Invalid+last+name`)
  if (!email || email.length < 3 || email.length > 50 || !email.includes('@') || !email.includes('.')) redirect(`/checkout/payment?error=Invalid+email`)
  if (!country) redirect(`/checkout/payment?error=Please+select+your+country`)

  const bannedCountries = ['FR', 'GF', 'PF', 'TF', 'DE', 'GI', 'PT', 'ES', 'GB']
  if (bannedCountries.includes(country)) redirect(`/checkout/payment?error=Shipping+to+this+country+is+banned+by+company+policy.`)

  if (!address || address.length < 3 || address.length > 50) redirect(`/checkout/payment?error=Invalid+address`)
  if (!zip || zip.length < 3 || zip.length > 50) redirect(`/checkout/payment?error=Invalid+zip`)

  let last4cc = ''
  if (paymentMethod === 'crypto') {
    if (!cryptoWallet || cryptoWallet.length < 5) redirect(`/checkout/payment?error=Invalid+crypto+wallet`)
    if (!cryptoTx || cryptoTx.length < 10) redirect(`/checkout/payment?error=Invalid+transaction+hash`)
    last4cc = cryptoWallet.substring(cryptoWallet.length - 4)
  } else {
    if (!ccNumber || ccNumber.replace(/\D/g, '').length < 15) redirect(`/checkout/payment?error=Invalid+credit+card`)
    const rawCc = ccNumber.replace(/\D/g, '')
    last4cc = rawCc.substring(rawCc.length - 4)
  }

  // Fetch real items to calculate total and prevent client spoofing
  let total = 0
  const orderItemsData = []

  for (const ci of cartItems) {
    const item = await prisma.item.findUnique({ where: { itemCode: ci.itemCode } })
    if (!item) {
      redirect(`/checkout?error=Item+not+found`)
    }
    total += item.price * ci.quantity
    orderItemsData.push({
      itemCode: item.itemCode,
      itemName: item.itemName,
      price: item.price,
      quantity: ci.quantity
    })
  }

  if (cartItems.length > 0) {
    total += 100 // Add $100 Logistics/Shipping Fee
  }

  const order = await prisma.order.create({
    data: {
      name: `${firstName} ${lastName}`,
      email,
      country,
      address,
      zip,
      last4cc,
      userId: session.userId,
      total,
      items: {
        create: orderItemsData
      }
    }
  })

  redirect(`/checkout/confirmed?orderId=${order.id}`)
}
