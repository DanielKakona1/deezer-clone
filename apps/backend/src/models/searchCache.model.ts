import { Schema, model } from 'mongoose';

export type SearchCacheDocument = {
  query: string;
  limit: number;
  index: number;
  response: unknown;
  fetchedAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

const searchCacheSchema = new Schema<SearchCacheDocument>(
  {
    query: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    limit: {
      type: Number,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
    response: {
      type: Schema.Types.Mixed,
      required: true,
    },
    fetchedAt: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

searchCacheSchema.index({ query: 1, limit: 1, index: 1 }, { unique: true });

export const SearchCacheModel = model<SearchCacheDocument>(
  'SearchCache',
  searchCacheSchema,
);
