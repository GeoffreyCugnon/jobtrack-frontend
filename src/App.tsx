import { RouterProvider, Routes } from "react-router";
import { router } from "./routes";
import CvCard from "./components/Document/CvCards/CvCard";
import LettreCard from "./components/Document/LettreCards/Lettre";
import { Route } from "lucide-react";

export default function App() {
  return (
  <>
  <RouterProvider router={router} />;
  <Routes>
        <Route path="/CvCard" element={<CvCard/>}/>
        <Route path="/LettreCard" element={<LettreCard/>}/>
      
  </Routes>
     </>
     )
}