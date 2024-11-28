import { Link } from "@nextui-org/link";
import NavBar from '../components/upper/navbar'
import { ReactElement } from "react";

export default function DefaultLayout({children, llave}: Readonly<{
  children: React.ReactNode;
  llave: "1" | "2" | "3" | "4" | "5"
}>): ReactElement {
  const bgUrl = "https://storagejca.s3.sa-east-1.amazonaws.com/Nuestra-vision-scaled.webp"
  return (
    <div style={{
      backgroundImage: `url(${bgUrl})`,
      backgroundSize: 'cover',
      backgroundAttachment: 'fixed',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundOrigin: 'padding-box',
      WebkitBackgroundClip: 'padding-box',
      MozBackgroundClip: 'padding-box',
      backgroundClip: 'padding-box'
    }} className="relative flex flex-col min-h-[100dvh] ">
      <NavBar llaveActiva={llave}/>
      <main className="container mx-auto max-w-7xl px-6 flex-grow pt-10">
        {children}
      </main>
      <footer className="w-full flex items-center justify-center py-3">
        <Link
          isExternal
          className="flex items-center gap-1 text-current"
          href="https://econnection.cl/"
          title=""
        >
          <span className="text-warning-500">Todos los derechos reservados</span>
          <p className="text-primary">E-connection</p>
        </Link>
      </footer>
    </div>
  );
}
