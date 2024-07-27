---
id: 76b6d520-1af3-4484-b5fb-8068b43f1417
url: code-highlight
title: Code syntax tester
desc: ''
updated: 27/07/2024
created: 27/07/2024
---

## Testing code syntax highlighting

Currently only supports: Javascript, Yaml, Shell

Needs expanding for every new language.

### Javascript

```javascript
const x = 10
const y = 5

function add(a, b) {
    return a + b
}

const result = add(x, y);
```

### Yml

```yml
name: E2E Cypress testing
on:
  push:
    branches:
      - main
jobs:
  cypress-run:
    runs-on: ubuntu-20.04
    steps:
      - name: Checkout
        uses: actions/checkout@v2

      - name: Cypress run
        uses: cypress-io/github-action@v2
        with:
          browser: chrome
          headless: true
          env: host=https://alanionita.github.io
          
      - uses: actions/upload-artifact@v1
        if: failure()
        with:
          name: fails
          path: cypress/    
```

## Yaml

```yaml
name: E2E Cypress testing
on:
  push:
    branches:
      - main
jobs:
  cypress-run:
    runs-on: ubuntu-20.04
    steps:
      - name: Checkout
        uses: actions/checkout@v2

      - name: Cypress run
        uses: cypress-io/github-action@v2
        with:
          browser: chrome
          headless: true
          env: host=https://alanionita.github.io
          
      - uses: actions/upload-artifact@v1
        if: failure()
        with:
          name: fails
          path: cypress/    
```


### Shell

> Doesn't seem to be displaying correctly but works

```shell

cat ./test/test-file.txt

wc -l en_US.twitter.txt

foo@bar:~$ whoami

foo

```