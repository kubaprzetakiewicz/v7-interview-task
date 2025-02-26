import { BrowserRouter, Route, Routes } from 'react-router'
import './assets/main.css'
import { CommandMenu } from './components/CommandMenu'
import { EntityView } from './components/EntityView'
import { FallbackPage } from './components/FallbackPage'
import { ProjectTable } from './components/ProjectTable'
import { TestButton } from './components/TestButton'
import { ProjectProvider } from './contexts/Project/ProjectProvider'

function App() {
  console.log(import.meta.env)

  return (
    <>
      <CommandMenu
        commands={[
          {
            id: '1',
            name: 'Add a property',
            action: () => alert('yay'),
          },
          {
            id: '2',
            name: 'Action #2',
            action: () => alert('wahoo'),
          },
        ]}
      />
      <BrowserRouter>
        <Routes>
          <Route path="/:workspaceId/projects/:projectId">
            {/* Table view (index route) */}
            <Route
              index
              element={
                <ProjectProvider>
                  <TestButton />
                  <ProjectTable />
                </ProjectProvider>
              }
            />

            {/* Entity view */}
            <Route
              path="entities/:entityId"
              element={
                <ProjectProvider>
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
