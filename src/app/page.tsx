import { ListingsSection } from "@/components/listings/ListingsSection";
import { getAllListings } from "@/services/listings-service";
import { getSellerProfile } from "@/services/seller-service";

const HomePage = async () => {
  const [listings, seller] = await Promise.all([
    getAllListings(),
    getSellerProfile("MarodelaR"),
  ]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <ListingsSection initialListings={listings} seller={seller} />
    </main>
  );
};

export default HomePage;
