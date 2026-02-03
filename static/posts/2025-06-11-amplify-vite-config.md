---
title: Amplify Vite config correction
url: 2025-06-11-amplify-vite-config
desc: ''
updated: 11/06/2025
created: 11/06/2025
tags: ['aws', 'amplify', 'vite', 'vue']
---


# Amplify Vite config correction

Under the Vue docs for Amplify UI, we see a the following config specification. 

https://ui.docs.amplify.aws/vue/connected-components/authenticator

```javascript
// vite.config.js

export default defineConfig({
  plugins: [vue()],
  resolve: {
      alias: [
      {
        find: './runtimeConfig',
        replacement: './runtimeConfig.browser', // ensures browser compatible version of AWS JS SDK is used
      },
    ]
  }
})
```

The config is required to ensure a browser compatible version of `AWS JS SDK`. 

Sidenotes: 
- Why do we need the AWS JS SDK if we're using Amplify? 
- None of the docs for Amplify mention the `aws-sdk` as a dependency. 

## Problem

Yhe logic above assumes that projects will configure Vite aliases with find / replacement pattern. 

However the default config recommends a much simple object structure with key / value definitions. 

For instance the Vue3 wizard produces this Vite configuration

```javascript
// vite.config.js

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
```

## Solution

Although we could introduce the find / replacement pattern into the original config, it's far more sensible to replace the documentation recommendation to match the key/value format

```javascript
// vite.config.js

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      './runtimeConfig': path.resolve(__dirname, './runtimeConfig.browser')
    },
  },
})
```

## Why does it matter?

Meets users where ever they are, by matching closely the default starter config. 

You could end up with a lot of convoluted issues with Vite because of this configuration.

For example a mis-configured alias would trigger errors stemming from `EnvironmentPluginContainer.resolveId` and `EnvironmentModuleGraph._resolveUrl`. This would be a false negative pointing to mis-configured environement variables as opposed to the Vite alias resolution. 

Be careful with it!
