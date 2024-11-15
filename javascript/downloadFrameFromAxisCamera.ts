import DigestClient from "./fetch/digestFetch";

export const downloadFrameFromAxisCamera = async ({
  ip,
  client,
}: { ip: string; client: DigestClient }) => {
  const address = `http://${ip}/axis-cgi/jpg/image.cgi`;

  const currentTime = new Date();
  const filename = `${currentTime}.jpg`;
  const headers = {
    "Content-Type": "image/jpeg",
    "Content-Disposition": `attachment; filename="${filename}"`,
    responseType: "arraybuffer",
  };

  const file = await new Promise((resolve, reject) => {
    client
      .fetch(address, { method: "GET" }, undefined, undefined, headers)
      .then(async (response) => {
        const chunks: Uint8Array[] = [];

        if (!response || !("body" in response) || !response.body) {
          return null;
        }
        for await (const chunk of response.body) {
          chunks.push(chunk);
        }

        return chunks;
      })
      .then((chunks) => {
        if (!chunks) {
          return reject("Invalid response");
        }
        resolve(Buffer.concat(chunks).toString("base64"));
      });
  });

  return file;
};
