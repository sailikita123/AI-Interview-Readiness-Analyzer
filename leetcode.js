import axios from "axios";

/**
 * LeetCode has no official public API, but its GraphQL endpoint serves
 * public profile stats with no auth required. This mirrors what the
 * profile page itself calls.
 */
export async function analyzeLeetcodeProfile(username) {
  const query = `
    query userStats($username: String!) {
      matchedUser(username: $username) {
        username
        submitStatsGlobal {
          acSubmissionNum {
            difficulty
            count
          }
        }
        profile {
          ranking
        }
      }
    }
  `;

  const { data } = await axios.post(
    "https://leetcode.com/graphql",
    { query, variables: { username } },
    { headers: { "Content-Type": "application/json" } }
  );

  const user = data?.data?.matchedUser;
  if (!user) {
    throw new Error(`LeetCode user "${username}" not found or profile is private`);
  }

  const counts = Object.fromEntries(
    user.submitStatsGlobal.acSubmissionNum.map((d) => [d.difficulty, d.count])
  );

  return {
    username: user.username,
    ranking: user.profile.ranking,
    solved: {
      easy: counts.Easy || 0,
      medium: counts.Medium || 0,
      hard: counts.Hard || 0,
      total: counts.All || 0,
    },
  };
}
