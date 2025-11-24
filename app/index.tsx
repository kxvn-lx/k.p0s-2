import Home from "../features/home";
import "../global.css";

// Keep app/ as the router entry — delegate screen implementation to a feature.
export default function Index() {
  return <Home />;
}
