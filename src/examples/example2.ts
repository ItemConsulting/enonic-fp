/* eslint-disable @typescript-eslint/no-use-before-define */
import {IO, io} from "fp-ts/lib/IO";
import {chain, fold, IOEither} from "fp-ts/lib/IOEither";
import { pipe } from "fp-ts/lib/pipeable";
import { EnonicError, Request, Response } from "../common";
import {publish, PublishResponse, remove} from "../content";
import { run } from "../context";

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
