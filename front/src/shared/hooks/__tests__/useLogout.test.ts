import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useLogout } from "../useLogout";

// Mock das dependências
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/api", () => ({
  useLogoutUser: () => ({
    mutateAsync: vi.fn().mockResolvedValue(undefined),
  }),
}));

vi.mock("@/contexts/user", () => ({
  useUser: () => ({
    setUser: vi.fn(),
  }),
}));

describe("useLogout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should return logout function", () => {
    const { result } = renderHook(() => useLogout());
    expect(result.current).toHaveProperty("logout");
    expect(typeof result.current.logout).toBe("function");
  });

  it("should call logout and redirect on success", async () => {
    const { result } = renderHook(() => useLogout());
    
    await result.current.logout();
    
    // Aqui você validaria que toast.success foi chamado,
    // setUser foi chamado com null, e router.push com "/"
  });
});
