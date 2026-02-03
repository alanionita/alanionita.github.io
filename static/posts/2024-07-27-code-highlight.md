---
url: 2024-07-27-code-highlight
title: Testing - Code syntax highlighting
desc: ''
updated: 27/07/2024
created: 27/07/2024
tags: ['web', 'demo']
---

# Testing - Code syntax highlighting

Currently only supports: Javascript, Yaml, Shell

Needs expanding for every new language.

## Javascript

```js
const x = 10
const y = 5

function add(a, b) {
    return a + b
}

const result = add(x, y);
```

## Yaml

> Only registered for yaml, not longer supporting yml

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


## Shell

> Doesn't seem to be displaying correctly but works

```sh

cat ./test/test-file.txt

wc -l en_US.twitter.txt

foo@bar:~$ whoami

foo

```

## VTL

> No highlightjs support, but using PHP language works

```vtl
#set( $expNames  = {} )
#set( $expValues = {} )
#set( $expSet = {} )
#set( $expRemove = [] )

#foreach( $entry in $context.arguments.newProfile.entrySet() )
    #if( $entry.key != "name" )
        #if( (!$entry.value) && ("$!{entry.value}" == "") )
            ## If the argument is set to null, then remove that attribute from the item in DynamoDB **

            #set( $discard = ${expRemove.add("#${entry.key}")} )
            $!{expNames.put("#${entry.key}", "$entry.key")}
        #else
            ## Otherwise set (or update) the attribute on the item in DynamoDB **

            $!{expSet.put("#${entry.key}", ":${entry.key}")}
            $!{expNames.put("#${entry.key}", "$entry.key")}
            $!{expValues.put(":${entry.key}", { 
                "S": "${entry.value}"
            })}
            
        #end
    #else
        $!{expSet.put("#${entry.key}", ":${entry.key}")}
        $!{expNames.put("#${entry.key}", "$entry.key")}
        $!{expValues.put(":${entry.key}", { 
            "S": "${entry.value}"
        })}
    #end
#end

## Start building the update expression, starting with attributes we are going to SET **

#set( $expression = "" )
#if( !${expSet.isEmpty()} )
    #set( $expression = "SET" )
    #foreach( $entry in $expSet.entrySet() )
        #set( $expression = "${expression} ${entry.key} = ${entry.value}" )
        #if ( $foreach.hasNext )
            #set( $expression = "${expression}," )
        #end
    #end
#end

## Continue building the update expression, adding attributes we are going to REMOVE **
#if( !${expRemove.isEmpty()} )
    #set( $expression = "${expression} REMOVE" )

    #foreach( $entry in $expRemove )
        #set( $expression = "${expression} ${entry}" )
        #if ( $foreach.hasNext )
            #set( $expression = "${expression}," )
        #end
    #end
#end

{
    "version": "2018-05-29",
    "operation": "UpdateItem",
    "key": {
        "id" : $util.dynamodb.toDynamoDBJson($context.identity.username)
    },
    "update": {
        "expression" : "${expression}"
        #if( !${expNames.isEmpty()} )
            ,"expressionNames" : $utils.toJson($expNames)
        #end
        #if( !${expValues.isEmpty()} )
            ,"expressionValues" : $utils.toJson($expValues)
        #end
    },
    "condition" : {
        "expression" : "attribute_exists(id)"
    }
}

```

## JSON

```json
{
    "version" : "2018-05-29",
    "operation" : "UpdateItem",
    "key": {
        "id" : $util.dynamodb.toDynamoDBJson($context.identity.username)
    },

    "update" : {
        "expression" : "set #name = :name, imgUrl = :imgUrl, bgImgUrl = :bgImgUrl, bio = :bio, #location = :location, website = :website, birthdate = :birthdate",
        "expressionNames" : {
           "#name" : "name",
           "#location": "location",
       },

       "expressionValues" : {
            ":name" : $util.dynamodb.toDynamoDBJson($context.arguments.newProfile.name),
            ":imgUrl" : $util.dynamodb.toDynamoDBJson($context.arguments.newProfile.imgUrl),
            ":bgImgUrl" : $util.dynamodb.toDynamoDBJson($context.arguments.newProfile.bgImgUrl),
            ":bio" : $util.dynamodb.toDynamoDBJson($context.arguments.newProfile.bio),
            ":location" : $util.dynamodb.toDynamoDBJson($context.arguments.newProfile.location),
            ":website" : $util.dynamodb.toDynamoDBJson($context.arguments.newProfile.website),
            ":birthdate" : $util.dynamodb.toDynamoDBJson($context.arguments.newProfile.birthdate),
        }

    },

    "condition" : {
        "expression" : "attribute_exists(id)"
    },
}

```

## GraphQL

> only registered for gql

```gql
input ProfileInput {
    name: String!
    imgUrl: AWSURL
    bgImgUrl: AWSURL
    bio: String
    location: String
    website: String
    birthdate: AWSDate
}

```

## Markdown

```md

| Requirement   | Minimum   | Recommended     |
| ------------- | --------- | --------------- |
| CPU cores     | 4         | 8               |
| Memory        | 8         | 16              |
| Display res   | 1366x768  | 1920x1080       |
| HDD           | 4GB       | 52GB            |

```

## Svelte

```ts
<script lang="ts">
	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<h1>{data.title}</h1>
<div>{@html data.content}</div>

```