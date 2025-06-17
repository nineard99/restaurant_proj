import { Toaster } from "react-hot-toast";

export default function OrderLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Toaster />
      <main>{children}</main>
    </div>
  );
}
