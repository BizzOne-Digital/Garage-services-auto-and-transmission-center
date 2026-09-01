import mongoose from 'mongoose';
import { env } from './env.ts';

let connectionPromise: Promise<typeof mongoose> | null = null;

mongoose.set('strictQuery', true);

/**
 * Connects once and reuses the connection for the lifetime of the process.
 * Rejects loudly so the caller can turn it into a 503 instead of hanging.
 */
export const connectToDatabase = async (): Promise<typeof mongoose> => {
  if (mongoose.connection.readyState === 1) return mongoose;
  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(env.mongodbUri, {
        dbName: env.mongodbDbName || undefined,
        serverSelectionTimeoutMS: 10_000,
        maxPoolSize: 10,
      })
      .catch(error => {
        // Allow a later request to retry instead of caching the failure forever.
        connectionPromise = null;
        throw error;
      });
  }
  return connectionPromise;
};

export const isDatabaseReady = (): boolean => mongoose.connection.readyState === 1;

export const disconnectFromDatabase = async (): Promise<void> => {
  connectionPromise = null;
  await mongoose.disconnect();
};
