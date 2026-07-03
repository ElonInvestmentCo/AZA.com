import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { SubPage } from "./pages/SubPage";
import { NotFound } from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-up" element={<Navigate to="/" replace />} />
        <Route path="/register" element={<Navigate to="/" replace />} />
        <Route path="/login" element={<Navigate to="/" replace />} />
        <Route
          path="/gift-cards"
          element={
            <SubPage
              title="Gift Card Trading"
              description="Trade Amazon, iTunes, Google Play, Steam and 50+ gift card brands for instant Naira. Best rates, 60-second settlement."
              accent="#00D9A0"
            />
          }
        />
        <Route
          path="/virtual-cards"
          element={
            <SubPage
              title="Virtual Dollar Cards"
              description="Get a free USD virtual card for international payments, subscriptions, and online shopping — powered directly from your wallet."
              accent="#00b8ff"
            />
          }
        />
        <Route
          path="/bill-payments"
          element={
            <SubPage
              title="Bill Payments"
              description="Pay electricity, cable TV, internet, betting platforms, and more directly from your wallet in seconds."
              accent="#F59E0B"
            />
          }
        />
        <Route
          path="/airtime-data"
          element={
            <SubPage
              title="Airtime & Data"
              description="Recharge MTN, Airtel, Glo, and 9mobile with the best rates and instant delivery. Never run out of credit again."
              accent="#00D9A0"
            />
          }
        />
        <Route
          path="/features"
          element={
            <SubPage
              title="All Features"
              description="Everything you need to manage your digital finances — gift cards, virtual cards, bills, airtime, and more."
              accent="#00D9A0"
            />
          }
        />
        <Route
          path="/security"
          element={
            <SubPage
              title="Security"
              description="Bank-grade 256-bit encryption, 2FA, and continuous fraud monitoring protect your funds and data 24/7."
              accent="#00D9A0"
            />
          }
        />
        <Route
          path="/download"
          element={
            <SubPage
              title="Download PayVora"
              description="Join 50,000+ Nigerians managing their money smarter with PayVora. Available on iOS and Android."
              accent="#00D9A0"
            />
          }
        />
        <Route
          path="/faq"
          element={
            <SubPage
              title="Frequently Asked Questions"
              description="Got questions? We've got answers."
              accent="#00D9A0"
            />
          }
        />
        <Route
          path="/contact"
          element={
            <SubPage
              title="Contact Us"
              description="Have a question or need support? Our team is here to help."
              accent="#00D9A0"
            />
          }
        />
        <Route
          path="/privacy-policy"
          element={
            <SubPage
              title="Privacy Policy"
              description="How we collect, use, and protect your personal information."
              accent="#8F8FA3"
            />
          }
        />
        <Route
          path="/terms"
          element={
            <SubPage
              title="Terms of Service"
              description="Terms and conditions for using the PayVora platform."
              accent="#8F8FA3"
            />
          }
        />
        <Route
          path="/aml-kyc"
          element={
            <SubPage
              title="AML / KYC Policy"
              description="Our Anti-Money Laundering and Know Your Customer compliance policies."
              accent="#8F8FA3"
            />
          }
        />
        <Route
          path="/refund-policy"
          element={
            <SubPage
              title="Refund Policy"
              description="Our policy for refunds and transaction disputes."
              accent="#8F8FA3"
            />
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
