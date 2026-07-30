// ======================= //
// LRU Cache: Hidden Tests //
// ======================= //

import type { DesignHiddenProblem } from "../types.ts";

export const lruCacheHidden: DesignHiddenProblem =
{
  kind: "design",
  className: "LRUCache",
  language: "python",
  examples: [
    {
      operations: ["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"],
      args: [[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]],
      expected: [null, null, null, 1, null, -1, null, -1, 3, 4],
    },
  ],
  // Covers: the canonical example (eviction on overflow), a capacity-1 cache
  // (evicts on the very next insert), updating an existing key (must refresh
  // its recency without evicting anything extra), and get calls on keys that
  // were never inserted (including on an empty cache).
  tests: [
    {
      operations: ["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"],
      args: [[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]],
      expected: [null, null, null, 1, null, -1, null, -1, 3, 4],
    },
    {
      operations: ["LRUCache", "put", "get", "put", "get", "get"],
      args: [[1], [1, 1], [1], [2, 2], [1], [2]],
      expected: [null, null, 1, null, -1, 2],
    },
    {
      operations: ["LRUCache", "put", "put", "put", "put", "get", "get", "get"],
      args: [[2], [1, 1], [2, 2], [1, 10], [3, 3], [2], [1], [3]],
      expected: [null, null, null, null, null, -1, 10, 3],
    },
    {
      operations: ["LRUCache", "get", "put", "get", "get"],
      args: [[2], [1], [1, 1], [2], [1]],
      expected: [null, -1, null, -1, 1],
    },
  ],
};
