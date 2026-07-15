// ========= //
// Min Stack //
// ========= //

import type { SolutionEntry } from "../types.ts";

export const minStack: SolutionEntry =
{
  title: "155. Min Stack",

  link: "https://leetcode.com/problems/min-stack/",

  difficulty: "Medium",

  description: [
    "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.",
    "Implement the `MinStack` class:",
    "`MinStack()` initializes the stack object.",
    "`void push(int value)` pushes the element `value` onto the stack.",
    "`void pop()` removes the element on the top of the stack.",
    "`int top()` gets the top element of the stack.",
    "`int getMin()` retrieves the minimum element in the stack.",
    "You must implement a solution with `O(1)` time complexity for each function.",
  ],

  examples: [
    {
      input: "`[\"MinStack\",\"push\",\"push\",\"push\",\"getMin\",\"pop\",\"top\",\"getMin\"]\n[[],[-2],[0],[-3],[],[],[],[]]`",
      output: "`[null,null,null,null,-3,null,0,-2]`",
      explanation: "MinStack minStack = new MinStack(); minStack.push(-2); minStack.push(0); minStack.push(-3); minStack.getMin(); // return -3 minStack.pop(); minStack.top(); // return 0 minStack.getMin(); // return -2",
    },
  ],

  constraints: [
    "`-2³¹ <= val <= 2³¹ - 1`.",
    "Methods `pop`, `top` and `getMin` operations will always be called on non-empty stacks.",
    "At most `3 * 10⁴` calls will be made to `push`, `pop`, `top`, and `getMin`.",
  ],

  topics: [
    "Stack", "Design",
  ],

  companies: [
    "Amazon", "Google", "Microsoft", "Meta",
  ],

  starterCode: `class MinStack:
    def __init__(self):


    def push(self, val: int) -> None:


    def pop(self) -> None:


    def top(self) -> int:


    def getMin(self) -> int:


# Your MinStack object will be instantiated and called as such:
# obj = MinStack()
# obj.push(val)
# obj.pop()
# param_3 = obj.top()
# param_4 = obj.getMin()`,

  code: `'''
we can implement our stack functions using a list and stack functions like pop
since we always need to know the min val due to the getmin function we can use a tuple for
each value. (value, min_value) to keep track
this can be viewed when in list form as [-1] which is top of stack and [0 or 1] which is
either 0 = value, or 1 = min_value
'''
class MinStack:
    def __init__(self):
        # create a list we can use in all functions
        self.stack = []

    def push(self, val: int) -> None:
        # if stack is empty append the val as value and min_value
        if not self.stack:
            self.stack.append((val, val))
            return

        # get the minimum value by getting 2nd part of tuple
        min_val = self.stack[-1][1]
        # append the new val and check for if it's the minium value
        self.stack.append((val, min(val, min_val)))

    def pop(self) -> None:
        # just pop
        self.stack.pop()

    def top(self) -> int:
        # top element is the latest val we pushed onto stack
        return self.stack[-1][0]

    def getMin(self) -> int:
        # get the minimum val which we have been keeping track of
        return self.stack[-1][1]

# Your MinStack object will be instantiated and called as such:
# obj = MinStack()
# obj.push(val)
# obj.pop()
# param_3 = obj.top()
# param_4 = obj.getMin()`,
};
