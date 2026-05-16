import "server-only";

export type MockBusinessOwner = {
  id: string;
  name: string;
  businessSlug: string;
};

export type MockSuperAdmin = {
  id: string;
  name: string;
  role: "SUPER_ADMIN";
};

export async function requireBusinessOwner(): Promise<MockBusinessOwner> {
  return {
    id: "mock-owner-amber",
    name: "Mock Business Owner",
    businessSlug: "amber-karaoke",
  };
}

export async function requireSuperAdmin(): Promise<MockSuperAdmin> {
  return {
    id: "mock-super-admin",
    name: "Mock Super Admin",
    role: "SUPER_ADMIN",
  };
}
