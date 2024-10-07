import { Route, Routes } from "react-router-dom";
import IndexPage from "@/pages/index";
import Landing from "@/pages/landing";
import Sedes from "./pages/sedes";
import ManageGuardias from "./pages/guardias";
import { useAuthContext } from "./hooks/useLoginContext";
import Account from "./pages/account";
import Docentes from "./pages/docentes";
import Users from "./pages/users";
import Dashboard from "./components/charts/dashboardCharts";

function App() {
  const {state} = useAuthContext()
  const accountPath: string = `/account/${state.user?.token.split(".")[0]}`
  const usersPath: string = `/users/${state.user?.token.split('.')[0]}`
  const dashboradPath: string = `/dashboard/${state.user?.token.split('.')[0]}`
  const sedesPath: string = `/sedes/${state.user?.token.split('.')[0]}`
  const docentesPath: string = `/docentes/${state.user?.token.split('.')[0]}`
  const guardiasPath: string = `/guardias/${state.user?.token.split('.')[0]}`
  
  return (
    <Routes>
      <Route element={<Landing />} path="/" />
      <Route element={state.user ? <IndexPage /> : <Landing/>} path={dashboradPath} />
      <Route element={state.user ? <Sedes /> : <Landing/>} path={sedesPath} />
      <Route element={state.user ? <ManageGuardias /> : <Landing/>} path={guardiasPath} />
      <Route element={state.user ? <Docentes/> : <Landing/>} path={docentesPath} />
      <Route element={state.user ? <Account/> : <Landing/>} path={accountPath}/>
      <Route element={state.user ? <Users/> : <Landing/>} path={usersPath}/>
      <Route element={<Dashboard/>} path="dash"/>
    </Routes>
  );
}

export default App;
