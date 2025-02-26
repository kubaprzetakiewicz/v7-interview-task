import { BrowserRouter, Route, Routes } from 'react-router'
import './assets/main.css'
import { CommandMenu } from './components/CommandMenu'
import { EntityView } from './components/EntityView'
import { FallbackPage } from './components/FallbackPage'
import { ProjectTable } from './components/ProjectTable'
import { ProjectProvider } from './contexts/Project/ProjectProvider'

function App() {
  console.log(import.meta.env)

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/:workspaceId/projects/:projectId">
            {/* Table view (index route) */}
            <Route
              index
              element={
                <ProjectProvider>
                  <CommandMenu />
                  <ProjectTable />
                </ProjectProvider>
              }
            />

            {/* Entity view */}
            <Route
              path="entities/:entityId"
              element={
                <ProjectProvider>
                  <CommandMenu />
                  <EntityView />
                </ProjectProvider>
              }
            />
          </Route>
          {/* Fallback route */}
          <Route path="*" element={<FallbackPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
