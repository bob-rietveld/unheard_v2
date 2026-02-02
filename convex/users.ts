import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/**
 * Get a user by email
 */
export const getByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

/**
 * Create a new user
 */
export const create = mutation({
  args: {
    name: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      throw new Error("User with this email already exists");
    }

    return await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      createdAt: Date.now(),
    });
  },
});

/**
 * Get or create a user
 */
export const getOrCreate = mutation({
  args: {
    name: v.string(),
    email: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existing) {
      return existing._id;
    }

    return await ctx.db.insert("users", {
      name: args.name,
      email: args.email,
      createdAt: Date.now(),
    });
  },
});
