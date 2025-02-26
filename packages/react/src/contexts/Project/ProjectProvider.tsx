import { Entity, getEntities, getProject, Project } from '@v7-product-interview-task/api'
import { postProperty } from '@v7-product-interview-task/api/src/postProperty'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { ProjectContext } from './useProjectContext'

export const ProjectProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [project, setProject] = useState<Project | null>(null)
  const [entities, setEntities] = useState<Entity[]>([])

  const { workspaceId, projectId } = useParams() as { workspaceId: string; projectId: string }

  // this ideally shouldn't be here, but doing it for time's sake & easy access to URI params
  const handleCreateTextProperty = async () => {
    try {
      const apiKey = import.meta.env.VITE_API_KEY

      if (!apiKey) {
        throw new Error('VITE_API_KEY env variable is not set')
      }

      const propertyData = {
        // according to the docs, this is the bare minimum and types are wrong, sadge
        name: 'New Text Property',
        type: 'text',
        description: 'A text property created via API',
        tool: 'gemini_2_0_flash',
        inputs: [], // according to the docs, this field is optional, but 400 is raised if it's skipped - [] is sufficient
      }

      const result = await postProperty({
        apiKey,
        workspaceId,
        projectId,
        // @ts-expect-error types are wrong according to the docs
        propertyData,
      })

      alert(`Property created successfully! ID: ${result.id}`)
    } catch (error) {
      console.error('Failed to create property:', error)
      alert(`Failed to create property: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  useEffect(() => {
    const load = async () => {
      const apiKey = import.meta.env.VITE_API_KEY
      if (!apiKey) {
        throw new Error('VITE_API_KEY env variable is not set')
      }

      try {
        const [projectData, entityData] = await Promise.all([
          getProject({
            apiKey,
            projectId,
            workspaceId,
          }),
          getEntities({
            apiKey,
            projectId,
            workspaceId,
          }),
        ])

        setProject(projectData)
        setEntities(entityData)
      } catch {
        setEntities([])
        setProject(null)
      }
    }
    load()
  }, [projectId, workspaceId])

  const value = {
    project,
    entities,
    workspaceId,
    projectId,
    commands: [
      {
        id: 'create-text-property',
        name: 'Create Text Property',
        action: handleCreateTextProperty,
      },
    ],
  }

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
}
