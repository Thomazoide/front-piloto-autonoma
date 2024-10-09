import { Route, Routes } from "react-router-dom";
import IndexPage from "@/pages/index";
import Landing from "@/pages/landing";
import Sedes from "./pages/sedes";
import ManageGuardias from "./pages/guardias";
import { useAuthContext } from "./hooks/useLoginContext";
import Account from "./pages/account";
import Docentes from "./pages/docentes";
import Users from "./pages/users";
import NotFoundPage from "./pages/notFound";

function App() {
  const {state} = useAuthContext()
  const accountPath: string = `/account/${state.user?.token.split(".")[0]}`
  const usersPath: string = `/users/${state.user?.token.split('.')[0]}`
  const dashboradPath: string = `/dashboard`
  const sedesPath: string = `/sedes`
  const docentesPath: string = `/docentes`
  const guardiasPath: string = `/guardias`

  return (
    <Routes>
      <Route element={<Landing />} path="/" />
      <Route element={state.user && <IndexPage />} path={dashboradPath} />
      <Route element={state.user && <Sedes />} path={sedesPath} />
      <Route element={state.user && <ManageGuardias />} path={guardiasPath} />
      <Route element={state.user && <Docentes/>} path={docentesPath} />
      <Route element={state.user && <Account/>} path={accountPath}/>
      <Route element={state.user && <Users/>} path={usersPath}/>
      <Route element={<NotFoundPage/>} path="*"/>
    </Routes>
  );
}

export default App;
