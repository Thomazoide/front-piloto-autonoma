import { Link } from "@nextui-org/link";
import NavBar from '../components/upper/navbar'
import { ReactElement } from "react";

export default function DefaultLayout({children, llave}: Readonly<{
  children: React.ReactNode;
  llave: "1" | "2" | "3" | "4" | "5"
}>): ReactElement {
  return (
    <div className="relative flex flex-col h-screen">
      <NavBar llaveActiva={llave}/>
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-16">
        {children}
      </main>
      <footer className="w-full flex items-center justify-center py-3">
        <Link
          isExternal
          className="flex items-center gap-1 text-current"
          href="https://econnection.cl/"
          title=""
        >
          <span className="text-default-600">Todos los derechos reservados</span>
          <p className="text-primary">eConnection</p>
        </Link>
      </footer>
    </div>
  );
}
