import { Schema, model } from 'mongoose';
import { ILocation } from '../types/type';

const locationSchema = new Schema<ILocation>(
  {
    name: {
      type: String,
      required: true,
      maxLength: 100,
      unique: true
    },
    addressLine1: {
      type: String,
      required: true,
      maxLength: 255
    },
    addressLine2: {
      type: String,
      maxLength: 255,
      require: false
    },
    city: {
      type: String,
      required: true,
      maxLength: 100
    },
    state: {
      type: String,
      maxLength: 100,
      require: false
    },
    postalCode: {
      type: String,
      required: true,
      maxLength: 20
    },
    country: {
      type: String,
      required: true,
      maxLength: 100
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true, // Tự động thêm createdAt và updatedAt
    versionKey: false
  }
);

export default model<ILocation>('locations', locationSchema);
