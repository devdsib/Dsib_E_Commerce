import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | DSIB Tech",
  description: "Sign in to your DSIB Tech account to track orders, manage wishlist, and access exclusive deals on electronics components.",
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
