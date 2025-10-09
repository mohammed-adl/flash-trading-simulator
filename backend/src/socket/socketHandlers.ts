import { fetchUserPositions, buildWatchlistData } from "./stockService.js";
import { PRICES_UPDATE_INTERVAL } from "../config/constants.js";
import { Server, Socket } from "socket.io";

interface Holding {
  symbol: string;
  [key: string]: any;
}

export function handleConnection(io: Server, socket: Socket) {
  console.log("Client connected");

  let clientWatchlist: string[] = [];
  let userPositions: any = {};

  socket.join(socket.userId!);

  async function updateClientWatchlist() {
    const watchlistData = await buildWatchlistData(
      clientWatchlist,
      userPositions
    );

    io.to(socket.userId!).emit("stockUpdate", watchlistData);
  }

  socket.on("setWatchlist", async ({ holdings }: { holdings: Holding[] }) => {
    clientWatchlist = holdings.map((item) => item.symbol);
    userPositions = await fetchUserPositions(socket.userId!);

    console.log("Client connected with watchlist socket id", socket.id);
    await updateClientWatchlist();
  });

  const interval = setInterval(updateClientWatchlist, PRICES_UPDATE_INTERVAL);

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
}