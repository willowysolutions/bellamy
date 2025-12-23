import Banner from "../components/Banner";
import CategorySection from "@/components/home-category/categoryListing";
import BestSellers from "../components/bestSeller/BestSellers";
import Footer from "../components/Footer";
import CTAComponent from "@/components/CTAComponent";
import LatestList from "@/components/latest/LatestList";

export default function Homepage() {
  return (
    <div className="min-h-screen bg-white text-stone-900">
      {/* Hero */}
      <Banner />

      {/* Shop by Occasion */}
      <CategorySection />

      {/* Best Sellers */}
      <BestSellers />

      <LatestList />
      
      {/* CTA */}
      <CTAComponent />

      <Footer />
    </div>
  );
}