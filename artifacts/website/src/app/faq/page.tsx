import type { Metadata } from "next";
import { FAQClient } from "./FAQClient";

export const metadata: Metadata = {
  title: "FAQ – PayVora",
  description:
    "Frequently asked questions about PayVora — gift cards, virtual cards, bill payments, security, and more.",
};

export default function FAQPage() {
  return <FAQClient />;
}
