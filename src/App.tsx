import { Route, Routes } from "react-router-dom";
import IndexPage from "@/pages/index";
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
    </Routes>
  );
}

export default App;
