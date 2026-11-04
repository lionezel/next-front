import { redirect } from "next/navigation";

export default function FitPage() {
  redirect("/?vertical=fit");
}
