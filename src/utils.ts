import { load } from "js-yaml";
import { readFileSync } from "fs";

export type Config = {
  lables: LabelConfig;
  "max-size-message"?: string;
  "ignore-file-patterns": string[];
};

export type LabelConfig = Record<string, number>;

function instanceOfConfig(object: any): object is Config {
  return "lables" in object;
}

export function readConfigurationFile(path: string) {
  const configPath = readFileSync(path, "utf-8");
  const config = load(configPath);

  if (!config) throw new Error("Error in reading configuration yaml file");
  if (!instanceOfConfig(config)) throw new Error("Config type in configuration yaml file is not match");
}

export function getSizeLabel(changedLines: number, labelConfig: LabelConfig) {
  const labels: string[] = [];

  Object.entries(labelConfig).forEach(([label, limit]) => {
    if (changedLines < limit) labels.push(label);
  });

  if (!labels.length) throw new Error("Appropriate label is not found in configuration.yml");

  return labels[labels.length - 1];
}

export function findExistedSizeLabels(existedLables: string[], labelConfig: LabelConfig) {
  const lables = new Set(Object.keys(labelConfig));

  return existedLables.filter((existedLabel) => lables.has(existedLabel));
}
