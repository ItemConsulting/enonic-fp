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

Getting some content content by key. 

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
    fold(
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

Deleting some content by key. Deleting it first on the `draft` branch, and then publish it to the `master` branch. 

```typescript
import { Response, Request, Error } from "enonic-fp/lib/common";
import { remove, publish } from 'enonic-fp/lib/content';
import { run } from 'enonic-fp/lib/context';
import { pipe } from "fp-ts/lib/pipeable";
import { chain, fold } from "fp-ts/lib/Either";

function runInDraftContext<T>(f: () => T) {
  return run({ 
    branch: 'draft'
  }, f);
}

function publishToMaster(key) {
  return publish({
    keys: [key],
    sourceBranch: 'draft',
    targetBranch: 'master',
  });
}

const errorsKeyToStatus = {
  "InternalServerError": 500,
  "NotFoundError": 404,
  "PublishError": 500
};

function del(req: Request): Response {
  const key = req.params.key;

  return pipe(
    runInDraftContext(() => remove({ key })),
    chain(() => publishToMaster(key)),
    fold(
      (err: Error) => {
        return {
          status: errorsKeyToStatus[err.errorKey],
          contentType: 'application/json',
          body: err
        }
      },
      () => ({
        status: 204, // 204 = No content
        contentType: 'application/json',
        body: ''
      })
    )
  )
}

export { del as delete };
```

## Building the project

```bash
npm run build
```
