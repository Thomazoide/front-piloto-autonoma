import DefaultLayout from "@/layouts/default"
import DashBoard from "@/components/dashboard"

export default function IndexPage() {
  

  return (
    <DefaultLayout llave="1">
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <DashBoard/>
      </section>
    </DefaultLayout>
  );
}
