import { Route, Routes } from "react-router-dom";
import IndexPage from "@/pages/index";
import AboutPage from "@/pages/about";
import Landing from "@/pages/landing";
import Sedes from "./pages/sedes";
import ManageGuardias from "./pages/guardias";

function App() {
  return (
    <Routes>
      <Route element={<Landing />} path="/" />
      <Route element={<IndexPage />} path="/home" />
      <Route element={<Sedes />} path="/sedes" />
      <Route element={<ManageGuardias />} path="/guardias" />
      <Route element={<AboutPage />} path="/about" />
    </Routes>
  );
}

export default App;
