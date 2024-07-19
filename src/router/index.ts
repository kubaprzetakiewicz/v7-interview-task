import { createRouter, createWebHistory } from 'vue-router'
import FallbackPage from '../components/FallbackPage.vue'
import ProjectTable from '../components/ProjectTable.vue'
import EntityView from '../components/EntityView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'fallback',
      component: FallbackPage
    },
    {
      name: '_project',
      path: '/:workspaceId/projects/:projectId',
      redirect: {
        name: 'table',
      },
      children: [
        {
          name: 'table',
          path: '',
          component: ProjectTable,
          props: true
        },
        {
          name: 'entity',
          path: 'entities/:entityId',
          component: EntityView,
          props: true
        }
    ]
    },
  ]
})

export default router
