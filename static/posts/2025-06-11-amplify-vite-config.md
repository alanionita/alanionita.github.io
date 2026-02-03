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

```js
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

> Why do we need the AWS JS SDK if we're using Amplify? None of the Amplify docs mention the `aws-sdk` as a dependency. 

## Problem

Logic above expects to config Vite aliases with find / replacement pattern. 

However the default starter config recommends a simple object structure with key / value pairs. 

The Vue v3 wizard produces this Vite configuration

```js
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

Far more sensible to bypass the documentation suggestion, and match the key/value format.

```js
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

Yes, because it meets users where ever they are by matching closely the default starter config vs. introducing a new pattern. 

Depending on config you could end up with some odd issues.

> A mis-configured alias would trigger errors stemming from `EnvironmentPluginContainer.resolveId` and `EnvironmentModuleGraph._resolveUrl`. A false negative pointing to mis-configured environment variables as opposed Vite alias resolution.


