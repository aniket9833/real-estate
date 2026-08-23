import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number): string {
  if (amount >= 10000000)
    return `₹${(amount / 10000000).toFixed(amount % 10000000 === 0 ? 0 : 2)} Cr`;
  if (amount >= 100000)
    return `₹${(amount / 100000).toFixed(amount % 100000 === 0 ? 0 : 2)} Lakh`;
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatArea(value: number, unit: string): string {
  const labels: Record<string, string> = {
    sqft: 'sq.ft.',
    acre: 'Acre',
    gunta: 'Gunta',
    hectare: 'Hectare',
  };
  return `${value.toLocaleString('en-IN')} ${labels[unit] ?? unit}`;
}

export const PROPERTY_TYPE_LABELS: Record<string, string> = {
  'residential-plot': 'Residential Plot',
  'agricultural-land': 'Agricultural Land',
  'commercial-plot': 'Commercial Plot',
  house: 'House',
  flat: 'Flat / Apartment',
  'row-house': 'Row House',
};

export const STATUS_LABELS: Record<string, string> = {
  available: 'Available',
  reserved: 'Reserved',
  sold: 'Sold',
};

export function buildWhatsAppLink(number: string, message: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function buildPropertyEnquiryMessage(
  title: string,
  area: string,
): string {
  return `Hi, I'm interested in the ${title} (${area}). I would like to know more about this property.`;
}
