import DefaultLayout from "@/layouts/default";
import NewDashboard from "@/components/newDashboard";

export default function IndexPage() {
  

  return (
    <DefaultLayout llave="1">
      <div className="flex w-full justify-center ">
        <h1 className="text-red-500 sombra-texto heavitas-text p-[15px] rounded-lg border-2 border-solid border-red-500">Dashboard</h1>
      </div>
      <section className="flex flex-col items-center justify-center gap-4 py-3">
        <NewDashboard/>
      </section>
    </DefaultLayout>
  );
}
