import { Navigate, Route, Routes } from "react-router-dom";
import InstitutionalHomePage from "./pages/InstitutionalHomePage";
import LinkBioPage from "./pages/LinkBioPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<InstitutionalHomePage />} />
      <Route path="/link-bio" element={<LinkBioPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
