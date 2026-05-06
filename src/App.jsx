import { useState, useCallback } from "react";
import Navbar from "./components/Navbar";
import AppRoutes from "./routes/AppRoutes";
import { BadgeProvider } from "./components/BadgeContext";
import { ProgressProvider } from "./components/ProgressContext";
import DemoWalkthrough from "./components/DemoWalkthrough";
import FloatingAssistant from "./components/FloatingAssistant";
import CrashCourse from "./components/CrashCourse";
import FindMyBooth from "./components/FindMyBooth";

function App() {
  const [demoActive, setDemoActive] = useState(false);
  const [crashActive, setCrashActive] = useState(false);
  const [boothOpen, setBoothOpen] = useState(false);

  const startDemo = useCallback(() => setDemoActive(true), []);
  const endDemo = useCallback(() => setDemoActive(false), []);
  const startCrash = useCallback(() => setCrashActive(true), []);
  const endCrash = useCallback(() => setCrashActive(false), []);

  return (
    <ProgressProvider>
      <BadgeProvider>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <AppRoutes
              onStartDemo={startDemo}
              onCrashCourse={startCrash}
              onFindBooth={() => setBoothOpen(true)}
            />
          </main>
          <DemoWalkthrough active={demoActive} onEnd={endDemo} />
          <CrashCourse active={crashActive} onEnd={endCrash} />
          <FindMyBooth open={boothOpen} onClose={() => setBoothOpen(false)} />
          <FloatingAssistant />
        </div>
      </BadgeProvider>
    </ProgressProvider>
  );
}

export default App;
