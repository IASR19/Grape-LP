import { Navigate, Route, Routes } from "react-router-dom";
import LinkBioPage from "./pages/LinkBioPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LinkBioPage />} />
      <Route path="/link-bio" element={<LinkBioPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
