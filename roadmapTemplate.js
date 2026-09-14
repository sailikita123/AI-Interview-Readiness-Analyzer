/**
 * The base topic sequence for a 30-day DSA + fundamentals roadmap.
 * This is intentionally hardcoded rather than LLM-generated — it's the
 * backbone that keeps the roadmap pedagogically sound (e.g. Arrays
 * before Two Pointers, Trees before Graphs). The LLM's job (see
 * llm.js:personalizeRoadmap) is only to add focus notes and swap in
 * role-specific topics, not to invent the sequence from scratch.
 */
export function baseRoadmap() {
  const topics = [
    "Arrays & Time Complexity",
    "Strings & Two Pointers",
    "HashMaps & Sets",
    "Sliding Window",
    "Binary Search",
    "Recursion Basics",
    "Sorting Algorithms",
    "Linked Lists",
    "Stacks & Queues",
    "Trees: Traversals",
    "Trees: BST Operations",
    "Heaps & Priority Queues",
    "Backtracking",
    "Graphs: BFS/DFS",
    "Graphs: Shortest Path",
    "Dynamic Programming: 1D",
    "Dynamic Programming: 2D",
    "Greedy Algorithms",
    "Tries",
    "Union-Find",
    "SQL: Joins & Aggregations",
    "SQL: Window Functions",
    "System Design Basics",
    "System Design: Scaling",
    "OOP & Design Patterns",
    "Behavioral Prep: STAR Method",
    "Resume + GitHub Polish",
    "Mock Interview: DSA",
    "Mock Interview: System Design",
    "Full Review + Weak Spot Retry",
  ];

  return topics.map((topic, i) => ({
    day: i + 1,
    topic,
  }));
}
