import { Github, Twitter, Facebook } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-primary border-t border-white/10 text-white pt-10 pb-6 mt-auto relative z-10">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold text-accent mb-4">PrimeCompare</h3>
            <p className="text-text-muted text-sm">
              Your ultimate destination for tech comparisons. We use AI to bring
              you the most accurate review insights.
            </p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-white">Quick Links</h4>
            <ul className="space-y-2 text-sm text-text-muted">
              <li>
                <a href="/products" className="hover:text-accent transition">
                  Products
                </a>
              </li>
              <li>
                <a href="/compare" className="hover:text-accent transition">
                  Compare
                </a>
              </li>
              <li>
                <a href="/login" className="hover:text-accent transition">
                  Login
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-white">Categories</h4>
            <ul className="space-y-2 text-sm text-text-muted">
              <li>
                <a
                  href="/products?category=Smartphone"
                  className="hover:text-accent transition"
                >
                  Smartphones
                </a>
              </li>
              <li>
                <a
                  href="/products?category=Laptop"
                  className="hover:text-accent transition"
                >
                  Laptops
                </a>
              </li>
              <li>
                <a
                  href="/products?category=Headphone"
                  className="hover:text-accent transition"
                >
                  Headphones
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-white">Connect With Us</h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-text-muted hover:text-accent transition transform hover:scale-110"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-text-muted hover:text-accent transition transform hover:scale-110"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-text-muted hover:text-accent transition transform hover:scale-110"
              >
                <Github size={20} />
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-white/10 pt-6 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} PrimeCompare. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
