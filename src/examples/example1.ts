import {fold} from "fp-ts/IOEither";
import {pipe} from "fp-ts/pipeable";
import {Request, Response} from "enonic-types/controller";
import {get as getContent} from "../content";
import {Article} from "../../site/content-types/article/article"; // 1
import {internalServerError, ok} from "../controller";

export function get(req: Request): Response { // 2
  const program = pipe( // 3
    getContent<Article>(req.params.key!), // 4
    fold( // 5
      internalServerError, // 6
      ok // 7
    )
  );

  return program(); // 8
}
