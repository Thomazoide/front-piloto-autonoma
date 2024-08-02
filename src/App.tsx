import { Route, Routes } from "react-router-dom";
import IndexPage from "@/pages/index";
import Landing from "@/pages/landing";
import Sedes from "./pages/sedes";
import ManageGuardias from "./pages/guardias";
import { useAuthContext } from "./hooks/useLoginContext";
import Account from "./pages/account";

function App() {
  const {state} = useAuthContext()
  const accountPath: string = `/account/${state.user?.token.split(".")[0]}`
  
  return (
    <Routes>
      <Route element={<Landing />} path="/" />
      <Route element={state.user ? <IndexPage /> : <Landing/>} path={"/home"} />
      <Route element={state.user ? <Sedes /> : <Landing/>} path="/sedes" />
      <Route element={state.user ? <ManageGuardias /> : <Landing/>} path="/guardias" />
      <Route element={state.user ? <Account/> : <Landing/>} path={accountPath}/>
    </Routes>
  );
}

export default App;
