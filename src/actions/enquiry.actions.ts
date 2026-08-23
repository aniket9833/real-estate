'use server';

import { revalidatePath } from 'next/cache';
import {
  submitEnquiry,
  enquiryInputSchema,
  updateEnquiryStatus,
  addAdminNote,
} from '@/services/enquiry.service';
import { getCurrentAdmin } from '@/lib/session';

export interface EnquiryFormState {
  error?: string;
  fieldErrors?: Record<string, string>;
  success?: boolean;
}

export async function submitEnquiryAction(
  _prevState: EnquiryFormState,
  formData: FormData,
): Promise<EnquiryFormState> {
  const raw = {
    name: String(formData.get('name') || ''),
    phone: String(formData.get('phone') || ''),
    email: String(formData.get('email') || ''),
    message: String(formData.get('message') || ''),
    source: String(formData.get('source') || 'contact-form'),
    propertyId: formData.get('propertyId')
      ? String(formData.get('propertyId'))
      : undefined,
    preferredVisitDate: formData.get('preferredVisitDate')
      ? String(formData.get('preferredVisitDate'))
      : undefined,
  };

  const parsed = enquiryInputSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues)
      fieldErrors[issue.path[0] as string] = issue.message;
    return { error: 'Please check the highlighted fields.', fieldErrors };
  }

  try {
    await submitEnquiry(parsed.data);
    return { success: true };
  } catch (err) {
    console.error('Enquiry submit error:', err);
    return {
      error:
        "We couldn't submit your enquiry right now. Please try WhatsApp or call us directly.",
    };
  }
}

export async function updateEnquiryStatusAction(id: string, status: string) {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error('Unauthorized');
  await updateEnquiryStatus(id, status);
  revalidatePath('/admin/enquiries');
}

export async function addEnquiryNoteAction(id: string, note: string) {
  const admin = await getCurrentAdmin();
  if (!admin) throw new Error('Unauthorized');
  await addAdminNote(id, note);
  revalidatePath('/admin/enquiries');
}
