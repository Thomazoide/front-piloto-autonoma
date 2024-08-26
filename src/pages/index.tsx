import DefaultLayout from "@/layouts/default";
import NewDashboard from "@/components/newDashboard";

export default function IndexPage() {
  

  return (
    <DefaultLayout llave="1">
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <NewDashboard/>
      </section>
    </DefaultLayout>
  );
}
