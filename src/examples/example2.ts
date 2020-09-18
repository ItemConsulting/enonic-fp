import {chain, fold} from "fp-ts/IOEither";
import {pipe} from "fp-ts/pipeable";
import {Request, Response} from "enonic-types/controller";
import {publish, remove} from "../content";
import {run} from "../context";
import {errorResponse, noContent} from "../controller";

function del(req: Request): Response {
  const program = pipe(
    runOnBranchDraft(
      remove(req.params.key!) // 1
    ),
    chain(() => publish(req.params.key!)),  // 2
    fold( // 3
      errorResponse(req),
      noContent // 4
    )
  );

  return program();
}

export {del as delete}; // 5

const runOnBranchDraft = run({ branch: 'draft' });
