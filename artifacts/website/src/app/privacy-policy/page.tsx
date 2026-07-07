import { redirect } from "next/navigation";

/**
 * /privacy-policy → permanently redirected to /privacy
 * The canonical privacy page lives at /privacy with a full TOC sidebar.
 */
export default function PrivacyPolicyRedirect() {
  redirect("/privacy");
}
