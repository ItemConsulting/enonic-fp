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
import { io } from "fp-ts/lib/IO";
import { pipe } from "fp-ts/lib/pipeable";
import { fold } from "fp-ts/lib/Either";
import { EnonicError, Request, Response }  from "enonic-fp/lib/common";
import { Content, get as getContent } from 'enonic-fp/lib/content';


export function get(req: Request): Response {
  return pipe(
    getContent<Article>({
      key: req.params.key!!
    }),
    fold<EnonicError, Content<Article>, Response>(
      (err: EnonicError) =>
        io.of({
          body: err,
          contentType: "application/json",
          status: 500 // 500 = Internal Server Error
        } as Response),
      (content: Content<Article>) =>
        io.of({
          body: content,
          contentType: "application/json",
          status: 200 // 200 = Ok
        })
    )
  )();
}

interface Article {
  title: string;
  text: string;
}
```

### Delete content by key and publish

In this example we delete come content by `key`. We are first doing this on the `draft` branch. And then we `publish` it
to the `master` branch. 

We will return a http error based on the type of error that happened (trough a lookup in the `errorsKeyToStatus` map). 
Or we return a http status `204`, indicating success.

```typescript
import {IO, io} from "fp-ts/lib/IO";
import {chain, fold, IOEither} from "fp-ts/lib/IOEither";
import { pipe } from "fp-ts/lib/pipeable";
import { EnonicError, Request, Response } from "enonic-fp/lib/common";
import {publish, PublishResponse, remove} from "enonic-fp/lib/context";
import { run } from "enonic-fp/lib/context";

export function del(req: Request): Response {
  const key = req.params.key!!;

  return pipe(
    runInDraftContext(remove({ key })),
    chain(() => publishToMaster(key)),
    fold<EnonicError, any, Response>(
      (err: EnonicError) =>
        io.of({
          body: err,
          contentType: "application/json",
          status: errorKeyToStatus[err.errorKey]
        }),
      () =>
        io.of({
          body: "",
          status: 204 // 204 = No content
        })
    )
  )();
}


function runInDraftContext<A>(f: IO<A>): IO<A> {
  return run<A>(
    {
      branch: "draft"
    }
  )(f);
}

function publishToMaster(key: string): IOEither<EnonicError, PublishResponse> {
  return publish({
    keys: [key],
    sourceBranch: "draft",
    targetBranch: "master"
  });
}

const errorKeyToStatus: { [key: string]: number } = {
  InternalServerError: 500,
  NotFoundError: 404,
  PublishError: 500
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
import { sequenceT } from "fp-ts/lib/Apply";
import { parseJSON } from "fp-ts/lib/Either";
import { io } from "fp-ts/lib/IO";
import { chain, fold, fromEither, ioEither, IOEither, map } from "fp-ts/lib/IOEither";
import { pipe } from "fp-ts/lib/pipeable";
import { EnonicError, Request, Response } from "enonic-fp/lib/common";
import { get as getContent, query, QueryResponse } from "enonic-fp/lib/content";
import { request } from "enonic-fp/lib/http";

export function get(req: Request): Response {
  const articleKey = req.params.key!!;

  return pipe(
    sequenceT(ioEither)(
      getContent<Article>({ key: articleKey }),
      getCommentsByArticleId(articleKey),
      getOpenPositionsOverHttp()
    ),
    map(([article, comments, openPositions]) => {
      return {
        ...article,
        comments: comments.hits,
        openPositions
      };
    }),
    fold<EnonicError, any, Response>(
      (err: EnonicError) =>
        io.of({
          body: err,
          contentType: "application/json",
          status: errorKeyToStatus[err.errorKey]
        }),
      (res) =>
        io.of({
          body: res,
          contentType: "application/json",
          status: 200
        })
    )
  )();
}

interface Article {
  title: string;
  text: string;
}

interface Comment {
  writtenBy: string;
  text: string;
}

const errorKeyToStatus: { [key: string]: number } = {
  BadGatewayError: 502,
  InternalServerError: 500,
  NotFoundError: 404
};

function getCommentsByArticleId(
  articleId: string
): IOEither<EnonicError, QueryResponse<Comment>> {
  return query({
    contentTypes: ["com.example:comment"],
    count: 100,
    query: `data.articleId = ${articleId}`
  });
}

function createBadGatewayError(reason: any): EnonicError {
  return {
    cause: String(reason),
    errorKey: "BadGatewayError"
  };
}

function getOpenPositionsOverHttp(): IOEither<EnonicError, any> {
  return pipe(
    request({
      url: "https://example.com/api/open-positions"
    }),
    chain(res => fromEither(parseJSON(res.body!, createBadGatewayError)))
  );
}
```

## Building the project

```bash
npm run build
```
