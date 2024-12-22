export const delay = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const blobToBase64 = async (data: Buffer | Blob | ArrayBuffer): Promise<string> => {
  if (Buffer.isBuffer(data)) {
    return data.toString('base64');
  }

  if (data instanceof Blob) {
    const buffer = Buffer.from(await data.arrayBuffer());
    return buffer.toString('base64');
  }

  if (data instanceof ArrayBuffer) {
    return Buffer.from(data).toString('base64');
  }

  throw new Error('Unsupported data type');
};

export const systemMessage = (text: string) => {
  return `<b>🧙 Master Grimclaw:</b>\n\n${text}`;
};

export const botMessage = (name: string, text: string) => {
  return `<b>🧌 ${name}:</b>\n${text}`;
};

export const hintMessage = (text: string) => {
  return `<b>💡 Hint:</b> <i>${text}</i>`;
};

function safeMultiply(a: bigint, b: bigint): bigint {
  const result = a * b;
  if (a !== 0n && result / a !== b) {
    throw new Error('Integer overflow');
  }
  return result;
}
