/* eslint-disable @typescript-eslint/no-use-before-define */
import { sequenceT } from "fp-ts/lib/Apply";
import { parseJSON } from "fp-ts/lib/Either";
import { io } from "fp-ts/lib/IO";
import { chain, fold, fromEither, ioEither, IOEither, map } from "fp-ts/lib/IOEither";
import { pipe } from "fp-ts/lib/pipeable";
import { EnonicError, Request, Response } from "../common";
import { get as getContent, query, QueryResponse } from "../content";
import { request } from "../http";

export function get(req: Request): Response {
  const articleKey = req.params.key!!;

  return pipe(
    sequenceT(ioEither)(
      getContent<Article>({ key: articleKey }),
      getCommentsByArticleId(articleKey),
      getOpenPositionsOverHttp()
    ),
    map(([article, comments, openPositions]) => {
      return {
        ...article,
        comments: comments.hits,
        openPositions
      };
    }),
    fold<EnonicError, any, Response>(
      (err: EnonicError) =>
        io.of({
          body: err,
          contentType: "application/json",
          status: errorKeyToStatus[err.errorKey]
        }),
      (res) =>
        io.of({
          body: res,
          contentType: "application/json",
          status: 200
        })
    )
  )();
}

interface Article {
  title: string;
  text: string;
}

interface Comment {
  writtenBy: string;
  text: string;
}

const errorKeyToStatus: { [key: string]: number } = {
  BadGatewayError: 502,
  InternalServerError: 500,
  NotFoundError: 404
};

function getCommentsByArticleId(
  articleId: string
): IOEither<EnonicError, QueryResponse<Comment>> {
  return query({
    contentTypes: ["com.example:comment"],
    count: 100,
    query: `data.articleId = ${articleId}`
  });
}

function createBadGatewayError(reason: any): EnonicError {
  return {
    cause: String(reason),
    errorKey: "BadGatewayError"
  };
}

function getOpenPositionsOverHttp(): IOEither<EnonicError, any> {
  return pipe(
    request({
      url: "https://example.com/api/open-positions"
    }),
    chain(res => fromEither(parseJSON(res.body!, createBadGatewayError)))
  );
}
