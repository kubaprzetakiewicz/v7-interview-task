import { Entity, getEntities, getProject, Project } from '@v7-product-interview-task/api'
import { postProperty } from '@v7-product-interview-task/api/src/postProperty'
import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router'
import { ProjectContext } from './useProjectContext'

export const ProjectProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [project, setProject] = useState<Project | null>(null)
  const [entities, setEntities] = useState<Entity[]>([])
  const [refreshCounter, setRefreshCounter] = useState(0)

  const { workspaceId, projectId } = useParams() as { workspaceId: string; projectId: string }

  const loadData = useCallback(async () => {
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
    } catch (error) {
      console.error('Failed to load data:', error)
      setEntities([])
      setProject(null)
    }
  }, [projectId, workspaceId])

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

      await postProperty({
        apiKey,
        workspaceId,
        projectId,
        // @ts-expect-error types are wrong according to the docs
        propertyData,
      })

      setRefreshCounter((prev) => prev + 1)
    } catch (error) {
      console.error('Failed to create property:', error)
    }
  }

  useEffect(() => {
    loadData()
  }, [loadData, refreshCounter])

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
      {
        id: 'create-number-property',
        name: 'Create Number Property',
        action: () => {},
      },
    ],
  }

  return <ProjectContext.Provider value={value}>{children}</ProjectContext.Provider>
}
