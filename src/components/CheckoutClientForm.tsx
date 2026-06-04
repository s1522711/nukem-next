'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from './CartProvider'

const COUNTRIES = [
  { code: 'AF', name: 'Afghanistan' }, { code: 'AL', name: 'Albania' }, { code: 'DZ', name: 'Algeria' },
  { code: 'AD', name: 'Andorra' }, { code: 'AO', name: 'Angola' }, { code: 'AG', name: 'Antigua and Barbuda' },
  { code: 'AR', name: 'Argentina' }, { code: 'AM', name: 'Armenia' }, { code: 'AU', name: 'Australia' },
  { code: 'AT', name: 'Austria' }, { code: 'AZ', name: 'Azerbaijan' }, { code: 'BS', name: 'Bahamas' },
  { code: 'BH', name: 'Bahrain' }, { code: 'BD', name: 'Bangladesh' }, { code: 'BB', name: 'Barbados' },
  { code: 'BY', name: 'Belarus' }, { code: 'BE', name: 'Belgium' }, { code: 'BZ', name: 'Belize' },
  { code: 'BJ', name: 'Benin' }, { code: 'BT', name: 'Bhutan' }, { code: 'BO', name: 'Bolivia' },
  { code: 'BA', name: 'Bosnia and Herzegovina' }, { code: 'BW', name: 'Botswana' }, { code: 'BR', name: 'Brazil' },
  { code: 'BN', name: 'Brunei' }, { code: 'BG', name: 'Bulgaria' }, { code: 'BF', name: 'Burkina Faso' },
  { code: 'BI', name: 'Burundi' }, { code: 'CV', name: 'Cabo Verde' }, { code: 'KH', name: 'Cambodia' },
  { code: 'CM', name: 'Cameroon' }, { code: 'CA', name: 'Canada' }, { code: 'CF', name: 'Central African Republic' },
  { code: 'TD', name: 'Chad' }, { code: 'CL', name: 'Chile' }, { code: 'CN', name: 'China' },
  { code: 'CO', name: 'Colombia' }, { code: 'KM', name: 'Comoros' }, { code: 'CG', name: 'Congo' },
  { code: 'CR', name: 'Costa Rica' }, { code: 'HR', name: 'Croatia' }, { code: 'CU', name: 'Cuba' },
  { code: 'CY', name: 'Cyprus' }, { code: 'CZ', name: 'Czechia' }, { code: 'DK', name: 'Denmark' },
  { code: 'DJ', name: 'Djibouti' }, { code: 'DM', name: 'Dominica' }, { code: 'DO', name: 'Dominican Republic' },
  { code: 'EC', name: 'Ecuador' }, { code: 'EG', name: 'Egypt' }, { code: 'SV', name: 'El Salvador' },
  { code: 'GQ', name: 'Equatorial Guinea' }, { code: 'ER', name: 'Eritrea' }, { code: 'EE', name: 'Estonia' },
  { code: 'SZ', name: 'Eswatini' }, { code: 'ET', name: 'Ethiopia' }, { code: 'FJ', name: 'Fiji' },
  { code: 'FI', name: 'Finland' }, { code: 'FR', name: 'France' }, { code: 'GA', name: 'Gabon' },
  { code: 'GM', name: 'Gambia' }, { code: 'GE', name: 'Georgia' }, { code: 'DE', name: 'Germany' },
  { code: 'GH', name: 'Ghana' }, { code: 'GR', name: 'Greece' }, { code: 'GD', name: 'Grenada' },
  { code: 'GT', name: 'Guatemala' }, { code: 'GN', name: 'Guinea' }, { code: 'GW', name: 'Guinea-Bissau' },
  { code: 'GY', name: 'Guyana' }, { code: 'HT', name: 'Haiti' }, { code: 'HN', name: 'Honduras' },
  { code: 'HU', name: 'Hungary' }, { code: 'IS', name: 'Iceland' }, { code: 'IN', name: 'India' },
  { code: 'ID', name: 'Indonesia' }, { code: 'IR', name: 'Iran' }, { code: 'IQ', name: 'Iraq' },
  { code: 'IE', name: 'Ireland' }, { code: 'IL', name: 'Israel' }, { code: 'IT', name: 'Italy' },
  { code: 'JM', name: 'Jamaica' }, { code: 'JP', name: 'Japan' }, { code: 'JO', name: 'Jordan' },
  { code: 'KZ', name: 'Kazakhstan' }, { code: 'KE', name: 'Kenya' }, { code: 'KI', name: 'Kiribati' },
  { code: 'KP', name: 'North Korea' }, { code: 'KR', name: 'South Korea' }, { code: 'KW', name: 'Kuwait' },
  { code: 'KG', name: 'Kyrgyzstan' }, { code: 'LA', name: 'Laos' }, { code: 'LV', name: 'Latvia' },
  { code: 'LB', name: 'Lebanon' }, { code: 'LS', name: 'Lesotho' }, { code: 'LR', name: 'Liberia' },
  { code: 'LY', name: 'Libya' }, { code: 'LI', name: 'Liechtenstein' }, { code: 'LT', name: 'Lithuania' },
  { code: 'LU', name: 'Luxembourg' }, { code: 'MG', name: 'Madagascar' }, { code: 'MW', name: 'Malawi' },
  { code: 'MY', name: 'Malaysia' }, { code: 'MV', name: 'Maldives' }, { code: 'ML', name: 'Mali' },
  { code: 'MT', name: 'Malta' }, { code: 'MH', name: 'Marshall Islands' }, { code: 'MR', name: 'Mauritania' },
  { code: 'MU', name: 'Mauritius' }, { code: 'MX', name: 'Mexico' }, { code: 'FM', name: 'Micronesia' },
  { code: 'MD', name: 'Moldova' }, { code: 'MC', name: 'Monaco' }, { code: 'MN', name: 'Mongolia' },
  { code: 'ME', name: 'Montenegro' }, { code: 'MA', name: 'Morocco' }, { code: 'MZ', name: 'Mozambique' },
  { code: 'MM', name: 'Myanmar' }, { code: 'NA', name: 'Namibia' }, { code: 'NR', name: 'Nauru' },
  { code: 'NP', name: 'Nepal' }, { code: 'NL', name: 'Netherlands' }, { code: 'NZ', name: 'New Zealand' },
  { code: 'NI', name: 'Nicaragua' }, { code: 'NE', name: 'Niger' }, { code: 'NG', name: 'Nigeria' },
  { code: 'MK', name: 'North Macedonia' }, { code: 'NO', name: 'Norway' }, { code: 'OM', name: 'Oman' },
  { code: 'PK', name: 'Pakistan' }, { code: 'PW', name: 'Palau' }, { code: 'PA', name: 'Panama' },
  { code: 'PG', name: 'Papua New Guinea' }, { code: 'PY', name: 'Paraguay' }, { code: 'PE', name: 'Peru' },
  { code: 'PH', name: 'Philippines' }, { code: 'PL', name: 'Poland' }, { code: 'PT', name: 'Portugal' },
  { code: 'QA', name: 'Qatar' }, { code: 'RO', name: 'Romania' }, { code: 'RU', name: 'Russia' },
  { code: 'RW', name: 'Rwanda' }, { code: 'KN', name: 'Saint Kitts and Nevis' }, { code: 'LC', name: 'Saint Lucia' },
  { code: 'VC', name: 'Saint Vincent and the Grenadines' }, { code: 'WS', name: 'Samoa' },
  { code: 'SM', name: 'San Marino' }, { code: 'ST', name: 'Sao Tome and Principe' }, { code: 'SA', name: 'Saudi Arabia' },
  { code: 'SN', name: 'Senegal' }, { code: 'RS', name: 'Serbia' }, { code: 'SC', name: 'Seychelles' },
  { code: 'SL', name: 'Sierra Leone' }, { code: 'SG', name: 'Singapore' }, { code: 'SK', name: 'Slovakia' },
  { code: 'SI', name: 'Slovenia' }, { code: 'SB', name: 'Solomon Islands' }, { code: 'SO', name: 'Somalia' },
  { code: 'ZA', name: 'South Africa' }, { code: 'SS', name: 'South Sudan' }, { code: 'ES', name: 'Spain' },
  { code: 'LK', name: 'Sri Lanka' }, { code: 'SD', name: 'Sudan' }, { code: 'SR', name: 'Suriname' },
  { code: 'SE', name: 'Sweden' }, { code: 'CH', name: 'Switzerland' }, { code: 'SY', name: 'Syria' },
  { code: 'TW', name: 'Taiwan' }, { code: 'TJ', name: 'Tajikistan' }, { code: 'TZ', name: 'Tanzania' },
  { code: 'TH', name: 'Thailand' }, { code: 'TL', name: 'Timor-Leste' }, { code: 'TG', name: 'Togo' },
  { code: 'TO', name: 'Tonga' }, { code: 'TT', name: 'Trinidad and Tobago' }, { code: 'TN', name: 'Tunisia' },
  { code: 'TR', name: 'Turkey' }, { code: 'TM', name: 'Turkmenistan' }, { code: 'TV', name: 'Tuvalu' },
  { code: 'UG', name: 'Uganda' }, { code: 'UA', name: 'Ukraine' }, { code: 'AE', name: 'United Arab Emirates' },
  { code: 'GB', name: 'United Kingdom' }, { code: 'US', name: 'United States' }, { code: 'UY', name: 'Uruguay' },
  { code: 'UZ', name: 'Uzbekistan' }, { code: 'VU', name: 'Vanuatu' }, { code: 'VA', name: 'Vatican City' },
  { code: 'VE', name: 'Venezuela' }, { code: 'VN', name: 'Vietnam' }, { code: 'YE', name: 'Yemen' },
  { code: 'ZM', name: 'Zambia' }, { code: 'ZW', name: 'Zimbabwe' }
]

