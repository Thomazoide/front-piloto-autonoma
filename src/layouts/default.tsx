import { Link } from "@nextui-org/link";
import NavBar from '../components/upper/navbar'
import { ReactElement } from "react";

export default function DefaultLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): ReactElement {
  return (
    <div className="relative flex flex-col h-screen">
      <NavBar/>
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-16">
        {children}
      </main>
      <footer className="w-full flex items-center justify-center py-3">
        <Link
          isExternal
          className="flex items-center gap-1 text-current"
          href="#"
          title=""
        >
          <span className="text-default-600">Pie de pagina</span>
          <p className="text-primary">n. Empresa</p>
        </Link>
      </footer>
    </div>
  );
}
