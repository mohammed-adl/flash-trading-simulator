import { priceQueue } from "./priceQueue.js";
import { PRICES_UPDATE_INTERVAL } from "../../config/constants.js";

export async function schedulePriceFetch() {
  await priceQueue.add(
    "fetchAllPrices",
    {},
    {
      repeat: { every: PRICES_UPDATE_INTERVAL },
      removeOnComplete: true,
      removeOnFail: false,
    }
  );

  console.log(
    `📆 Scheduled price fetch every ${PRICES_UPDATE_INTERVAL / 1000}s`
  );
}
