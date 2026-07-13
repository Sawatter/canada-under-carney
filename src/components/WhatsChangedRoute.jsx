import { useLayoutEffect } from "react";
import changelog from "../data/changelog.json";
import WhatsChanged from "./WhatsChanged";

export default function WhatsChangedRoute({ onReady }) {
  useLayoutEffect(() => {
    onReady();
  }, [onReady]);

  return <WhatsChanged changelog={changelog} />;
}
