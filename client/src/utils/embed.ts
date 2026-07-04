/**
 * Support for running the app embedded in a third-party host page (iframe).
 *
 * The host controls the embed through the hash query string, e.g.
 *   https://ctrl-flow.lbl.gov/#/configs?embedded=1&systems=<templatePath>,<templatePath>
 *
 * and communicates over postMessage:
 *   host  -> client: { type: "ctrl-flow:get-payload" }
 *   client -> host:  { type: "ctrl-flow:ready" }
 *   client -> host:  { type: "ctrl-flow:payload", payload: <sequence data> }
 */

export interface EmbedOptions {
  embedded: boolean;
  /** Template modelica paths to preload as configs */
  systems: string[];
}

// With HashRouter the query string lives inside the hash fragment,
// so window.location.search is always empty; parse the hash instead.
export function getEmbedOptions(): EmbedOptions {
  const query = window.location.hash.split("?")[1] || "";
  const params = new URLSearchParams(query);

  return {
    embedded: params.get("embedded") === "1",
    systems: (params.get("systems") || "").split(",").filter(Boolean),
  };
}

export const MSG_READY = "ctrl-flow:ready";
export const MSG_GET_PAYLOAD = "ctrl-flow:get-payload";
export const MSG_PAYLOAD = "ctrl-flow:payload";
