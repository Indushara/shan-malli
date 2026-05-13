export type PublicUser = {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt?: string;
  updatedAt?: string;
};

export function toPublicUser(doc: {
  _id: { toString(): string };
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt?: Date;
  updatedAt?: Date;
}): PublicUser {
  return {
    id: String(doc._id),
    name: doc.name,
    email: doc.email,
    role: doc.role,
    ...(doc.createdAt && { createdAt: doc.createdAt.toISOString() }),
    ...(doc.updatedAt && { updatedAt: doc.updatedAt.toISOString() }),
  };
}
