import Login from "../features/login"
import "../global.css"

// Keep app/ as the router entry — delegate screen implementation to a feature.
export default function Index() {
  return <Login />
}
