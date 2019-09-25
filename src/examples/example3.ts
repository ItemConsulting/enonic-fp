import { sequenceT } from "fp-ts/lib/Apply";
import { parseJSON } from "fp-ts/lib/Either";
import { io } from "fp-ts/lib/IO";
import {
  chain,
  fold,
  fromEither,
  ioEither,
  IOEither,
  map
} from "fp-ts/lib/IOEither";
import { pipe } from "fp-ts/lib/pipeable";
import { Error, Request, Response } from "../common";
import { Content, get as getContent, query, QueryResponse } from "../content";
import { request } from "../http";

export function get(req: Request): Response {
  const key = req.params.key!!;

  const program = pipe(
    sequenceT(ioEither)(
      getArticle(key),
      getCommentsByArticleId(key),
      getOpenPositionsOverHttp()
    ),
    map(([article, comments, openPositions]) => {
      return {
        ...article,
        comments: comments.hits,
        openPositions
      };
    }),
    fold<Error, any, Response>(
      (err: Error) =>
        io.of({
          body: err,
          contentType: "application/json",
          status: errorKeyToStatus[err.errorKey]
        }),
      res =>
        io.of({
          body: res,
          contentType: "application/json",
          status: 200
        })
    )
  );

  return program();
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

function getArticle(key: string): IOEither<Error, Content<Article>> {
  return getContent({ key });
}

function getCommentsByArticleId(
  articleId: string
): IOEither<Error, QueryResponse<Comment>> {
  return query({
    contentTypes: ["com.example:comment"],
    count: 100,
    query: `data.articleId = ${articleId}`
  });
}

function createBadGatewayError(reason: any): Error {
  return {
    cause: String(reason),
    errorKey: "BadGatewayError"
  };
}

function getOpenPositionsOverHttp(): IOEither<Error, any> {
  return pipe(
    request({
      url: "https://example.com/api/open-positions"
    }),
    chain(res => fromEither(parseJSON(res.body!, createBadGatewayError)))
  );
}
