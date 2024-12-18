import jwt from "jsonwebtoken";
import crypto from "crypto";

class Token<T> {
  private secret: string;

  constructor(secret?: string) {
    this.secret = secret ?? crypto.randomBytes(24).toString("base64");
  }

  public tokenizer(data: T) {
    return jwt.sign(data as any, this.secret);
  }

  public verifier(token: string) {
    return jwt.verify(token, this.secret);
  }

  public decode(token: string) {
    return jwt.decode(token) as T;
  }

  public getSecret() {
    return this.secret;
  }

  public setSecret(secret: string) {
    this.secret = secret;
  }
}

export default Token;
