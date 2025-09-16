import { reqApi } from "@/lib/axios";

export async function handleGetProfile() {
  return await reqApi(`/profiles`);
}

export async function handleCreateProfile(formData) {
  return await reqApi(`/profiles`, {
    method: "POST",
    body: formData,
  });
}

export async function handleResetProfile() {
  return await reqApi(`/profiles/reset`, {
    method: "PUT",
  });
}
