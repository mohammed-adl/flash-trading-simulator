import { reqApi } from "@/lib";

export async function handleDeposit(amount) {
  return await reqApi(`/transactions/deposit`, {
    method: "POST",
    body: { amount },
  });
}

export async function handleWithdrawal(amount) {
  return await reqApi(`/transactions/withdraw`, {
    method: "POST",
    body: { amount },
  });
}
