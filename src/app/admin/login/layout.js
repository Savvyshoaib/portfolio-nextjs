import { ToastProvider } from "@/components/ui/toast";

export default function AdminLoginLayout({ children }) {
  return <ToastProvider>{children}</ToastProvider>;
}
