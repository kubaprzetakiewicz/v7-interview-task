import { postProperty } from '@v7-product-interview-task/api/src/postProperty'

import { useProjectContext } from '@/contexts/Project/useProjectContext'

export const TestButton = () => {
  const { projectId, workspaceId } = useProjectContext()

  return (
    <button
      onClick={async () => {
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
      }}
    >
      do a POST
    </button>
  )
}
