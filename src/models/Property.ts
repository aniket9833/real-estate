import mongoose, { Schema, models, model, InferSchemaType } from 'mongoose';

export const PROPERTY_TYPES = [
  'residential-plot',
  'agricultural-land',
  'commercial-plot',
  'house',
  'flat',
  'row-house',
] as const;

export const PROPERTY_STATUS = ['available', 'reserved', 'sold'] as const;

const ImageSchema = new Schema(
  {
    path: { type: String, required: true }, // storage path: property-images/{propertyId}/xxx.webp
    url: { type: String, required: true }, // public URL cached at write-time
    order: { type: Number, required: true, default: 0 },
    isPrimary: { type: Boolean, default: false },
    width: Number,
    height: Number,
  },
  { _id: false },
);

const PropertySchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 140 },
    slug: { type: String, required: true, unique: true, index: true },
    type: { type: String, enum: PROPERTY_TYPES, required: true },
    status: {
      type: String,
      enum: PROPERTY_STATUS,
      default: 'available',
      index: true,
    },

    description: { type: String, required: true, maxlength: 4000 },

    // Location
    location: {
      area: { type: String, required: true }, // e.g. "Malkapur, Akola"
      city: { type: String, default: 'Akola' },
      district: { type: String, default: 'Akola' },
      state: { type: String, default: 'Maharashtra' },
      landmark: { type: String },
      mapLink: { type: String }, // Google Maps URL, optional
    },

    // Size & price
    areaValue: { type: Number, required: true, min: 0 },
    areaUnit: {
      type: String,
      enum: ['sqft', 'acre', 'gunta', 'hectare'],
      default: 'sqft',
    },
    price: { type: Number, required: true, min: 0 }, // in INR
    priceLabel: { type: String }, // optional override e.g. "On Request"
    pricePerUnit: { type: Number },

    features: [{ type: String, trim: true }], // e.g. "Corner Plot", "Road Facing", "Gated Layout"

    documentation: {
      verified: { type: Boolean, default: false },
      titleType: { type: String }, // e.g. "7/12 Extract Clear", "NA Plot"
      notes: { type: String, maxlength: 1000 },
    },

    images: [ImageSchema],

    isFeatured: { type: Boolean, default: false, index: true },
    isPublished: { type: Boolean, default: false, index: true },

    // Denormalized counters, updated by service layer
    viewCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

PropertySchema.index({
  title: 'text',
  'location.area': 'text',
  description: 'text',
});

export type PropertyDoc = InferSchemaType<typeof PropertySchema>;

export const Property = models.Property || model('Property', PropertySchema);
