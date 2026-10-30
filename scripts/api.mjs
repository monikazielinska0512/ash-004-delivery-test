export const repository = process.env.GITHUB_REPOSITORY;
if (repository !== "monikazielinska0512/ash-004-delivery-test") throw Error("WRONG_TEST_REPOSITORY");
export async function api(path, method = "GET", body) {
  const response = await fetch("https://api.github.com/repos/" + repository + path, {
    method, headers: { authorization: "Bearer " + process.env.GH_TOKEN, accept: "application/vnd.github+json", "content-type": "application/json", "x-github-api-version": "2022-11-28" },
    ...(body ? {body: JSON.stringify(body)} : {}), signal: AbortSignal.timeout(15000), redirect: "error"
  });
  const data = await response.json();
  return {status: response.status, data};
}
export function requireStatus(result, status) { if (result.status !== status) throw Error("PROVIDER_STATUS_" + result.status); return result.data; }
