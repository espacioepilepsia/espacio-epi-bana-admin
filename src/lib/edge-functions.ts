/**
 * URLs de las Supabase Edge Functions.
 * Estas reemplazan las API Routes de Next.js en el deploy estático a BanaHosting.
 *
 * Para obtener la URL base de tu proyecto Supabase:
 * → Dashboard → Settings → API → Project URL
 */
const SUPABASE_PROJECT_URL = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const EDGE = `${SUPABASE_PROJECT_URL}/functions/v1`;

export const EDGE_FUNCTIONS = {
  perfit: `${EDGE}/perfit`,
  sendEmail: `${EDGE}/send-email`,
  createComment: `${EDGE}/comments`,
  pendingComments: `${EDGE}/comments-pending`,
} as const;
