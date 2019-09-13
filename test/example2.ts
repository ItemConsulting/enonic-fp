import { Response, Request, Error } from "../src/common";
import { publish, remove } from '../src/content';
import { pipe } from "fp-ts/lib/pipeable";
import { chain, fold } from "fp-ts/lib/Either";
import { run } from "../src/context";

function del(req: Request): Response {
  const key = req.params.key!!;

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
