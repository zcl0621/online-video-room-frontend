import pako from "pako";

function unzipStr(compressedString) {
  const compressedData = Uint8Array.from(atob(compressedString), (c) =>
    c.charCodeAt(0)
  );
  const decompressedBuffer = pako.inflate(compressedData);
  const utf8Decoder = new TextDecoder();
  const decompressedString = utf8Decoder.decode(decompressedBuffer);
  return decompressedString;
}

function zipStr(str) {
  const utf8Encoder = new TextEncoder();
  const inputBuffer = utf8Encoder.encode(str);
  const compressedBuffer = pako.deflate(inputBuffer);
  const compressedData = compressedBuffer.buffer;
  const compressedString = btoa(
    String.fromCharCode.apply(null, new Uint8Array(compressedData))
  );
  return compressedString;
}

export default {
  unzipStr,
  zipStr,
};
