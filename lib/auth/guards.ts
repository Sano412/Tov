import "server-only";

export type MockBusinessOwner = {
  id: string;
  name: string;
  businessSlug: string;
};

export async function requireBusinessOwner(): Promise<MockBusinessOwner> {
  return {
    id: "mock-owner-amber",
    name: "Mock Business Owner",
    businessSlug: "amber-karaoke",
  };
}
