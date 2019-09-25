import { io } from "fp-ts/lib/IO";
import { chain, fold } from "fp-ts/lib/IOEither";
import { pipe } from "fp-ts/lib/pipeable";
import { Error, Request, Response } from "../common";
import { publish, remove } from "../content";
import { run } from "../context";

export function del(req: Request): Response {
  const key = req.params.key!!;

  const program = pipe(
    runInDraftContext(() => remove({ key })),
    chain(() => publishToMaster(key)),
    fold<Error, any, Response>(
      (err: Error) =>
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
  );

  return program();
}

function runInDraftContext<T>(f: () => T) {
  return run(
    {
      branch: "draft"
    },
    f
  );
}

function publishToMaster(key: string) {
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
