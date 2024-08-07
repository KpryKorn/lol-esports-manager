/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'

const AuthController = () => import('#controllers/auth_controller')

router
  .group(() => {
    // health check
    router.get('/', async () => {
      return { hello: 'world' }
    })

    // routes /user
    router
      .group(() => {
        router.post('/register', [AuthController, 'register'])
        router.post('/login', [AuthController, 'login'])
        router.post('/logout', [AuthController, 'logout']).use(middleware.auth())

        router
          .get('/me', async ({ auth, response }) => {
            try {
              const user = auth.getUserOrFail()
              return response.ok(user)
            } catch (error) {
              return response.unauthorized({
                error: 'Unauthorized',
              })
            }
          })
          .use(middleware.auth())
      })
      .prefix('user')
  })
  .prefix('api')