export function CheckoutClientForm() {
  const router = useRouter()
  const { items, totalPrice, subtotal, shippingFee } = useCart()
  const [mounted, setMounted] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'crypto' | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null
  if (items.length === 0) {
    return (
      <div className="text-center p-12 bg-obsidian-light/50 border border-obsidian-border text-slate-400 font-mono text-sm tracking-widest uppercase">
        NO ASSETS SELECTED FOR ACQUISITION.
      </div>
    )
  }

  const handleProceed = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const firstName = formData.get('firstName') as string
    const lastName = formData.get('lastName') as string
    const email = formData.get('email') as string
    const country = formData.get('country') as string
    const address = formData.get('address') as string
    const zip = formData.get('zip') as string

    if (!firstName || firstName.length < 3 || firstName.length > 50) {
      setError('Invalid first name (must be 3-50 characters).')
      return
    }
    if (!lastName || lastName.length < 3 || lastName.length > 50) {
      setError('Invalid last name (must be 3-50 characters).')
      return
    }
    if (!email || email.length < 3 || email.length > 50 || !email.includes('@') || !email.includes('.')) {
      setError('Invalid email address.')
      return
    }

    const bannedCountries = ['FR', 'GF', 'PF', 'TF', 'DE', 'GI', 'PT', 'ES', 'GB']
    if (bannedCountries.includes(country)) {
      setError('Shipping to this country is banned by company policy.')
      return
    }

    if (!address || address.length < 3 || address.length > 50) {
      setError('Invalid address (must be 3-50 characters).')
      return
    }
    if (!zip || zip.length < 3 || zip.length > 50) {
      setError('Invalid zip code (must be 3-50 characters).')
      return
    }

    if (!paymentMethod) {
      setError('PLEASE SELECT A PAYMENT DESIGNATION TO PROCEED.')
      return
    }

    setError(null)
    setIsProcessing(true)

    const billingData = {
      firstName,
      lastName,
      email,
      country,
      address,
      zip,
      paymentMethod
    }

    sessionStorage.setItem('nukem_billing', JSON.stringify(billingData))

    await new Promise(r => setTimeout(r, 600))
    router.push('/checkout/payment')
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div className="lg:col-span-2 order-2 lg:order-1">
        {error && (
          <div className="mb-6 p-4 bg-crimson-dim border border-crimson text-crimson font-mono text-sm uppercase tracking-wider box-shadow-crimson animate-pulse">
            [VALIDATION_ERROR] {error}
          </div>
        )}
        <form onSubmit={handleProceed} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">First Name</label>
              <input name="firstName" required className="w-full bg-obsidian border border-obsidian-border rounded-none px-4 py-3 text-cyan-glow font-mono focus:border-cyan-glow focus:outline-none focus:ring-1 focus:ring-cyan-glow transition-colors box-shadow-cyan" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Last Name</label>
              <input name="lastName" required className="w-full bg-obsidian border border-obsidian-border rounded-none px-4 py-3 text-cyan-glow font-mono focus:border-cyan-glow focus:outline-none focus:ring-1 focus:ring-cyan-glow transition-colors box-shadow-cyan" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Comm Link (Email)</label>
            <input name="email" type="email" required className="w-full bg-obsidian border border-obsidian-border rounded-none px-4 py-3 text-cyan-glow font-mono focus:border-cyan-glow focus:outline-none focus:ring-1 focus:ring-cyan-glow transition-colors box-shadow-cyan" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Destination Region</label>
            <select name="country" required className="w-full bg-obsidian border border-obsidian-border rounded-none px-4 py-3 text-cyan-glow font-mono focus:border-cyan-glow focus:outline-none focus:ring-1 focus:ring-cyan-glow transition-colors box-shadow-cyan">
              <option value="">Select Territory...</option>
              {COUNTRIES.map(c => (
                <option key={c.code} value={c.code}>{c.name} ({c.code})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Drop Coordinates (Address)</label>
            <input name="address" required className="w-full bg-obsidian border border-obsidian-border rounded-none px-4 py-3 text-cyan-glow font-mono focus:border-cyan-glow focus:outline-none focus:ring-1 focus:ring-cyan-glow transition-colors box-shadow-cyan" />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">Sector Code (ZIP)</label>
            <input name="zip" required className="w-full bg-obsidian border border-obsidian-border rounded-none px-4 py-3 text-cyan-glow font-mono focus:border-cyan-glow focus:outline-none focus:ring-1 focus:ring-cyan-glow transition-colors box-shadow-cyan" />
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-glow/50 to-transparent my-10"></div>

          <div className="flex items-center gap-3 mb-6">
            <span className="w-2 h-2 bg-crimson animate-pulse-fast box-shadow-crimson"></span>
            <h3 className="text-xl font-bold text-slate-100 tracking-widest uppercase">Payment Designation</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setPaymentMethod('credit_card')}
              className={`p-4 border transition-all duration-300 flex flex-col items-start gap-2 ${paymentMethod === 'credit_card' ? 'border-cyan-glow bg-cyan-glow/10 box-shadow-cyan' : 'border-obsidian-border bg-obsidian hover:border-cyan-glow/50'}`}
            >
              <div className="flex justify-between items-center w-full">
                <span className="font-bold text-slate-100 uppercase tracking-widest">Credit Card</span>
                <div className={`w-4 h-4 rounded-full border ${paymentMethod === 'credit_card' ? 'border-cyan-glow flex items-center justify-center' : 'border-slate-500'}`}>
                  {paymentMethod === 'credit_card' && <div className="w-2 h-2 bg-cyan-glow rounded-full"></div>}
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('crypto')}
              className={`p-4 border transition-all duration-300 flex flex-col items-start gap-2 ${paymentMethod === 'crypto' ? 'border-cyan-glow bg-cyan-glow/10 box-shadow-cyan' : 'border-obsidian-border bg-obsidian hover:border-cyan-glow/50'}`}
            >
              <div className="flex justify-between items-center w-full">
                <span className="font-bold text-slate-100 uppercase tracking-widest">Crypto (Nukecoin)</span>
                <div className={`w-4 h-4 rounded-full border ${paymentMethod === 'crypto' ? 'border-cyan-glow flex items-center justify-center' : 'border-slate-500'}`}>
                  {paymentMethod === 'crypto' && <div className="w-2 h-2 bg-cyan-glow rounded-full"></div>}
                </div>
              </div>
            </button>
          </div>

          <div className="overflow-hidden">
            <div className={`transition-all duration-500 ease-in-out font-mono text-sm border-l-2 ${paymentMethod === 'credit_card' ? 'border-cyan-glow bg-cyan-glow/5 p-4 mt-4 opacity-100 max-h-40' : 'border-transparent bg-transparent p-0 m-0 opacity-0 max-h-0'}`}>
              <span className="text-cyan-glow">INFO:</span> Standard fiat currency transfer via secure uplink. Supports Visa, Mastercard, Amex, and Discover networks.
            </div>

            <div className={`transition-all duration-500 ease-in-out font-mono text-sm border-l-2 ${paymentMethod === 'crypto' ? 'border-crimson bg-crimson/5 p-4 mt-4 opacity-100 max-h-40' : 'border-transparent bg-transparent p-0 m-0 opacity-0 max-h-0'}`}>
              <span className="text-crimson">INFO:</span> Untraceable decentralized transfer utilizing the Nukecoin blockchain. Requires external wallet synchronization.
            </div>
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full mt-8 py-4 tactical-border bg-cyan-glow/10 border border-cyan-glow text-cyan-glow font-bold uppercase tracking-[0.2em] hover:bg-cyan-glow hover:text-obsidian hover:box-shadow-cyan transition-all duration-300 disabled:opacity-50"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-3">
                <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></span>
                PREPARING UPLINK...
              </span>
            ) : 'Proceed to Payment'}
          </button>

        </form>
      </div>

      <div className="lg:col-span-1 order-1 lg:order-2">
        <div className="bg-obsidian-light/50 border border-obsidian-border p-6 sticky top-24 tactical-border backdrop-blur-md">
          <h3 className="text-lg font-bold text-cyan-glow mb-6 tracking-widest uppercase flex items-center gap-2">
            <span className="w-2 h-2 bg-cyan-glow"></span>
            Manifest
          </h3>

          <div className="space-y-4 mb-4">
            {items.map(item => (
              <div key={item.itemCode} className="flex justify-between items-start text-slate-300 font-mono text-sm border-b border-obsidian-border pb-2">
                <span className="max-w-[150px]">{item.quantity}x {item.itemName}</span>
                <span className="text-cyan-glow">${(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2 font-mono text-sm border-t border-obsidian-border pt-4">
            <div className="flex justify-between items-center text-slate-300">
              <span>Subtotal</span>
              <span>${subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-slate-300">
              <span>Logistics/Transport</span>
              <span className="text-cyan-glow">${shippingFee.toLocaleString()}</span>
            </div>
          </div>

          <div className="border-t border-cyan-glow/20 pt-4 mt-4 flex justify-between items-center text-lg font-bold text-slate-100 uppercase tracking-widest">
            <span>Total</span>
            <span className="text-cyan-glow drop-shadow-[0_0_8px_rgba(0,240,255,0.5)]">${totalPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
