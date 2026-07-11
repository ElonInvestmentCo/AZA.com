import { redirect } from "next/navigation";

// Google Cloud OAuth branding points to /privacy — redirect to the actual page.
export default function PrivacyRedirect() {
  redirect("/privacy-policy");
}
