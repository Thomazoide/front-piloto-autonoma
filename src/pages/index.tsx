import DefaultLayout from "@/layouts/default"
import DashBoard from "@/components/dashboard"
import { useAuthContext } from "@/hooks/useLoginContext";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function IndexPage() {
  

  return (
    <DefaultLayout llave="1">
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <DashBoard/>
      </section>
    </DefaultLayout>
  );
}
