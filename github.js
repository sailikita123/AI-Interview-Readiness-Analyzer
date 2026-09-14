import axios from "axios";

const GITHUB_API = "https://api.github.com";

function authHeaders() {
  return process.env.GITHUB_TOKEN
    ? { Authorization: `token ${process.env.GITHUB_TOKEN}` }
    : {};
}

/**
 * Pulls a lightweight but meaningful signal set from a public GitHub profile.
 * Deliberately avoids cloning repos or reading full source — this stays fast
 * and works within unauthenticated rate limits for a demo.
 */
export async function analyzeGithubProfile(username) {
  const headers = authHeaders();

  const [{ data: profile }, { data: repos }] = await Promise.all([
    axios.get(`${GITHUB_API}/users/${username}`, { headers }),
    axios.get(`${GITHUB_API}/users/${username}/repos?per_page=100&sort=updated`, {
      headers,
    }),
  ]);

  const languageCounts = {};
  let totalStars = 0;
  let reposWithReadme = 0;
  let originalRepoCount = 0;

  for (const repo of repos) {
    if (repo.fork) continue;
    originalRepoCount += 1;
    totalStars += repo.stargazers_count || 0;
    if (repo.language) {
      languageCounts[repo.language] = (languageCounts[repo.language] || 0) + 1;
    }
  }

  // README presence check is capped to the 8 most recently updated original
  // repos to keep this fast — good enough signal without hammering the API.
  const sampleRepos = repos.filter((r) => !r.fork).slice(0, 8);
  await Promise.all(
    sampleRepos.map(async (repo) => {
      try {
        await axios.get(
          `${GITHUB_API}/repos/${username}/${repo.name}/readme`,
          { headers }
        );
        reposWithReadme += 1;
      } catch {
        // no README — not an error, just a signal
      }
    })
  );

  const topLanguages = Object.entries(languageCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([language, count]) => ({ language, count }));

  return {
    username,
    publicRepos: originalRepoCount,
    followers: profile.followers,
    accountCreated: profile.created_at,
    totalStars,
    topLanguages,
    readmeCoverage: sampleRepos.length
      ? Math.round((reposWithReadme / sampleRepos.length) * 100)
      : 0,
    recentRepoNames: sampleRepos.map((r) => r.name),
  };
}
