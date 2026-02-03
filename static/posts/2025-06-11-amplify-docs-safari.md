---
title: Amplify Documentation Safari
url: 2025-06-11-amplify-docs-safari.md
desc: ''
updated: 11/06/2025
created: 11/06/2025
tags: ['aws', 'amplify', 'docs']
---


# Amplify Documentation Safari

Join me for a thrilling ride through the Amplify docs, where you have to bob and weave in order to reach your goal of connecting an AppSync backend to a Vue frontend via the Amplify service and modules.

## Background

Amplify is an amazingly promising service for integrating frontends with GraphQL backends.

Common recipe for these recipes are: 
- Backend: Cognito, AppSync with data sources as Lambda, DynamoDB, etc
- Frontend: Vue, React etc

I'd like to use Amplify for 3 purposes:
- Connecting to my AppSync API
- Authenticating via Cogntio, managing tokens behind the scenes
- Running GraphQL queries and getting data back in the UI

## Resoning

Amplify is an ecosystem that contains cli, scaffolding, and UI tools.

The combination of these tools means that we can:
- configure a client API to hit our AppSync backend
- configure the authentication flow as Cognito
- use pre-build UI components to handle the authentication stories via Cognito: sign in, sign up, login, forgot password
- manage tokens from Cognito
- send queries down to this API

The goal of this article is to sign-post and add commentary about documentation. 

I will however cover 2 big bonuses to using Amplify before talking about docs.

## Bonus - Code generation [@amplify-cli/]

A big nuisance for GraphQL processes is the mirroring of queries across backend and frontend. 

With Amplify you can with one command generate code for all Queries and Mutations from your AppSync API:

```
npx @aws-amplify/cli codegen add --apiId YOUR_APPSYNC_API_ID --region YOUR_REGION

```

This generates files inside `graphql/` for `queries.js` and `mutations.js` with following examples

```js
export const getProfile = /* GraphQL */ `
  query GetProfile($screenName: String!) {
    getProfile(screenName: $screenName) {
      id
      name
      screenName
      imgUrl
      bgImgUrl
      bio
      location
      website
      birthdate
      createdAt
      tweets {
        nextToken
        __typename
      }
      followersCount
      followingCount
      tweetsCount
      likesCount
      following
      followedBy
      __typename
    }
  }
`;

```

## Bonus - Cognito

Cognito is an OAuth flow implementation and as such would require some legwork (boilerplate code) to manage keys and orchestrate the flows correctly.

With Amplify we get UI components, and API configurations that means we manage no tokens, vastly simplifying the app configuration.

## Documentation safari

Let's meander through the Amplify documentation valley.

1. Amplify Docs

You would think that the best docs location is the official Amplify Docs, scoped by framework of choice. Below referencing Vue.

https://docs.amplify.aws/vue/

Most sensible place to go from here is to "Set up Amplify Data" (https://docs.amplify.aws/vue/build-a-backend/data/set-up-data/), but once on the page you realise that most the setup here involves from scratch development of both backend and frontend in parallel using Amplify. 

The audience for Amplify seems to be folks that use it for both. 

I'd wager a bet that most developers build AppSync with Serverless Framework, CDK, or Terraform, bypassing Amplify on the backend, whilst using Amplify libraries on the UI.

As someone who already has a deployed AppSync API, that means that we have to hunt and peck through the docs for the relevant code and instructions

What is useful here is how to create the API on the client using `generateClient` from `aws-amplify/data`. This is important because there's a huge about of different ways to do this since Amplify has a large amount of modules and techniques, each looking the same but breaking in magical ways. 

2. AppSync - Integrate with your app

This is actually the most sensible spot to start. 

From the AWS Console, navigate to AppSync, then open your specific API. The instructions should appear my default on the main page.

One big flaw with these instructions is the use of `./aws-exports.js` which is not defined or explained. 

We can guess that it involves configuration details, but in the following steps the configuration variables are hard-coded in the file. 

There's no mention here about how to hide this sensitive information or how to use .env variables.

Also there's no configuration explanation for Cognito, even though most setups will include it. 

3. Amplify UI docs

Essentially the same as point 1. but more focused on the frontend. Thus more relevant for your needs. Requires framework scoping selection, below focused on Vue

https://ui.docs.amplify.aws/vue/connected-components/authenticator

The issue here is to do with the audience: even though it should be for us (someone who want to connect a UI to an existing AppSync backend via Amplify), the instructions are very simplistic. 

The initial example doesn't cover any Sign In, Sign Up flows, nor does it explain how to render different auth components depending on the authentication states: authenticated, unauthenticated, or loading.

You get a lot more information within the 'Advanced Usage' section of the docs, but all of the initial instructions are replaced. 

Arguable if these requires are 'advanced' or just base requirements.

# Bonus? - Sandboxing

Throughout the docs sandboxing is mentioned, but never fully detailed. 

https://docs.amplify.aws/vue/deploy-and-host/sandbox-environments/features/

Still murky as to how to use sandboxing with an existing API but the secrets explanation is very helpful and interesting. 

It seems that via sandboxing you attach secrets to a sandbox and can then reference it within your backend. Again the 'backend' definition here is murky, is it a local backend generated with Amplify, is it a Vue backend, is it out initial AppSync backend?

This is also where they describe how to 'Generate client config' essentially producing the `amplify_outputs.json` mentioned above.

Unclear whether this is a bonus or not because we already have an API and there are not details on how to integrate a sandbox with a pre-deployed API. 
