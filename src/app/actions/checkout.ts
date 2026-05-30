'use server'

import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'

export async function processCheckout(formData: FormData) {
  const session = await getSession()
  const itemCode = formData.get('itemCode') as string

  if (!session) {
    redirect(`/checkout?itemCode=${itemCode}&error=You+must+be+logged+in`)
  }

  const firstName = formData.get('firstName') as string
  const lastName = formData.get('lastName') as string
  const email = formData.get('email') as string
  const country = formData.get('country') as string
  const address = formData.get('address') as string
  const zip = formData.get('zip') as string
  const ccName = formData.get('cc-name') as string
  const ccNumber = formData.get('cc-number') as string
  const ccExpiration = formData.get('cc-expiration') as string
  const ccCvv = formData.get('cc-cvv') as string

  // Validations matching original ASP.NET code
  if (!firstName || firstName.length < 3 || firstName.length > 50) redirect(`/checkout?itemCode=${itemCode}&error=Invalid+first+name`)
  if (!lastName || lastName.length < 3 || lastName.length > 50) redirect(`/checkout?itemCode=${itemCode}&error=Invalid+last+name`)
  if (!email || email.length < 3 || email.length > 50 || !email.includes('@') || !email.includes('.')) redirect(`/checkout?itemCode=${itemCode}&error=Invalid+email`)
  if (!country) redirect(`/checkout?itemCode=${itemCode}&error=Please+select+your+country`)
  
  const bannedCountries = ['FR', 'GF', 'PF', 'TF', 'DE', 'GI', 'IL', 'PT', 'ES', 'GB']
  if (bannedCountries.includes(country)) redirect(`/checkout?itemCode=${itemCode}&error=Shipping+to+this+country+is+banned+by+company+policy.`)
  
  if (!address || address.length < 3 || address.length > 50) redirect(`/checkout?itemCode=${itemCode}&error=Invalid+address`)
  if (!zip || zip.length < 3 || zip.length > 50) redirect(`/checkout?itemCode=${itemCode}&error=Invalid+zip`)
  // Disabled CC validity verification per request
  // if (!ccName || ccName.length < 3 || ccName.length > 50) redirect(`/checkout?itemCode=${itemCode}&error=Invalid+CC+name`)
  // if (!ccNumber || ccNumber.length < 15 || ccNumber.length > 16) redirect(`/checkout?itemCode=${itemCode}&error=Invalid+CC+number`)
  // if (!ccExpiration || ccExpiration.replace(' / ', '').length !== 4) redirect(`/checkout?itemCode=${itemCode}&error=Invalid+CC+expiration`)
  // if (!ccCvv || ccCvv.length < 3 || ccCvv.length > 4) redirect(`/checkout?itemCode=${itemCode}&error=Invalid+CC+CVV`)

  const item = await prisma.item.findUnique({ where: { itemCode } })
  if (!item) redirect(`/checkout?itemCode=${itemCode}&error=Item+not+found`)

  const last4cc = ccNumber.substring(ccNumber.length - 4)

  const order = await prisma.order.create({
    data: {
      name: `${firstName} ${lastName}`,
      email,
      country,
      address,
      zip,
      last4cc,
      userId: session.userId,
      itemName: item.itemName,
      price: item.price,
    }
  })

  const headersList = await headers()
  const userAgent = headersList.get('user-agent') || ''
  const ua = userAgent.toLowerCase()
  const isSafari = ua.includes('safari') && !ua.includes('chrome') && !ua.includes('chromium') && !ua.includes('android')

  if ((item.itemCode === 'TsarBomba' || item.itemCode === 'LittleBoy') && !isSafari) {
    redirect(`/checkout/launch?orderId=${order.id}`)
  } else {
    redirect(`/checkout/confirmed?orderId=${order.id}`)
  }
}
