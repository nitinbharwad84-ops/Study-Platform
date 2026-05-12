import { redirect } from "next/navigation";

// Root page redirects to student dashboard (or login when auth is implemented)
export default function RootPage() {
  redirect("/dashboard");
}
