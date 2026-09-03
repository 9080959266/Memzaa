import mongoose, { Document, Schema, Types } from 'mongoose';

export interface IInventory extends Document {
  productId: Types.ObjectId;
  sku: string;
  quantity: number;
  reserved: number;
  lowStockThreshold: number;
  restockDate?: Date;
  supplier?: string;
  costPrice?: number;
  createdAt: Date;
  updatedAt: Date;
}

const InventorySchema = new Schema<IInventory>(
  {
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true, unique: true, index: true },
    sku: { type: String, required: true, unique: true, uppercase: true },
    quantity: { type: Number, required: true, min: 0, default: 50 },
    reserved: { type: Number, default: 0, min: 0 },
    lowStockThreshold: { type: Number, default: 10, min: 1 },
    restockDate: { type: Date },
    supplier: { type: String },
    costPrice: { type: Number }
  },
  { timestamps: true }
);

export const Inventory = mongoose.model<IInventory>('Inventory', InventorySchema);
