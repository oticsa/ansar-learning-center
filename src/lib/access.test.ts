import { describe, expect, it } from "bun:test";
import { canEnterLessons } from "./access";

describe("student approval", () => {
  it("blocks students awaiting approval", () => expect(canEnterLessons({ is_active: false, approval_status: "pending" })).toBe(false));
  it("grants access after approval", () => expect(canEnterLessons({ is_active: true, approval_status: "approved" })).toBe(true));
  it("blocks rejected accounts", () => expect(canEnterLessons({ is_active: false, approval_status: "rejected" })).toBe(false));
  it("blocks deactivated approved accounts", () => expect(canEnterLessons({ is_active: false, approval_status: "approved" })).toBe(false));
});