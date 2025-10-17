import { reqApi } from "@/lib";

export async function handleSendMessage(message, convo) {
  console.log(convo);
  return await reqApi(`/AI/sendMessage`, {
    method: "POST",
    body: { message, convo },
  });
}
