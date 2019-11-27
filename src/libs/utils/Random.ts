import randomstring from "randomstring";

export type RandomStringCharset = "alphanumeric" | "alphabetic" | "numeric" | "hex"

export default class RandomUtils {
  /**
   * Generate a random string
   * @param length Random string length
   * @param readable Discard diffuct chars like o,O,0
   * @param charset Character set used for generating random string
   */
  static string(length = 64, readable = true, charset:RandomStringCharset = "alphanumeric") {
    return randomstring.generate({
      charset: charset,
      length: length,
      readable: readable
    });
  }
}