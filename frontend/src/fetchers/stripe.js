import { reqApi } from "@/lib";

export async function handleCreatePayment(amount) {
  return await reqApi(`/stripe/create-payment`, {
    method: "POST",
    body: { amount },
  });
}
