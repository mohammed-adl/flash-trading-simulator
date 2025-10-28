import { fetchUserPositions, buildWatchlistData } from "./assetService.js";
export function handleConnection(io, socket) {
    console.log("Client connected");
    let clientWatchlist = [];
    let userPositions = {};
    socket.join(socket.userId);
    async function updateClientWatchlist() {
        const watchlistData = await buildWatchlistData(clientWatchlist, userPositions);
        io.to(socket.userId).emit("assetUpdate", watchlistData);
    }
    socket.on("setWatchlist", async ({ holdings }) => {
        clientWatchlist = holdings.map((item) => item.symbol);
        userPositions = await fetchUserPositions(socket.userId);
        console.log("Client connected with watchlist socket id", socket.id);
        await updateClientWatchlist();
    });
    socket.on("disconnect", () => {
        console.log("Client disconnected");
    });
}
//# sourceMappingURL=socketHandlers.js.map