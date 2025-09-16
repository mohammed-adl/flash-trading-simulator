import { reqApi } from "@/lib";

export async function handleSignUp(formData) {
  return await reqApi("/auth/signup", {
    method: "POST",
    body: formData,
  });
}

export async function handleLogIn(formData) {
  return await reqApi("/auth/login", {
    method: "POST",
    body: formData,
  });
}

export async function handleLogOut() {
  return await reqApi("/auth/logout", {
    method: "DELETE",
  });
}

export async function handleRefreshToken() {
  return await reqApi("/auth/refresh-token", {
    method: "POST",
  });
}

export async function handleSendPasscode(formData) {
  return await reqApi("/auth/reset-password", {
    method: "POST",
    body: formData,
  });
}

export async function handleVerifyPasscode(formData) {
  return await reqApi("/auth/reset-password/verify", {
    method: "POST",
    body: formData,
  });
}

export async function handleResetPassword(formData) {
  return await reqApi("/auth/reset-password/reset", {
    method: "POST",
    body: formData,
  });
}

export async function handleUpdatePassword(formData) {
  return await reqApi("/auth/update-password", {
    method: "POST",
    body: formData,
  });
}
