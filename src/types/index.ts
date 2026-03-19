export type UUID = string;

export interface Event {
  id: UUID;
  created_at?: string;
  updated_at?: string;
  title: string;
  slug?: string;
  description?: string | null;
  event_date: string; // ISO
  location?: string | null;
  cover_image_url?: string | null;
  is_published: boolean;
}

export interface Post {
  id: UUID;
  created_at?: string;
  updated_at?: string;
  title: string;
  slug?: string;
  excerpt?: string | null;
  content?: string | null;
  cover_image_url?: string | null;
  author_name?: string | null;
  is_published: boolean;
  published_at?: string | null;
}

export interface Story {
  id: UUID;
  created_at?: string;
  updated_at?: string;
  title: string;
  content: string;
  author_name?: string | null;
  is_published: boolean;
}

export interface Organization {
  id: UUID;
  created_at?: string;
  updated_at?: string;
  name: string;
  description?: string | null;
  website_url?: string | null;
  logo_url?: string | null;
  city?: string | null;
  province?: string | null;
  is_active: boolean;
}

export interface ContactMessage {
  id: UUID;
  created_at?: string;
  name: string;
  email: string;
  subject?: string | null;
  message: string;
  status?: "new" | "read" | "archived" | string;
}

export interface NewsletterSubscriber {
  id: UUID;
  created_at?: string;
  email: string;
  name?: string | null;
  is_active?: boolean;
  source?: string | null;
}

export interface TeamMember {
  id: UUID;
  created_at?: string;
  updated_at?: string;
  name: string;
  role: string;
  bio?: string | null;
  avatar_url?: string | null;
  order?: number | null;
  is_active?: boolean;
}

