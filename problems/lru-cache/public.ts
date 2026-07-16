// ========= //
// LRU Cache //
// ========= //

import type { SolutionEntry } from "../types.ts";

export const lruCache: SolutionEntry =
{
  title: "146. LRU Cache",

  link: "https://leetcode.com/problems/lru-cache/",

  difficulty: "Medium",

  description: [
    "Design a data structure that follows the constraints of a [Least Recently Used (LRU) cache](https://en.wikipedia.org/wiki/Cache_replacement_policies#LRU).",
    "Implement the `LRUCache` class:",
    "`LRUCache(int capacity)` Initialize the LRU cache with positive size `capacity`.",
    "`int get(int key)` Return the value of the `key` if the key exists, otherwise return `-1`.",
    "`void put(int key, int value)` Update the value of the `key` if the `key` exists. Otherwise, add the `key-value` pair to the cache. If the number of keys exceeds the `capacity` from this operation, evict the least recently used key.",
    "The functions `get` and `put` must each run in `O(1)` average time complexity.",
  ],

  examples: [
    {
      input: "`[\"LRUCache\", \"put\", \"put\", \"get\", \"put\", \"get\", \"put\", \"get\", \"get\", \"get\"]\n[[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]`",
      output: "`[null, null, null, 1, null, -1, null, -1, 3, 4]`",
      explanation: "LRUCache lRUCache = new LRUCache(2); lRUCache.put(1, 1); // cache is {1=1} lRUCache.put(2, 2); // cache is {1=1, 2=2} lRUCache.get(1); // return 1 lRUCache.put(3, 3); // LRU key was 2, evicts key 2, cache is {1=1, 3=3} lRUCache.get(2); // returns -1 (not found) lRUCache.put(4, 4); // LRU key was 1, evicts key 1, cache is {4=4, 3=3} lRUCache.get(1); // return -1 (not found) lRUCache.get(3); // return 3 lRUCache.get(4); // return 4",
    },
  ],

  constraints: [
    "`1 <= capacity <= 3000`.",
    "`0 <= key <= 10⁴`.",
    "`0 <= value <= 10⁵`.",
    "At most `2 * 10⁵` calls will be made to `get` and `put`.",
  ],

  topics: [
    "Hash Table", "Linked List", "Design", "Doubly-Linked List",
  ],

  companies: [
    "Amazon", "Google", "Apple", "TikTok", "Microsoft", "Bloomberg",
  ],

  hints: [
    "O(1) get and put rules out a plain list you'd have to scan, so what structure gives you O(1) lookups by key while still letting you track usage order?",
    "You need to know both 'is this key here' and 'which key was used longest ago' — is there a built-in structure that keeps insertion order and lets you move an existing item to the end cheaply?",
    "Use `collections.OrderedDict`: on `get`, if the key exists call `move_to_end(key)` and return its value (else -1); on `put`, set the key (moving it to the end if it already existed), then if `len(dict) > capacity`, call `popitem(last=False)` to evict the oldest.",
  ],

  starterCode: `import collections

class LRUCache:
    def __init__(self, capacity: int):


    def get(self, key: int) -> int:


    def put(self, key: int, value: int) -> None:


# Your LRUCache object will be instantiated and called as such:
# obj = LRUCache(capacity)
# param_1 = obj.get(key)
# obj.put(key,value)`,

  code: `'''
u: a lot of moving parts to this but an lru cache is esentially removing the key-value pair with the least
    amount of used times. in this case the least amount of used times would be the first thing in our queue
p: we HAVE to do this in o(1) time so no list, etc. our best bet is using the collections built in dic methods
    this question deals with hash-mapping in general so it would be easiest for us instead of making a linked list
    for init, we would initialize capacity to capacity so it has the size, then create our ordered dic
    for get, if key doesnt exist return -1, then update the lru cache to make it the most used (end)
    for put,  add the key value pair to the cache, then check if it's full. if it is remove the most last thing
'''
import collections

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.dic = collections.OrderedDict()

    def get(self, key: int) -> int:
        # if key doesn't exist, return -1
        if key not in self.dic:
            return -1

        # update key since we just used it
        self.dic.move_to_end(key)
        return self.dic[key]

    def put(self, key: int, value: int) -> None:
        # update the key value if it exists
        if key in self.dic:
            self.dic.move_to_end(key)

        self.dic[key] = value

        if self.capacity < len(self.dic):
            self.dic.popitem(False)

# Your LRUCache object will be instantiated and called as such:
# obj = LRUCache(capacity)
# param_1 = obj.get(key)
# obj.put(key,value)`,
};
