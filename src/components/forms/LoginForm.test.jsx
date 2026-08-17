import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { AuthContext } from "../../context/AuthContext";
import LoginForm from "./LoginForm";

function renderLogin(login = vi.fn()) {
  render(
    <AuthContext.Provider value={{ login }}>
      <LoginForm />
    </AuthContext.Provider>,
  );
  return login;
}

describe("LoginForm", () => {
  it("fills the demo administrator credentials", async () => {
    renderLogin();
    await userEvent.click(
      screen.getByRole("button", { name: /fill demo credentials/i }),
    );
    expect(screen.getByLabelText(/email address/i)).toHaveValue(
      "admin@movienet.com",
    );
    expect(screen.getByLabelText(/^password$/i)).toHaveValue("admin123");
  });

  it("shows an authentication error returned by the login service", async () => {
    const login = renderLogin(
      vi
        .fn()
        .mockResolvedValue({
          ok: false,
          message: "Email or password is incorrect.",
        }),
    );
    fireEvent.change(screen.getByLabelText(/email address/i), {
      target: { value: "member@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/^password$/i), {
      target: { value: "wrong123" },
    });
    fireEvent.submit(
      screen.getByRole("button", { name: /sign in/i }).closest("form"),
    );

    await waitFor(() =>
      expect(login).toHaveBeenCalledWith("member@example.com", "wrong123"),
    );
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Email or password is incorrect.",
    );
  });
});
