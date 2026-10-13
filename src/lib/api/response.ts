import { NextResponse } from "next/server";

type JsonValue = Record<string, unknown> | unknown[] | string | number | boolean | null;

export function success<T extends JsonValue>(
  data: T,
  status = 200,
  message?: string
) {
  return NextResponse.json(
    message ? { message, data } : { data },
    { status }
  );
}

export function error(
  message: string,
  status = 500,
  issues?: unknown
) {
  return NextResponse.json(
    issues ? { message, issues } : { message },
    { status }
  );
}

export function validationError(issues: unknown) {
  return error("Validation error", 400, issues);
}

export function unauthorized() {
  return error("Unauthorized", 401);
}

export function forbidden() {
  return error("Forbidden", 403);
}

export function notFound(message = "Not found") {
  return error(message, 404);
}

export function internalError(message = "Internal server error") {
  return error(message, 500);
}