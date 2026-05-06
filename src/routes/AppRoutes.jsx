import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Explore from "../pages/Explore";
import Simulation from "../pages/Simulation";
import Timeline from "../pages/Timeline";
import MythFact from "../pages/MythFact";
import AIAssistant from "../pages/AIAssistant";

function AppRoutes({ onStartDemo, onCrashCourse, onFindBooth }) {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Home
            onStartDemo={onStartDemo}
            onCrashCourse={onCrashCourse}
            onFindBooth={onFindBooth}
          />
        }
      />
      <Route path="/explore" element={<Explore />} />
      <Route path="/simulation" element={<Simulation />} />
      <Route path="/timeline" element={<Timeline />} />
      <Route path="/myths" element={<MythFact />} />
      <Route path="/ai-assistant" element={<AIAssistant />} />
    </Routes>
  );
}

export default AppRoutes;
