import type { Metadata } from "next";
import { FAQClient } from "./FAQClient";

export const metadata: Metadata = {
  title: "FAQ – PAYVORA",
  description:
    "Frequently asked questions about PAYVORA — gift cards, virtual cards, bill payments, security, and more.",
};

export default function FAQPage() {
  return <FAQClient />;
}
