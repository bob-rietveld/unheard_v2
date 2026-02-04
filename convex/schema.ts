import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    createdAt: v.number(),
  }).index("by_email", ["email"]),

  personas: defineTable({
    name: v.string(),
    description: v.string(),
    attributes: v.object({
      age: v.optional(v.number()),
      gender: v.optional(v.string()),
      occupation: v.optional(v.string()),
      interests: v.optional(v.array(v.string())),
      painPoints: v.optional(v.array(v.string())),
      goals: v.optional(v.array(v.string())),
    }),
    userId: v.id("users"),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_created", ["createdAt"]),

  experiments: defineTable({
    title: v.string(),
    description: v.string(),
    prompt: v.string(),
    personas: v.array(v.id("personas")),
    status: v.union(
      v.literal("draft"),
      v.literal("running"),
      v.literal("completed"),
      v.literal("failed")
    ),
    userId: v.id("users"),
    createdAt: v.number(),
    completedAt: v.optional(v.number()),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_created", ["createdAt"]),

  responses: defineTable({
    experimentId: v.id("experiments"),
    personaId: v.id("personas"),
    content: v.string(),
    sentiment: v.optional(
      v.object({
        score: v.number(), // -1 to 1
        label: v.string(), // "positive", "negative", "neutral"
      })
    ),
    metadata: v.optional(
      v.object({
        tokens: v.optional(v.number()),
        duration: v.optional(v.number()),
        model: v.optional(v.string()),
      })
    ),
    createdAt: v.number(),
  })
    .index("by_experiment", ["experimentId"])
    .index("by_persona", ["personaId"])
    .index("by_created", ["createdAt"]),
});
