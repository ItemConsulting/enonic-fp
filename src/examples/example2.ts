/* eslint-disable @typescript-eslint/no-use-before-define */
import { IO, io } from "fp-ts/lib/IO";
import { chain, fold, IOEither, map } from "fp-ts/lib/IOEither";
import { pipe } from "fp-ts/lib/pipeable";
import { Request, Response } from "enonic-types/lib/controller";
import { publish, remove } from "../content";
import { EnonicError } from "../errors";
import { run } from "../context";

function del(req: Request): Response {
  const key = req.params.key!;

  const program = pipe(
    runInDraftContext(
      remove({ key }) // 1
    ),
    chain(publishContentByKey(key)),  // 2
    fold( // 3
      (err) =>
        io.of(
          {
            body: err,
            contentType: "application/json",
            status: errorKeyToStatus[err.errorKey]
          } as Response
        ),
      () =>
        io.of(
          {
            body: "",
            status: 204 // 4
          } as Response
        )
    )
  );

  return program();
}

export { del as delete }; // 4

/**
 * This function is found in the "enonic-wizardry" package
 */
function runInDraftContext<A>(a: IO<A>): IO<A> {
  return run<A>({
    branch: 'draft'
  })(a);
}

/**
 * This function is found in the "enonic-wizardry" package
 */
export function publishContentByKey<A>(key: string): (a: A) => IOEither<EnonicError, A> {
  return (a): IOEither<EnonicError, A> => {
    return pipe(
      publish({
        keys: [key],
        sourceBranch: 'draft',
        targetBranch: 'master',
      }),
      map(() => a)
    );
  }
}

const errorKeyToStatus: { [key: string]: number } = {
  InternalServerError: 500,
  NotFoundError: 404,
  PublishError: 500
};
