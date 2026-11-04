import { redirect } from "next/navigation";

export default function CreditoRedirectPage() {
  redirect("/portal?tab=credito");
}
