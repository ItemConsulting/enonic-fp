import { io } from "fp-ts/lib/IO";
import { fold } from "fp-ts/lib/IOEither";
import { pipe } from "fp-ts/lib/pipeable";
import { Request, Response } from "enonic-types/lib/controller";
import { get as getContent } from "../content";
import { Article } from "../../site/content-types/article/article"; // 1

export function get(req: Request): Response { // 2
  const program = pipe( // 3
    getContent<Article>({ // 4
      key: req.params.key!
    }),
    fold( // 5
      (err) =>
        io.of(
          { // 6
            status: 500,
            body: err,
            contentType: "application/json"
          } as Response
        ),
      (content) =>
        io.of(
          { // 7
            status: 200,
            body: content.data,
            contentType: "application/json"
          }
        )
    )
  );

  return program(); // 8
}
