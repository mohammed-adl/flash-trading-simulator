import { schedulePriceFetch } from "./priceScheduler.js";

export async function scheduleAllJobs() {
  await schedulePriceFetch();
}
