import { StrictMode } from "react"
import ReactDOM from "react-dom/client"
import { AppProviders } from "./app/provider"

import "@/shared/styles/index.css"

const rootElement = document.getElementById("root")!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <AppProviders />
    </StrictMode>,
  )
}
