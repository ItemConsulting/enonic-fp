import { Response, Request, Error } from "../src/common";
import {Content, get as getContent, query, QueryResponse} from '../src/content';
import { pipe } from "fp-ts/lib/pipeable";
import { chain, map, fold, either, Either, parseJSON } from "fp-ts/lib/Either";
import { sequenceT } from 'fp-ts/lib/Apply'
import { request} from "../src/http";

export function get(req: Request): Response {
  const key = req.params.key!!;

  return pipe(
    sequenceT(either)(
      getArticle(key),
      getCommentsByArticleId(key),
      getOpenPositionsOverHttp()
    ),
    map(([article, comments, openPositions]) => {
      return {
        ...article,
        openPositions,
        comments: comments.hits,
      };
    }),
    fold<Error, any, Response>(
      (err: Error) => ({
        status: errorKeyToStatus[err.errorKey],
        contentType: 'application/json',
        body: err
      }),
      (res) => ({
        status: 200,
        contentType: 'application/json',
        body: res
      })
    )
  )
}

interface Article {
  title: string
  text: string
}

interface Comment {
  writtenBy: string,
  text: string
}

const errorKeyToStatus : { [key: string]: number; } = {
  "NotFoundError": 404,
  "InternalServerError": 500,
  "BadGatewayError": 502
};

function getArticle(key: string) : Either<Error, Content<Article>> {
  return getContent({ key });
}

function getCommentsByArticleId(articleId: string) : Either<Error, QueryResponse<Comment>> {
  return query({
    query: `data.articleId = ${articleId}`,
    contentTypes: ['com.example:comment']
  });
}

function createBadGatewayError(reason: any): Error {
  return {
    errorKey: 'BadGatewayError',
    cause: String(reason)
  };
}

function getOpenPositionsOverHttp() : Either<Error, any> {
  return pipe(
    request({
      url: "https://example.com/api/open-positions"
    }),
    chain(res => parseJSON(res.body!, createBadGatewayError))
  )
}
