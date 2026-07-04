import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { isHydrated } from "mobx-persist-store";
import Configs from "./components/steps/Configs";
import Landing from "./components/steps/Landing";
import Results from "./components/steps/Results";
import Schedules from "./components/steps/Schedules";
import Systems from "./components/steps/Systems";
import Sidebarlayout from "./components/layouts/SidebarLayout";
import LeftNav from "./components/LeftNavigation";
import { useStores } from "./data";
import {
  getEmbedOptions,
  MSG_READY,
  MSG_GET_PAYLOAD,
  MSG_PAYLOAD,
} from "./utils/embed";
import { getSequenceData } from "./utils/sequence-data";

import "./styles/application.scss";

// Read once at startup: the host page sets these in the iframe URL and
// they do not change for the lifetime of the embed.
const embed = getEmbedOptions();

// Wait for mobx-persist-store to rehydrate configs from localStorage before
// replacing them, otherwise hydration would overwrite the host's selection.
async function seedEmbeddedConfigs(configStore, templateStore, templatePaths) {
  const deadline = Date.now() + 3000;
  while (!isHydrated(configStore) && Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, 50));
  }

  const pairs = templatePaths
    .map((templatePath) => {
      const template = templateStore.getTemplateByPath(templatePath);
      return template
        ? { systemPath: template.systemTypes[0], templatePath }
        : null;
    })
    .filter(Boolean);

  configStore.seedConfigs(pairs);
}

const App = () => {
  const location = useLocation();
  const { configStore, templateStore } = useStores();
  const isFullScreen = embed.embedded || ["/"].includes(location.pathname);

  useEffect(() => {
    if (!embed.embedded) return;

    if (embed.systems.length) {
      seedEmbeddedConfigs(configStore, templateStore, embed.systems);
    }

    const onMessage = (event) => {
      if (event.data?.type === MSG_GET_PAYLOAD && event.source) {
        // A host page served from file:// has the opaque origin "null",
        // which postMessage rejects as a target; fall back to wildcard.
        const targetOrigin =
          event.origin && event.origin !== "null" ? event.origin : "*";
        event.source.postMessage(
          {
            type: MSG_PAYLOAD,
            payload: getSequenceData(configStore.getConfigsForProject()),
          },
          targetOrigin,
        );
      }
    };

    window.addEventListener("message", onMessage);
    window.parent?.postMessage({ type: MSG_READY }, "*");
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <Sidebarlayout
      isFullScreen={isFullScreen}
      contentLeft={<LeftNav />}
      contentRight={
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/systems" element={<Systems />} />
          <Route path="/configs" element={<Configs />} />
          <Route path="/schedules" element={<Schedules />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      }
    />
  );
};

export default App;
