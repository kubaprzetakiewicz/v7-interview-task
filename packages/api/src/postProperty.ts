import type { components } from './api'
import { API_BASE_URL } from './constants'

type AddPropertyRequest = components['schemas']['Projects.AddPropertyRequest']
type PropertyResponse = components['schemas']['Projects.PropertyResponse']

type Params = {
  workspaceId: string
  projectId: string
  apiKey: string
  propertyData: AddPropertyRequest
}

export const postProperty = async ({ apiKey, projectId, workspaceId, propertyData }: Params) => {
  const res = await fetch(`${API_BASE_URL}/workspaces/${workspaceId}/projects/${projectId}/properties`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': apiKey,
    },
    body: JSON.stringify(propertyData),
  })

  if (!res.ok) {
    throw new Error('Failed to create property')
  }

  const propertyResponse = await res.json()
  return propertyResponse as PropertyResponse
}
