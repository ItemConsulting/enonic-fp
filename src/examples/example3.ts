import {sequenceT} from "fp-ts/Apply";
import {Json} from "fp-ts/Either";
import {chain, fold, ioEither, IOEither, map} from "fp-ts/IOEither";
import {pipe} from "fp-ts/pipeable";
import {Request, Response} from "enonic-types/controller";
import {Content, QueryResponse} from "enonic-types/content";
import {EnonicError} from "../errors";
import {get as getContent, query} from "../content";
import {bodyAsJson, request} from "../http";
import {Article} from "../../site/content-types/article/article";
import {Comment} from "../../site/content-types/comment/comment";
import {errorResponse, ok} from "../controller";
import {tupled} from "fp-ts/function";

export function get(req: Request): Response {
  const articleId = req.params.key!;

  return pipe(
    sequenceT(ioEither)(
      getContent<Article>(articleId),
      getCommentsByArticleKey(articleId),
      getOpenPositionsOverHttp()
    ),
    map(tupled(createResponse)),
    fold(
      errorResponse({ req, i18nPrefix: "articleErrors" }),
      ok
    )
  )();
}

function getCommentsByArticleKey(articleId: string): IOEither<EnonicError, QueryResponse<Comment>> {
  return query<Comment>({
    contentTypes: ["com.example:comment"],
    count: 100,
    query: `data.articleId = '${articleId}'`
  });
}

function getOpenPositionsOverHttp(): IOEither<EnonicError, Json> {
  return pipe(
    request("https://example.com/api/open-positions"),
    chain(bodyAsJson)
  );
}

function createResponse(
  article: Content<Article>,
  comments: QueryResponse<Comment>,
  openPositions: Json
) {
  return {
    ...article,
    comments: comments.hits,
    openPositions
  };
}
