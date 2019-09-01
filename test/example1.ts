import { Response, Request, Error } from "../src/common";
import {Content, get as getContent, query, QueryResponse} from '../src/content';
import { pipe } from "fp-ts/lib/pipeable";
import { chain, map, fold, either, Either, parseJSON } from "fp-ts/lib/Either";
import { sequenceT } from 'fp-ts/lib/Apply'
import { request} from "../src/http";

export function get(req: Request): Response {
  return pipe(
    getContent<Article>({
      key: req.params.key
    }),
    fold<Error, Content<Article>, Response>(
      (err: Error) => ({
        status: 500, // 500 = Internal Server Error
        contentType: 'application/json',
        body: err
      }),
      (content: Content<Article>) => ({
        status: 200, // 200 = Ok
        contentType: 'application/json',
        body: content
      })
    )
  );
}

interface Article {
  title: string,
  text: string
}
