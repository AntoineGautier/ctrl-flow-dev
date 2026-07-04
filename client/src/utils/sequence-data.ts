import { ConfigInterface } from "../data/config";

/**
 * Builds the request body for POST /api/sequence from project configs.
 * Extracted from DownloadModal so it can also be exposed to a host page
 * when the app runs embedded (see utils/embed.ts).
 */
export function getSequenceData(projectConfigs: ConfigInterface[]) {
  const seqData: { [key: string]: any } = {};

  projectConfigs.forEach((config) => {
    const configData: { [key: string]: any } = {
      ...config.evaluatedValues,
      ...config.selections,
      [config.systemPath]: config.templatePath,
    };
    const configKeys = Object.keys(configData);

    configKeys.forEach((key) => {
      if (seqData[key] !== undefined) {
        if (seqData[key].indexOf(configData[key]) === -1) {
          seqData[key].push(configData[key]);
        }
      } else {
        const [modelicaPath] = key.split("-");
        if (modelicaPath !== configData[key]) {
          seqData[key] = [configData[key]];
        }
      }
    });
  });

  return seqData;
}
