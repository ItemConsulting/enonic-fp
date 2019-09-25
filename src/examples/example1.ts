import { io } from "fp-ts/lib/IO";
import { fold } from "fp-ts/lib/IOEither";
import { pipe } from "fp-ts/lib/pipeable";
import { Error, Request, Response } from "../common";
import { Content, get as getContent } from "../content";

export function get(req: Request): Response {
  const program = pipe(
    getContent<Article>({
      key: req.params.key!!
    }),
    fold<Error, Content<Article>, Response>(
      (err: Error) =>
        io.of({
          body: err,
          contentType: "application/json",
          status: 500 // 500 = Internal Server Error
        }),
      (content: Content<Article>) =>
        io.of({
          body: content,
          contentType: "application/json",
          status: 200 // 200 = Ok
        })
    )
  );

  return program();
}

interface Article {
  title: string;
  text: string;
}
