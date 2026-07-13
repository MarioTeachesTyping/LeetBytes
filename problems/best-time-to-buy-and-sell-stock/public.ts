// =============================== //
// Best Time to Buy and Sell Stock //
// =============================== //

import type { SolutionEntry } from "../types.ts";

export const bestTimeToBuyAndSellStock: SolutionEntry =
{
  title: "121. Best Time to Buy and Sell Stock",

  link: "https://leetcode.com/problems/best-time-to-buy-and-sell-stock/",

  difficulty: "Easy",

  description: [
    "You are given an array `prices` where `prices[i]` is the price of a given stock on the `ith` day.",
    "You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock.",
    "Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return `0`.",
  ],

  examples: [
    {
      input: "`prices = [7,1,5,3,6,4]`",
      output: "`5`",
      explanation: "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5. Note that buying on day 2 and selling on day 1 is not allowed because you must buy before you sell.",
    },
    {
      input: "`prices = [7,6,4,3,1]`",
      output: "`0`",
      explanation: "In this case, no transactions are done and the max profit = 0.",
    },
  ],

  constraints: [
    "`1 <= prices.length <= 10^5`.",
    "`0 <= prices[i] <= 10^4`.",
  ],

  topics: [
    "Array", "Dynamic Programming",
  ],

  companies: [
    "Amazon", "Google", "Bloomberg", "Meta", "Microsoft", "Apple",
  ],

  starterCode: `class Solution:
    def maxProfit(self, prices: List[int]) -> int:
        `,

  code: `class Solution:
    def maxProfit(self, prices: List[int]) -> int:

        '''
        first instinct is two pointer
        we need to buy low and sell high and left and right pointers can
        simulate that: left is buy and right is sell
        we can do this using a while loop and keeping track of max profit (max())
        '''
        buy = 0
        sell = 1
        max_profit = 0

        # keep going until sell reaches end of prices
        while sell < len(prices):

            # if sell is higher than buy, we keep track of it in max profit
            if prices[buy] < prices[sell]:
                profit = prices[sell] - prices[buy]
                max_profit = max(max_profit, profit)
            # if sell is lower than buy, move left to right pointer
            else:
                buy = sell

            # update right pointer
            sell += 1

        return max_profit`,
};
