import { createMcpHandler } from "@vercel/mcp-adapter";
import { z } from "zod";
import { AmadeusPlanner } from "@/app/utils/amadeus";

if (!process.env.AMADEUS_CLIENT_ID || !process.env.AMADEUS_CLIENT_SECRET) {
  throw new Error(
    "AMADEUS_CLIENT_ID and AMADEUS_CLIENT_SECRET environment variables are required"
  );
}

try {
  const amadeus = new AmadeusPlanner(
    process.env.AMADEUS_CLIENT_ID,
    process.env.AMADEUS_CLIENT_SECRET
  );
} catch (error) {
  console.error(error);
}

const handler = createMcpHandler(
  (server) => {
    server.tool(
      "roll_dice",
      "Rolls an N-sided die",
      {
        sides: z.number().int().min(2),
      },
      async ({ sides }) => {
        const value = 1 + Math.floor(Math.random() * sides);
        return {
          content: [{ type: "text", text: `🎲 You rolled a ${value}!` }],
        };
      }
    );

    // server.resource(
    //   "airport",
    //   "schema://airport-<airport-code>",
    //   async (uri, extra) => {
    //     const airportCode = uri.path.split("-")[1];
    //     const amadeusResponse = await amadeus.citySearch(airportCode);
    //   }
    // );
  },
  {
    // Optional server options
    capabilities: {
      resources: {
        airport: {
          description: "Airport resource", // To be altered,
        },
      },
      tools: {
        roll_dice: {
          description: "Rolls an N-sided die", // To be altered,
        },
      },
    },
  },
  {
    // Optional redis config
    redisUrl: process.env.REDIS_URL,
    basePath: "/api", // this needs to match where the [transport] is located.
    maxDuration: 60,
    verboseLogs: true,
  }
);

export { handler as GET, handler as POST };
