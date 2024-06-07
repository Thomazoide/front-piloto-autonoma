import DefaultLayout from "@/layouts/default"
import DataSelector from "@/components/dataSelector";

export default function IndexPage() {
  return (
    <DefaultLayout>
      <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
        <DataSelector/>
      </section>
    </DefaultLayout>
  );
}
