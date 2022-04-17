import NodeRSA from "node-rsa";
export default class Key {
  private _public_key_normalized: string;
  private _private_key_normalized: string;
  constructor(private key: NodeRSA) {
    this._public_key_normalized = Key.normalizeKey(this.getPublicKey());
    this._private_key_normalized = Key.normalizeKey(this.getPrivateKey());
  }

  // encryption using private key
  public encryptPrivate(data: Buffer | string): string {
    if (typeof data === "string")
      return this.key.encryptPrivate(Buffer.from(data), "base64");
    else return this.key.encryptPrivate(data, "base64");
  }
  public decryptPrivate(data: string): Buffer {
    return this.key.decrypt(data, "buffer");
  }

  // encryption using public key

  public encryptPublic(data: Buffer | string): string {
    if (typeof data === "string")
      return this.key.encrypt(Buffer.from(data), "base64");
    else return this.key.encrypt(data, "base64");
  }
  public decryptPublic(data: string): Buffer {
    return this.key.decryptPublic(data, "buffer");
  }

  // export key functions

  public getPublicKey(): string {
    return this.key.exportKey("pkcs8-public");
  }
  public getPrivateKey(): string {
    return this.key.exportKey("pkcs8-private");
  }

  // key generation methods

  public static generateFreshKey(): Key {
    const nodeKey = new NodeRSA({ b: 512 });
    return new Key(nodeKey);
  }
  public static generateKeyByPublicKey(public_key: string): Key {
    const nodeKey = new NodeRSA({ b: 512 });
    nodeKey.importKey(public_key, "pkcs8-public");
    return new Key(nodeKey);
  }
  public static generateKeyByPrivateKey(private_key: string): Key {
    const nodeKey = new NodeRSA({ b: 512 });
    nodeKey.importKey(private_key, "pkcs8-private");
    return new Key(nodeKey);
  }
  public static generateFullKey(public_key: string, private_key: string): Key {
    const nodeKey = new NodeRSA({ b: 512 });
    nodeKey.importKey(private_key, "pkcs8-private");
    nodeKey.importKey(public_key, "pkcs8-public");
    return new Key(nodeKey);
  }
  public static isPublicKey(key: string): boolean {
    return /^-----BEGIN PUBLIC KEY-----.+-----END PUBLIC KEY-----/.test(key);
  }

  /**
   * returns the normalized public key
   */
  public getPublicKeyNormalized(): string {
    return this._public_key_normalized;
  }
  /**
   * returns the normalaized private key
   */
  public getPrivateKeyNormalized(): string {
    return this._private_key_normalized;
  }
  /**
   * retunrs the address of client based on public key
   */
  public getAddress(): string {
    return this.getPublicKeyNormalized();
  }
  // key normalization methods
  public static normalizeKey(key: string): string {
    key = key.replace(/\n/g, "");
    key = key.replace(/\s/g, "");
    key = key.replace("-----BEGINPUBLICKEY-----", "");
    key = key.replace("-----ENDPUBLICKEY-----", "");
    key = key.replace("-----BEGINPRIVATEKEY-----", "");
    key = key.replace("-----ENDPRIVATEKEY-----", "");
    return key;
  }
}

export function encryptWithPublic(data: string, publicKey: string): string {
  const key = Key.generateKeyByPublicKey(publicKey);
  const cipher = key.encryptPublic(data);
  return cipher;
}
