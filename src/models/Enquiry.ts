import { Schema, models, model, InferSchemaType } from 'mongoose';

export const ENQUIRY_STATUS = [
  'new',
  'contacted',
  'site-visit-scheduled',
  'closed',
  'not-interested',
] as const;
export const ENQUIRY_SOURCE = [
  'contact-form',
  'property-enquiry',
  'site-visit-request',
  'whatsapp-click',
  'call-click',
] as const;

const EnquirySchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    phone: { type: String, required: true, trim: true, maxlength: 20 },
    email: { type: String, trim: true, maxlength: 150 },
    message: { type: String, maxlength: 2000 },

    source: {
      type: String,
      enum: ENQUIRY_SOURCE,
      required: true,
      default: 'contact-form',
    },
    status: { type: String, enum: ENQUIRY_STATUS, default: 'new', index: true },

    property: { type: Schema.Types.ObjectId, ref: 'Property' },
    propertyTitleSnapshot: { type: String }, // preserved even if property later deleted

    preferredVisitDate: { type: Date },

    isRead: { type: Boolean, default: false },
    adminNotes: { type: String, maxlength: 2000 },
  },
  { timestamps: true },
);

export type EnquiryDoc = InferSchemaType<typeof EnquirySchema>;

export const Enquiry = models.Enquiry || model('Enquiry', EnquirySchema);
