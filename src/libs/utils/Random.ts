import randomstring from "randomstring";

export type RandomStringCharset = "alphanumeric" | "alphabetic" | "numeric" | "hex"

export default class Random {
  static string(length = 64, readable = true, charset:RandomStringCharset = "alphanumeric") {
    return randomstring.generate({
      charset: charset,
      length: length,
      readable: readable
    });
  }
}