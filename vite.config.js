import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Local Dev Helper: Allows saving new projects directly from the browser during `npm run dev`
const projectManagerPlugin = () => ({
  name: 'project-manager-api',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url === '/api/save-project' && req.method === 'POST') {
        let body = ''
        req.on('data', (chunk) => {
          body += chunk
        })
        req.on('end', () => {
          try {
            const newProject = JSON.parse(body)
            const projectsPath = path.resolve(__dirname, 'src/data/projects.json')
            let projects = []
            if (fs.existsSync(projectsPath)) {
              projects = JSON.parse(fs.readFileSync(projectsPath, 'utf-8'))
            }
            // Add new project to top of list
            projects.unshift(newProject)
            fs.writeFileSync(projectsPath, JSON.stringify(projects, null, 2), 'utf-8')

            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: true, message: 'Project saved successfully!' }))
          } catch (err) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: false, error: err.message }))
          }
        })
        return
      }
      next()
    })
  },
})

export default defineConfig({
  plugins: [react(), projectManagerPlugin()],
})