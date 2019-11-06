/* eslint-disable @typescript-eslint/no-use-before-define */
import { sequenceT } from "fp-ts/lib/Apply";
import { parseJSON } from "fp-ts/lib/Either";
import { io } from "fp-ts/lib/IO";
import { chain, fold, fromEither, ioEither, IOEither, map } from "fp-ts/lib/IOEither";
import { pipe } from "fp-ts/lib/pipeable";
import { Request, Response } from "enonic-types/lib/controller";
import { QueryResponse } from "enonic-types/lib/content";
import { HttpResponse } from "enonic-types/lib/http";
import { EnonicError } from "../errors";
import { get as getContent, query } from "../content";
import { request } from "../http";
import { Article } from "../../site/content-types/article/article";
import { Comment } from "../../site/content-types/comment/comment";

export function get(req: Request): Response {
  const articleKey = req.params.key!!;

  const program = pipe(
    sequenceT(ioEither)(
      getContent<Article>({ key: articleKey }),
      getCommentsByArticleKey(articleKey),
      getOpenPositionsOverHttp()
    ),
    map(([article, comments, openPositions]) =>
      ({
        ...article,
        comments: comments.hits,
        openPositions
      })
    ),
    fold(
      (err: EnonicError) =>
        io.of(
          {
            body: err,
            contentType: "application/json",
            status: errorKeyToStatus[err.errorKey]
          } as Response
        ),
      (res) =>
        io.of(
          {
            body: res,
            contentType: "application/json",
            status: 200
          }
        )
    )
  );

  return program();
}

const errorKeyToStatus: { [key: string]: number } = {
  BadGatewayError: 502,
  InternalServerError: 500,
  NotFoundError: 404
};

function getCommentsByArticleKey(
  articleId: string
): IOEither<EnonicError, QueryResponse<Comment>> {
  return query({
    contentTypes: ["com.example:comment"],
    count: 100,
    query: `data.articleId = ${articleId}`
  });
}

function getOpenPositionsOverHttp(): IOEither<EnonicError, any> {
  return pipe(
    request({
      url: "https://example.com/api/open-positions"
    }),
    chain((res: HttpResponse) =>
      fromEither(
        parseJSON(res.body!, (reason: any) =>
          ({
            cause: String(reason),
            errorKey: "BadGatewayError"
          } as EnonicError)
        )
      )
    )
  );
}

