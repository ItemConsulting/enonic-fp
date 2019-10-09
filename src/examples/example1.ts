import { io } from "fp-ts/lib/IO";
import { fold } from "fp-ts/lib/IOEither";
import { pipe } from "fp-ts/lib/pipeable";
import { EnonicError, Request, Response } from "../common";
import { Content, get as getContent } from "../content";

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
