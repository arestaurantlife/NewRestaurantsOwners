/** Reads the server's own refusal message from a failed function call, so people see the real reason. */
export async function functionErrorMessage(error: unknown, fallback: string): Promise<string> {
  try {
    const body = await (error as { context?: Response })?.context?.clone().json();
    if (body && typeof body.error === "string" && body.error) return body.error;
  } catch { /* not JSON */ }
  return fallback;
}
