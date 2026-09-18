import { Navigate, Route, Routes } from "react-router-dom";
import Landing from "./pages/Landing";
import DocumentPage from "./pages/DocumentPage";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/hujjat" element={<DocumentPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
