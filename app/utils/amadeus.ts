// @ts-ignore
import Amadeus from "amadeus";

export class AmadeusPlanner {
  private amadeus: Amadeus;

  constructor(clientId: string, clientSecret: string) {
    this.amadeus = new Amadeus({
      clientId: clientId,
      clientSecret: clientSecret,
    });
  }

  async getFlightOffers(
    origin: string,
    destination: string,
    departureDate: string,
    returnDate: string,
    adults: number = 1,
    children: number = 0,
    infants: number = 0,
    travelClass: string = "ECONOMY",
    maxPrice?: number,
    maxDuration?: number,
    currency: string = "USD"
  ) {
    /**
     * A function to get a list of flight offerings between two airports for a given date range, with optional parameters for the number of adults, children, infants, travel class, max price, max duration, and currency.
     *
     *
     * @param origin - The origin airport code (e.g. "BOS" for Boston)
     * @param destination - The destination airport code (e.g. "LAX" for Los Angeles)
     * @param departureDate - The departure date (e.g. "2025-07-01")
     * @param returnDate - The return date (e.g. "2025-07-08")
     * @param adults - The number of adults (default: 1)
     * @param children - The number of children (default: 0)
     * @param infants - The number of infants (default: 0)
     * @param travelClass - The travel class (default: "ECONOMY")
     * @param maxPrice - The maximum price for the flight (default: undefined)
     * @param maxDuration - The maximum duration for the flight (default: undefined)
     * @param currency - The currency for the flight (default: "USD")
     * @returns A object containing a list of flight offerings between two airports for a given date range, with optional parameters for the number of adults, children, infants, travel class, max price, max duration, and currency and along with a dictionary of the response abbreviations.
     */
    const searchParams: any = {
      origin: origin,
      destination: destination,
      departureDate: departureDate,
      returnDate: returnDate,
      adults: adults,
      children: children,
      infants: infants,
      travelClass: travelClass,
      currency: currency,
    };

    // Only adding optional parameters if they are provided
    if (maxPrice !== undefined) searchParams.maxPrice = maxPrice;
    if (maxDuration !== undefined) searchParams.maxDuration = maxDuration;

    const response = await this.amadeus.shopping.flightOffersSearch.get(
      searchParams
    );
    const flightOffers = response.data;
    const flightOffersContext = response.dictionaries; // Amadeus provides a dictionary in the response with about what the response abbreviation codes stand for (i.e. aircraft codes, currency codes, etc.)

    // Extract relevant flight information
    const processedOffers = flightOffers.map((offer: any) => ({
      id: offer.id,
      price: offer.price,
      itineraries: offer.itineraries,
      numberOfBookableSeats: offer.numberOfBookableSeats,
    }));

    // Process flightOffersContext to include airline and location information
    const processedOffersDictionary = {
      aircraft: flightOffersContext?.aircraft || {},
      airlines: flightOffersContext?.carriers || {},
      locations: flightOffersContext?.locations || {},
      currencies: flightOffersContext?.currencies || {},
    };

    return { processedOffers, processedOffersDictionary };
  }
}
