import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const studyLevels = new Set([
  "Secondary school",
  "Certificate or diploma",
  "Undergraduate",
  "Postgraduate",
]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readText(
  body: Record<string, unknown>,
  field: string,
  maxLength: number,
): string | null {
  const value = body[field];
  if (typeof value !== "string") return null;

  const normalized = value.trim();
  return normalized.length > 0 && normalized.length <= maxLength
    ? normalized
    : null;
}

function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("Please submit a valid application form.", 400);
  }

  if (!isRecord(body)) {
    return jsonError("Please submit a valid application form.", 400);
  }

  const scholarshipSlug = readText(body, "scholarshipSlug", 80);
  const fullName = readText(body, "fullName", 120);
  const email = readText(body, "email", 254)?.toLowerCase();
  const phone = readText(body, "phone", 32);
  const country = readText(body, "country", 80);
  const institution = readText(body, "institution", 160);
  const studyLevel = readText(body, "studyLevel", 40);
  const course = readText(body, "course", 120);
  const personalStatement = readText(body, "personalStatement", 1200);

  if (
    !scholarshipSlug ||
    !fullName ||
    !email ||
    !phone ||
    !country ||
    !institution ||
    !studyLevel ||
    !course ||
    !personalStatement ||
    !emailPattern.test(email) ||
    !studyLevels.has(studyLevel) ||
    personalStatement.length < 40 ||
    body.consent !== true
  ) {
    return jsonError(
      "Please check that all required fields are valid and confirm the consent box.",
      400,
    );
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error("Scholarship applications cannot be accepted: Supabase configuration is missing.");
    return jsonError(
      "Applications are temporarily unavailable. Please try again later.",
      503,
    );
  }

  let supabase: ReturnType<typeof createClient<Database>>;
  try {
    const parsedUrl = new URL(supabaseUrl);
    if (parsedUrl.protocol !== "https:" && parsedUrl.hostname !== "localhost") {
      return jsonError("The Supabase server URL is not configured correctly.", 503);
    }
    supabase = createClient<Database>(supabaseUrl, supabaseKey);
  } catch (error) {
    console.error("Scholarship applications cannot be accepted: Supabase configuration is invalid.", error);
    return jsonError(
      "Applications are temporarily unavailable. Please try again later.",
      503,
    );
  }

  const { error } = await supabase.from("scholarship_applications").insert({
    scholarship_slug: scholarshipSlug,
    full_name: fullName,
    email,
    phone,
    country,
    institution,
    study_level: studyLevel,
    course,
    personal_statement: personalStatement,
  });

  if (error) {
    console.error("Supabase rejected a scholarship application:", error.message, error.code);

    if (error.code === "42P01" || error.code === "PGRST205") {
      return jsonError(
        "The application database is not set up yet. Run supabase/schema.sql in your Supabase SQL Editor.",
        503,
      );
    }

    if (error.code === "23503") {
      return jsonError(
        "This example scholarship is missing from the database. Re-run the opportunity setup in supabase/schema.sql.",
        400,
      );
    }

    if (error.code === "42501") {
      return jsonError(
        "Supabase denied this submission. Check the INSERT permission and row-level security policy in supabase/schema.sql.",
        503,
      );
    }

    return jsonError(
      "We couldn't save your application. Please try again later.",
      500,
    );
  }

  return Response.json({ success: true }, { status: 201 });
}
