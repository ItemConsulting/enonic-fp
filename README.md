# Enonic FP

[![npm version](https://badge.fury.io/js/enonic-fp.svg)](https://badge.fury.io/js/enonic-fp)

Functional programming helpers for Enonic XP. This library covers a subset of the functionality. If there are other
wrappers you need please raise an issue on Github, or file a pull request.

## Requirements

 1. Enonic 7 setup with Webpack
 2. Individual Enonic client libraries installed (these are only wrappers) 

## Motivation

Currently this library just wraps an [Either<Error, T>](https://gcanti.github.io/fp-ts/modules/Either.ts.html) around 
the results from the standard Enonic XP libaries.

This gives us two things:

 1. It forces the developer to handle the error case using `fold`
 2. It allows us to `pipe` the results from one operation into the next using `chain` (or `map`). Chain expects another
    `Either<Error, T>` to be returned, and when the first `left<Error>` is returned the pipe will short circuit to the
    error case in `fold`.

This style of programming encourages us to write re-usable functions, that we can compose together using `pipe`.

## Usage

### Simple get content by key

In this example we ask for content by the key, and then we either return an _Internal Server Error_ or return the 
content to the user as json.

```typescript
import { Response, Request, Error } from "enonic-fp/lib/common";
import { Content, get as getContent } from 'enonic-fp/lib/content';
import { pipe } from "fp-ts/lib/pipeable";
import { fold } from "fp-ts/lib/Either";

export function get(req: Request): Response {
  return pipe(
    getContent({ 
      key: req.params.key 
    }),
    fold<Error, Content, Response>(
      (err: Error) => ({
        status: 500, // 500 = Internal Server Error
        contentType: 'application/json',
        body: err
      }),
      (content: Content) => ({
        status: 200, // 200 = Ok
        contentType: 'application/json',
        body: content
      })
    )
  );
}
```

### Delete content by key and publish

In this example we delete come content by `key`. We are first doing this on the `draft` branch. And then we `publish` it
to the `master` branch. 

We will return a http error based on the type of error that happened (trough a lookup in the `errorsKeyToStatus` map). 
Or we return a http status `204`, indicating success.

```typescript
import { Response, Request, Error } from "enonic-fp/lib/common";
import { remove, publish } from 'enonic-fp/lib/content';
import { run } from 'enonic-fp/lib/context';
import { pipe } from "fp-ts/lib/pipeable";
import { chain, fold } from "fp-ts/lib/Either";

function del(req: Request): Response {
  const key = req.params.key;

  return pipe(
    runInDraftContext(() => remove({ key })),
    chain(() => publishToMaster(key)),
    fold<Error, any, Response>(
      (err: Error) => ({
        status: errorKeyToStatus[err.errorKey],
        contentType: 'application/json',
        body: err
      }),
      () => ({
        status: 204, // 204 = No content
        body: ''
      })
    )
  );
}
export { del as delete }; // hack since delete is a keyword

// --- HELPER FUNCTIONS ---

function runInDraftContext<T>(f: () => T) {
  return run({ 
    branch: 'draft'
  }, f);
}

function publishToMaster(key: string) {
  return publish({
    keys: [key],
    sourceBranch: 'draft',
    targetBranch: 'master',
  });
}

const errorKeyToStatus : { [key: string]: number; } = {
  "InternalServerError": 500,
  "NotFoundError": 404,
  "PublishError": 500
};
```

### Multiple queries, and http request

In this example we do 3 queries. First we look up an article by `key`, then we search for comments related to that 
article based on the articles key. And then we get a list of open positions in the company, that we want to display on
the web page.

The first two are queries in Enonic, and the last one is over http. We do a `sequenceT` taking the 3 `Either<Error, T>`
as input, and getting an Either with the results in a tuple (`Either<Error, [Content, QueryResponse, any]>`).

We then `map` over the tuple, and create an object with all the data, that can be returned to the user.

In the `fold` we either return the an error, with the correct http status (`404`, `500` or `502`), or we return the
result with the http status `200`.

```typescript
import { pipe } from "fp-ts/lib/pipeable";
import { chain, map, fold, either, Either, parseJSON } from "fp-ts/lib/Either";
import { sequenceT } from 'fp-ts/lib/Apply'
import { Response, Request, Error } from "enonic-fp/lib/common";
import { Content, get as getContent, query, QueryResponse } from "enonic-fp/lib/content";
import { request} from "enonic-fp/lib/http";

export function get(req: Request): Response {
  const key = req.params.key;

  return pipe(
    sequenceT(either)(
      getArticle(key),
      queryComments(key),
      getOpenPositionsOverHttp()
    ),
    map(([article, comments, openPositions]) => {
      return {
        ...article,
        openPositions,
        comments: comments.hits,
      };
    }),
    fold<Error, any, Response>(
      (err: Error) => {
        return {
          status: errorKeyToStatus[err.errorKey],
          contentType: 'application/json',
          body: err
        }
      },
      (res) => ({
        status: 200,
        contentType: 'application/json',
        body: res
      })
    )
  )
}

// --- HELPER FUNCTIONS ---

const errorKeyToStatus : { [key: string]: number; } = {
  "NotFoundError": 404,
  "InternalServerError": 500,
  "BadGatewayError": 502
};

function getArticle(key: string) : Either<Error, Content> {
  return getContent({ key });
}

function queryComments(articleId: string) : Either<Error, QueryResponse> {
  return query({
    query: `data.articleId = ${articleId}`,
    contentTypes: ['com.example:comment']
  });
}

function createBadGatewayError(reason: any): Error {
  return {
    errorKey: 'BadGatewayError',
    cause: String(reason)
  };
}

function getOpenPositionsOverHttp() : Either<Error, any> {
  return pipe(
    request({
      url: "https://example.com/api/open-positions"
    }),
    chain(res => parseJSON(res.body!, createBadGatewayError))
  )
}
```

## Building the project

```bash
npm run build
```
