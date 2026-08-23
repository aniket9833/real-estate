import { connectDB } from '@/lib/db';
import { Enquiry } from '@/models/Enquiry';
import { Property } from '@/models/Property';
import { z } from 'zod';

export const enquiryInputSchema = z.object({
  name: z.string().min(2, 'Please enter your name').max(100),
  phone: z
    .string()
    .min(10, 'Please enter a valid phone number')
    .max(15)
    .regex(/^[0-9+\-\s]+$/, 'Please enter a valid phone number'),
  email: z.string().email().optional().or(z.literal('')),
  message: z.string().max(2000).optional(),
  source: z.enum([
    'contact-form',
    'property-enquiry',
    'site-visit-request',
    'whatsapp-click',
    'call-click',
  ]),
  propertyId: z.string().optional(),
  preferredVisitDate: z.string().optional(), // ISO date string from a <input type="date">
});

export type EnquiryInput = z.infer<typeof enquiryInputSchema>;

export async function submitEnquiry(input: EnquiryInput) {
  await connectDB();
  const data = enquiryInputSchema.parse(input);

  let propertyTitleSnapshot: string | undefined;
  if (data.propertyId) {
    const property = (await Property.findById(data.propertyId)
      .select('title')
      .lean()) as unknown as { title?: string } | null;
    propertyTitleSnapshot = property?.title;
  }

  const enquiry = await Enquiry.create({
    name: data.name,
    phone: data.phone,
    email: data.email || undefined,
    message: data.message,
    source: data.source,
    property: data.propertyId || undefined,
    propertyTitleSnapshot,
    preferredVisitDate: data.preferredVisitDate
      ? new Date(data.preferredVisitDate)
      : undefined,
  });

  return enquiry.toObject();
}

export interface EnquiryListFilters {
  status?: string;
  page?: number;
  pageSize?: number;
}

export async function listEnquiries(filters: EnquiryListFilters = {}) {
  await connectDB();
  const { status, page = 1, pageSize = 20 } = filters;
  const query: Record<string, unknown> = {};
  if (status) query.status = status;

  const skip = (page - 1) * pageSize;
  const [items, total] = await Promise.all([
    Enquiry.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .populate('property', 'title slug')
      .lean(),
    Enquiry.countDocuments(query),
  ]);

  return {
    items,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize),
  };
}

export async function updateEnquiryStatus(id: string, status: string) {
  await connectDB();
  const enquiry = await Enquiry.findByIdAndUpdate(
    id,
    { status },
    { new: true },
  );
  if (!enquiry) throw new Error('Enquiry not found');
  return enquiry.toObject();
}

export async function markEnquiryRead(id: string) {
  await connectDB();
  await Enquiry.findByIdAndUpdate(id, { isRead: true });
}

export async function addAdminNote(id: string, note: string) {
  await connectDB();
  const enquiry = await Enquiry.findByIdAndUpdate(
    id,
    { adminNotes: note },
    { new: true },
  );
  if (!enquiry) throw new Error('Enquiry not found');
  return enquiry.toObject();
}

export async function getNewEnquiryCount() {
  await connectDB();
  return Enquiry.countDocuments({ status: 'new' });
}
