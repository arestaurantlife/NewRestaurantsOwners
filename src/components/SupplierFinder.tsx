import { useState } from "react";
import { MapPin, Search, Truck, Package, Building, Phone, Star, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const categories = [
  { name: "Food Distributors", icon: Truck, count: "2,400+" },
  { name: "Kitchen Equipment", icon: Package, count: "850+" },
  { name: "Furniture & Décor", icon: Building, count: "620+" },
  { name: "POS Systems", icon: Phone, count: "180+" },
];

const featuredSuppliers = [
  {
    name: "Sysco Corporation",
    category: "Food Distributor",
    rating: 4.8,
    description: "Full-service food distribution with nationwide coverage",
  },
  {
    name: "WebstaurantStore",
    category: "Equipment & Supplies",
    rating: 4.7,
    description: "Online restaurant equipment and supplies retailer",
  },
  {
    name: "US Foods",
    category: "Food Distributor",
    rating: 4.6,
    description: "Comprehensive foodservice distribution network",
  },
];

const SupplierFinder = () => {
  const [zipCode, setZipCode] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search logic
    console.log("Searching for suppliers in:", zipCode);
  };

  return (
    <section className="py-20 bg-cream relative">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <span className="text-gold font-semibold tracking-wider uppercase text-sm">
              Supplier Network
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-charcoal mt-4 mb-6">
              Find Everything You Need, Near You
            </h2>
            <p className="text-lg text-charcoal/70 mb-8">
              Enter your zip code and discover trusted suppliers for everything your 
              restaurant needs—from food distributors to kitchen equipment, furniture, 
              and technology solutions.
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="flex gap-3 mb-10">
              <div className="relative flex-1">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-charcoal/40" />
                <Input
                  type="text"
                  placeholder="Enter your zip code"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  className="pl-12 h-14 text-lg border-warm-gray/30 focus:border-wine focus:ring-wine"
                />
              </div>
              <Button type="submit" variant="hero" size="lg" className="h-14 px-8">
                <Search className="w-5 h-5 mr-2" />
                Search
              </Button>
            </form>

            {/* Categories */}
            <div className="grid grid-cols-2 gap-4">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-wine/10 rounded-lg flex items-center justify-center group-hover:bg-wine/20 transition-colors">
                      <category.icon className="w-5 h-5 text-wine" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-charcoal text-sm">
                        {category.name}
                      </h4>
                      <p className="text-xs text-charcoal/50">{category.count} suppliers</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Featured Suppliers */}
          <div className="bg-white rounded-2xl p-8 shadow-elegant">
            <h3 className="text-xl font-display font-bold text-charcoal mb-6">
              Featured National Suppliers
            </h3>

            <div className="space-y-4">
              {featuredSuppliers.map((supplier, index) => (
                <div
                  key={index}
                  className="border border-warm-gray/20 rounded-xl p-5 hover:border-wine/30 hover:shadow-md transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-charcoal group-hover:text-wine transition-colors">
                        {supplier.name}
                      </h4>
                      <p className="text-sm text-charcoal/60">{supplier.category}</p>
                    </div>
                    <div className="flex items-center gap-1 text-gold">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium">{supplier.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-charcoal/70 mb-3">
                    {supplier.description}
                  </p>
                  <div className="flex items-center text-wine text-sm font-medium group-hover:translate-x-1 transition-transform">
                    View Details
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-warm-gray/20">
              <Button variant="ghost" className="w-full text-wine hover:text-wine/80 hover:bg-wine/5">
                Browse All Suppliers
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="mt-16 grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-display font-bold text-wine mb-2">4,000+</div>
            <p className="text-charcoal/70">Verified Suppliers</p>
          </div>
          <div>
            <div className="text-4xl font-display font-bold text-wine mb-2">50</div>
            <p className="text-charcoal/70">States Covered</p>
          </div>
          <div>
            <div className="text-4xl font-display font-bold text-wine mb-2">15+</div>
            <p className="text-charcoal/70">Product Categories</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SupplierFinder;
