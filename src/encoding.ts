import {ByteSource} from "enonic-types/content";
import {chain, IOEither} from "fp-ts/lib/IOEither";
import {fromNullable} from "./utils";
import {pipe} from "fp-ts/lib/pipeable";
import {catchEnonicError, EnonicError, notFoundError} from "./errors";

let encodingLib = __non_webpack_require__("/lib/text-encoding");

/**
 * Replace the library with a mocked version
 */
export function setLibrary(library: any) {
  encodingLib = library;
}

export function base64Encode(stream: ByteSource | string): string {
  return encodingLib.base64Encode(stream);
}

export function base64Decode(text: string): IOEither<EnonicError, ByteSource> {
  return pipe(
    catchEnonicError(
      () => encodingLib.base64Decode(text)
    ),
    chain(fromNullable(notFoundError))
  );
}

export function base64UrlEncode(stream: ByteSource | string): string {
  return encodingLib.base64UrlEncode(stream);
}

export function base64UrlDecode(text: string): IOEither<EnonicError, ByteSource> {
  return pipe(
    catchEnonicError(
      () => encodingLib.base64UrlDecode(text)
    ),
    chain(fromNullable(notFoundError))
  );
}

export function base32Encode(stream: ByteSource | string): string {
  return encodingLib.base32Encode(stream);
}

export function base32Decode(text: string): IOEither<EnonicError, ByteSource> {
  return pipe(
    catchEnonicError(
      () => encodingLib.base32Decode(text)
    ),
    chain(fromNullable(notFoundError))
  );
}

export function hexEncode(stream: ByteSource | string): string {
  return encodingLib.hexEncode(stream);
}

export function hexDecode(text: string): IOEither<EnonicError, ByteSource> {
  return pipe(
    catchEnonicError(
      () => encodingLib.hexDecode(text)
    ),
    chain(fromNullable(notFoundError))
  );
}

export function charsetDecode(stream: ByteSource, charsetName?: string): string {
  return encodingLib.charsetDecode(stream, charsetName);
}

export function charsetEncode(text: string, charsetName?: string): ByteSource {
  return encodingLib.charsetEncode(text, charsetName);
}

export function xmlEscape(text: string): string {
  return encodingLib.xmlEscape(text);
}

export function xmlUnescape(text: string): string {
  return encodingLib.xmlUnescape(text);
}

export function urlEscape(text: string): string {
  return encodingLib.urlEscape(text);
}

export function urlUnescape(text: string): string {
  return encodingLib.urlUnescape(text);
}

export function htmlEscape(text: string): string {
  return encodingLib.htmlEscape(text);
}

export function htmlUnescape(text: string): string {
  return encodingLib.htmlUnescape(text);
}

export function md5(text: string | ByteSource): string {
  return encodingLib.md5(text);
}

export function sha1(stream: string | ByteSource): string {
  return encodingLib.sha1(stream);
}

export function sha256(stream: string | ByteSource): string {
  return encodingLib.sha256(stream);
}

export function sha512(stream: string | ByteSource): string {
  return encodingLib.sha512(stream);
}

export function hmacSha1AsHex(stream: string | ByteSource, key: string): string {
  return encodingLib.hmacSha1AsHex(stream, key);
}

export function hmacSha1AsStream(stream: string | ByteSource, key: string): ByteSource {
  return encodingLib.hmacSha1AsStream(stream, key);
}

export function hmacSha256AsHex(stream: string | ByteSource, key: string): string {
  return encodingLib.hmacSha256AsHex(stream, key);
}

export function hmacSha256AsStream(stream: string | ByteSource, key: string): ByteSource {
  return encodingLib.hmacSha256AsStream(stream, key);
}

export function hmacSha512AsHex(stream: string | ByteSource, key: string): string {
  return encodingLib.hmacSha512AsHex(stream, key);
}

export function hmacSha512AsStream(stream: string | ByteSource, key: string): ByteSource {
  return encodingLib.hmacSha512AsStream(stream, key);
}
