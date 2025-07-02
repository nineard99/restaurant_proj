import { Toaster } from "react-hot-toast";

export default function OrderLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <main>{children}</main>
    </div>
  );
}
