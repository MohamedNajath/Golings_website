import { assertConfig, config } from './config.js'
assertConfig()
const { createApp } = await import('./app.js')
const { migrate } = await import('./migrate.js')
await migrate()
createApp().listen(config.port, () => console.log(`Goalings API listening on :${config.port}`))
