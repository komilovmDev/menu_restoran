"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingBag, Menu, ChevronLeft, ChevronRight, Instagram, Phone, MapPin, MessageSquare } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useMobile } from "@/hooks/use-mobile";

// Menu data
const menuData = {
  starters: [
    {
      id: 1,
      name: "River Mezze Platter",
      description: "Selection of hummus, muhammara, baba ganoush with warm pita",
      price: 18,
      image: "https://www.vmcdn.ca/f/files/victoriatimescolonist/json/2023/08/web1_akis.mideastappetizers.jpg",
      position: { x: 10, y: 15 },
      size: "medium",
    },
    {
      id: 2,
      name: "Seared Scallops",
      description: "Pan-seared scallops with citrus reduction and microgreens",
      price: 22,
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn=9GcTHG6GbFZ3A5-outFSiBH1VSWkguPRL_CF1oA&s",
      position: { x: 60, y: 30 },
      size: "small",
    },
    {
      id: 3,
      name: "Stuffed Vine Leaves",
      description: "Traditional dolma with aromatic rice and herbs",
      price: 16,
      image: "https://encrypted-tbn0.gstatic.com/images?q=9GcQWGd6pddh2BzhhK4rXg2kKKNzPw-nVCIUCgA&s",
      position: { x: 25, y: 60 },
      size: "large",
    },
    {
      id: 4,
      name: "Grilled Shrimp Skewers",
      description: "Juicy grilled shrimp served with a tangy lemon dip",
      price: 20,
      image: "https://www.cookedbyjulie.com/wp-content/uploads/2022/07/bbq-grilled-shrimp-skewers-one-500x500.jpg",
      position: { x: 70, y: 10 },
      size: "medium",
    },
    {
      id: 5,
      name: "Crispy Calamari",
      description: "Golden fried calamari served with spicy marinara sauce",
      price: 15,
      image: "https://i0.wp.com/www.russianfilipinokitchen.com/wp-content/uploads/2015/04/crispy-fried-calamari-01.jpg",
      position: { x: 50, y: 50 },
      size: "small",
    },
    {
      id: 6,
      name: "Baked Feta with Olives",
      description: "Baked feta cheese topped with olives and fresh herbs",
      price: 17,
      image: "https://encrypted-tbn0.gstatic.com/images?q=9GcTlm4xX9fbwP4XknBCA_CXPxZ1Iu3W8NWFqIw&s",
      position: { x: 30, y: 25 },
      size: "medium",
    },
    {
      id: 7,
      name: "Lamb Kofta",
      description: "Grilled lamb kofta served with yogurt dip and grilled vegetables",
      price: 21,
      image: "https://encrypted-tbn0.gstatic.com/images?q=9GcQwPoWHXsQcuV-pQK8UwJjcDplYw4oQl1oKvw&s",
      position: { x: 80, y: 40 },
      size: "large",
    },
    {
      id: 8,
      name: "Hummus with Lamb",
      description: "Creamy hummus topped with spiced lamb and pine nuts",
      price: 19,
      image: "https://encrypted-tbn0.gstatic.com/images?q=9GcTUz6RCyVK3zzfGhSKVPJAmauEHgu5uHupnNQ&s",
      position: { x: 60, y: 60 },
      size: "medium",
    },
    {
      id: 9,
      name: "Baba Ganoush",
      description: "Smoky roasted eggplant dip with tahini and olive oil",
      price: 14,
      image: "https://foolproofliving.com/wp-content/uploads/2023/08/baba-ghanoush-recipe.jpg",
      position: { x: 40, y: 45 },
      size: "small",
    },
    {
      id: 10,
      name: "Spinach and Cheese Pie",
      description: "Flaky pastry filled with spinach, feta cheese, and herbs",
      price: 17,
      image: "https://encrypted-tbn0.gstatic.com/images?q=9GcQsFrfjom9BHlKjHpHnZhesiL8wCg7AQ9i7ZQ&s",
      position: { x: 15, y: 35 },
      size: "large",
    },
    {
      id: 11,
      name: "Chicken Shawarma",
      description: "Sliced chicken shawarma served with garlic sauce and pickles",
      price: 18,
      image: "https://encrypted-tbn0.gstatic.com/images?q=9GcShfgrkPEd2ZFEw9F0w13oZYaGAv9t5zQA6kw&s",
      position: { x: 50, y: 20 },
      size: "medium",
    },
    {
      id: 12,
      name: "Falafel",
      description: "Crispy fried falafel balls served with tahini dipping sauce",
      price: 13,
      image: "https://encrypted-tbn0.gstatic.com/images?q=9GcQf2xzoSfpFTAZgC2xdbrca3o2Ux92Tnvav0w&s",
      position: { x: 70, y: 55 },
      size: "small",
    },
  ],
  mains: [
    {
      id: 4,
      name: "Grilled Sea Bass",
      description: "Whole sea bass with preserved lemon, herbs and seasonal vegetables",
      price: 34,
      image: "https://encrypted-tbn0.gstatic.com/images?q=9GcRJ3p-pkbsnuQ4UHopsjXMlW2zYL29Q-ihrHA&s",
      position: { x: 15, y: 20 },
      size: "large",
    },
    {
      id: 5,
      name: "Slow-Cooked Lamb",
      description: "12-hour braised lamb shoulder with saffron rice and pine nuts",
      price: 38,
      image: "https://images.immediate.co.uk/production/volatile/sites/30/2023/12/Slow-cooker-lamb-shoulder-22893eb.jpg",
      position: { x: 55, y: 15 },
      size: "medium",
    },
    {
      id: 6,
      name: "Vegetable Tagine",
      description: "Seasonal vegetables and chickpeas in aromatic spices with couscous",
      price: 26,
      image: "https://encrypted-tbn0.gstatic.com/images?q=9GcTE4QSYl-v68zj96srh7TKqWOBQqWtx3KXu4A&s",
      position: { x: 70, y: 60 },
      size: "small",
    },
    {
      id: 7,
      name: "Chargrilled Prawns",
      description: "Jumbo prawns with garlic, herbs and lemon butter sauce",
      price: 32,
      image: "https://encrypted-tbn0.gstatic.com/images?q=9GcSGvWvnrg35y-_fVLJvQegQD3WGBBi6JylJ5w&s",
      position: { x: 30, y: 70 },
      size: "medium",
    },
  ],
  desserts: [
    {
      id: 8,
      name: "Baklava Selection",
      description: "Assortment of traditional baklava with pistachios and honey",
      price: 14,
      image: "https://encrypted-tbn0.gstatic.com/images?q=9GcSfrw06H0fKhOXmW3PVwQMysob_WZiN48IJAA&s",
      position: { x: 20, y: 30 },
      size: "medium",
    },
    {
      id: 9,
      name: "Saffron Rice Pudding",
      description: "Creamy rice pudding infused with saffron and rose water",
      price: 12,
      image: "https://www.unicornsinthekitchen.com/wp-content/uploads/2023/03/Sholeh-Zard-Persian-saffron-rice-pudding-sq.jpg",
      position: { x: 60, y: 50 },
      size: "large",
    },
  ],
  drinks: [
    {
      id: 10,
      name: "Pomegranate Spritz",
      description: "Fresh pomegranate juice with sparkling water and mint",
      price: 9,
      image: "https://encrypted-tbn0.gstatic.com/images?q=9GcR0sWWKNYliGxqUYxgrHN6_APXkr3zYUkZLSQ&s",
      position: { x: 15, y: 40 },
      size: "small",
    },
    {
      id: 11,
      name: "Arak Sour",
      description: "Traditional arak with fresh lemon and orange blossom",
      price: 14,
      image: "https://encrypted-tbn0.gstatic.com/images?q=9GcRZeqtmL4D4cstMEsd2pUay3w1hle9iNfmQ9g&s",
      position: { x: 50, y: 20 },
      size: "medium",
    },
    {
      id: 12,
      name: "Turkish Coffee",
      description: "Traditional finely ground coffee with cardamom",
      price: 6,
      image: "https://encrypted-tbn0.gstatic.com/images?q=9GcTqfYX1VL27sHpYgOlQtRanOe7fzxSXFwhcPA&s",
      position: { x: 70, y: 70 },
      size: "large",
    },
  ],
  salads: [
    {
      id: 13,
      name: "Fattoush Salad",
      description: "Crispy pita, cucumber, tomato, and sumac dressing",
      price: 12,
      image: "https://encrypted-tbn0.gstatic.com/images?q=9GcQf2xzoSfpFTAZgC2xdbrca3o2Ux92Tnvav0w&s",
      position: { x: 20, y: 20 },
      size: "medium",
    },
  ],
  soups: [
    {
      id: 14,
      name: "Lentil Soup",
      description: "Hearty lentil soup with carrots and spices",
      price: 10,
      image: "https://encrypted-tbn0.gstatic.com/images?q=9GcQf2xzoSfpFTAZgC2xdbrca3o2Ux92Tnvav0w&s",
      position: { x: 30, y: 30 },
      size: "small",
    },
  ],
  sides: [
    {
      id: 15,
      name: "Roasted Vegetables",
      description: "Seasonal vegetables roasted with olive oil and herbs",
      price: 8,
      image: "https://encrypted-tbn0.gstatic.com/images?q=9GcQf2xzoSfpFTAZgC2xdbrca3o2Ux92Tnvav0w&s",
      position: { x: 40, y: 40 },
      size: "small",
    },
  ],
};

const colors = {
  primary: "#0E7F78",
  dark: "#151615",
  light: "#F8F7F1",
};

const categories = [
  { id: "starters", name: "Starters", icon: "🍽️" },
  { id: "mains", name: "Mains", icon: "🍳" },
  { id: "desserts", name: "Desserts", icon: "🍰" },
  { id: "drinks", name: "Drinks", icon: "🍹" },
  { id: "salads", name: "Salads", icon: "🥗" },
  { id: "soups", name: "Soups", icon: "🥣" },
  { id: "sides", name: "Sides", icon: "🍟" },
];

export default function RestaurantMenu() {
  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  const [selectedItem, setSelectedItem] = useState(null);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showPromo, setShowPromo] = useState(false);
  const isMobile = useMobile(900); // Phones: < 900px
  const isTablet = useMobile(1200) && !isMobile; // Tablets: ≥ 900px and < 1200px
  const isLargeTablet = useMobile(1440) && !isTablet && !isMobile; // Large tablets: ≥ 1200px and < 1440px
  const categorySliderRef = useRef(null);

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    setSelectedItem(null);
    setMenuOpen(false);
  };

  const addToCart = (item) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
      } else {
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === itemId);
      if (existingItem && existingItem.quantity > 1) {
        return prevCart.map((cartItem) =>
          cartItem.id === itemId ? { ...cartItem, quantity: cartItem.quantity - 1 } : cartItem
        );
      } else {
        return prevCart.filter((cartItem) => cartItem.id !== itemId);
      }
    });
  };

  const scrollCategories = (direction) => {
    if (categorySliderRef.current) {
      const scrollAmount = isLargeTablet ? 300 : isTablet ? 250 : 200;
      categorySliderRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Cart Panel
  const CartPanel = ({ onClose }) => (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 sm:p-6 border-b" style={{ borderColor: colors.primary }}>
        <h2
          className={cn(
            "font-serif font-bold",
            isLargeTablet ? "text-2xl" : isTablet ? "text-xl" : "text-lg"
          )}
          style={{ color: colors.light }}
        >
          Your Order
        </h2>
        {onClose && (
          <button className="p-1 rounded-full" style={{ backgroundColor: colors.primary }} onClick={onClose}>
            <X
              className={cn("w-5 h-5", isLargeTablet ? "w-6 h-6" : "w-5 h-5")}
              style={{ color: colors.light }}
            />
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {cart.length === 0 ? (
          <p
            className={cn(
              "text-center py-8 font-sans opacity-70",
              isLargeTablet ? "text-base" : "text-sm"
            )}
            style={{ color: colors.light }}
          >
            Your cart is empty
          </p>
        ) : (
          <ul className="space-y-4">
            {cart.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between pb-4 border-b"
                style={{ borderColor: `${colors.primary}40` }}
              >
                <div>
                  <p
                    className={cn(
                      "font-sans font-medium",
                      isLargeTablet ? "text-lg" : "text-base"
                    )}
                    style={{ color: colors.light }}
                  >
                    {item.name}
                  </p>
                  <p
                    className={cn("font-sans", isLargeTablet ? "text-base" : "text-sm")}
                    style={{ color: `${colors.primary}` }}
                  >
                    ${item.price} x {item.quantity}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="p-1 rounded-full"
                    style={{ backgroundColor: `${colors.primary}40` }}
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Minus className="w-4 h-4" style={{ color: colors.light }} />
                  </button>
                  <span
                    className={cn("font-sans", isLargeTablet ? "text-base" : "text-sm")}
                    style={{ color: colors.light }}
                  >
                    {item.quantity}
                  </span>
                  <button
                    className="p-1 rounded-full"
                    style={{ backgroundColor: colors.primary }}
                    onClick={() => addToCart(item)}
                  >
                    <Plus className="w-4 h-4" style={{ color: colors.light }} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="p-4 sm:p-6 border-t" style={{ borderColor: colors.primary, backgroundColor: `${colors.dark}` }}>
        <div className="flex justify-between mb-4">
          <span
            className={cn("font-sans font-medium", isLargeTablet ? "text-lg" : "text-base")}
            style={{ color: colors.light }}
          >
            Total
          </span>
          <span
            className={cn("font-sans font-bold", isLargeTablet ? "text-2xl" : "text-xl")}
            style={{ color: colors.primary }}
          >
            ${totalPrice.toFixed(2)}
          </span>
        </div>
        <Button
          className={cn("w-full font-sans", isLargeTablet ? "py-7 text-lg" : "py-6 text-base")}
          style={{
            backgroundColor: colors.primary,
            color: colors.light,
          }}
        >
          Place Order
        </Button>
      </div>
    </div>
  );

  // Promo Panel
  const PromoPanel = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
      onClick={() => setShowPromo(false)}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className={cn(
          "rounded-lg w-full",
          isLargeTablet ? "max-w-lg p-8" : isTablet ? "max-w-md p-8" : "max-w-sm p-6"
        )}
        style={{ backgroundColor: colors.dark }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute top-4 right-4 p-1 rounded-full"
          style={{ backgroundColor: colors.primary }}
          onClick={() => setShowPromo(false)}
        >
          <X
            className={cn("w-5 h-5", isLargeTablet || isTablet ? "w-6 h-6" : "w-5 h-5")}
            style={{ color: colors.light }}
          />
        </button>
        <h3
          className={cn(
            "font-serif font-bold mb-4 text-center leading-tight",
            isLargeTablet ? "text-3xl" : isTablet ? "text-2xl" : "text-xl"
          )}
          style={{ color: colors.light }}
        >
          HAYAT RIVER
        </h3>
        <div className={cn("space-y-4", isLargeTablet || isTablet ? "space-y-6" : "space-y-4")}>
          <a
            href="https://instagram.com/hayat_river"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <Instagram
              className={cn("w-6 h-6", isLargeTablet || isTablet ? "w-7 h-7" : "w-6 h-6")}
              style={{ color: colors.primary }}
            />
            <span
              className={cn("font-sans leading-relaxed", isLargeTablet ? "text-lg" : isTablet ? "text-base" : "text-sm")}
              style={{ color: colors.light }}
            >
              @hayat_river
            </span>
          </a>
          <a
            href="tel:+15551234567"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <Phone
              className={cn("w-6 h-6", isLargeTablet || isTablet ? "w-7 h-7" : "w-6 h-6")}
              style={{ color: colors.primary }}
            />
            <span
              className={cn("font-sans leading-relaxed", isLargeTablet ? "text-lg" : isTablet ? "text-base" : "text-sm")}
              style={{ color: colors.light }}
            >
              +1 (555) 123-4567
            </span>
          </a>
          <a
            href="https://t.me/hayat_river"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <MessageSquare
              className={cn("w-6 h-6", isLargeTablet || isTablet ? "w-7 h-7" : "w-6 h-6")}
              style={{ color: colors.primary }}
            />
            <span
              className={cn("font-sans leading-relaxed", isLargeTablet ? "text-lg" : isTablet ? "text-base" : "text-sm")}
              style={{ color: colors.light }}
            >
              Telegram
            </span>
          </a>
          <a
            href="https://maps.google.com/?q=123+River+St,+Food+City,+FC+12345"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <MapPin
              className={cn("w-6 h-6", isLargeTablet || isTablet ? "w-7 h-7" : "w-6 h-6")}
              style={{ color: colors.primary }}
            />
            <span
              className={cn("font-sans leading-relaxed", isLargeTablet ? "text-lg" : isTablet ? "text-base" : "text-sm")}
              style={{ color: colors.light }}
            >
              123 River St, Food City, FC 12345
            </span>
          </a>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: colors.light }}>
      {/* Header */}
      <div
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3"
        style={{ backgroundColor: `${colors.dark}CC` }}
      >
        <div className="flex items-center">
          <button onClick={() => setShowPromo(true)} className="relative w-10 h-10 sm:w-12 sm:h-12">
            <Image src="/images/logo.png" alt="HAYAT RIVER" fill className="object-contain" />
          </button>
          <h1
            className={cn(
              "ml-3 font-serif font-bold hidden sm:block",
              isLargeTablet ? "text-3xl" : isTablet ? "text-2xl" : "text-xl"
            )}
            style={{ color: colors.light }}
          >
            HAYAT RIVER
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="p-2 rounded-full"
            style={{ backgroundColor: colors.primary }}
            onClick={() => setShowCart(!showCart)}
          >
            <ShoppingBag
              className={cn("w-5 h-5", isLargeTablet ? "sm:w-7 sm:h-7" : "sm:w-6 sm:h-6")}
              style={{ color: colors.light }}
            />
            {totalItems > 0 && (
              <span
                className={cn(
                  "absolute -top-1 -right-1 flex items-center justify-center text-xs rounded-full",
                  isLargeTablet ? "w-6 h-6" : "w-5 h-5"
                )}
                style={{ backgroundColor: colors.dark, color: colors.light }}
              >
                {totalItems}
              </span>
            )}
          </button>
          {isMobile && (
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger asChild>
                <button className="p-2 rounded-full" style={{ backgroundColor: colors.primary }}>
                  <Menu
                    className={cn("w-5 h-5", isLargeTablet ? "w-6 h-6" : "w-5 h-5")}
                    style={{ color: colors.light }}
                  />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[250px] p-0 border-none" style={{ backgroundColor: colors.dark }}>
                <div className="flex flex-col h-full py-8">
                  <div className="flex justify-center mb-6">
                    <div className="relative w-16 h-16">
                      <Image src="/images/logo.png" alt="HAYAT RIVER" fill className="object-contain" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-4 px-4">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryChange(category.id)}
                        className={cn(
                          "py-3 px-4 rounded-lg text-left font-sans font-medium transition-all duration-300",
                          activeCategory === category.id ? "scale-105" : "opacity-70"
                        )}
                        style={{
                          backgroundColor: activeCategory === category.id ? colors.primary : "transparent",
                          color: colors.light,
                          border: `1px solid ${activeCategory === category.id ? "transparent" : colors.primary}`,
                        }}
                      >
                        <span className="mr-3">{category.icon}</span>
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>

      {/* Category Slider */}
      <div
        className={cn(
          "fixed left-0 right-0 z-40 flex items-center justify-between px-4",
          isMobile ? "bottom-0 py-3" : "top-16 py-4"
        )}
        style={{ backgroundColor: `${colors.dark}E6` }}
      >
        <button
          className={cn("p-2 rounded-full", isLargeTablet || isTablet ? "p-3" : "p-2")}
          style={{ backgroundColor: colors.primary }}
          onClick={() => scrollCategories("left")}
        >
          <ChevronLeft
            className={cn("w-5 h-5", isLargeTablet || isTablet ? "w-6 h-6" : "w-5 h-5")}
            style={{ color: colors.light }}
          />
        </button>
        <div
          ref={categorySliderRef}
          className="flex overflow-x-auto space-x-2 scrollbar-hide"
          style={{ scrollBehavior: "smooth" }}
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.id)}
              className={cn(
                "flex items-center justify-center p-2 rounded-lg transition-all duration-300 whitespace-nowrap",
                activeCategory === category.id ? "scale-110" : "opacity-70",
                isLargeTablet ? "p-3 min-w-[150px]" : isTablet ? "p-3 min-w-[140px]" : "min-w-[120px]"
              )}
              style={{
                backgroundColor: activeCategory === category.id ? colors.primary : "transparent",
                color: colors.light,
              }}
            >
              <span
                className={cn(
                  "mr-2",
                  isLargeTablet ? "text-2xl" : isTablet ? "text-xl" : "text-lg"
                )}
              >
                {category.icon}
              </span>
              <span
                className={cn(
                  "font-sans",
                  isLargeTablet ? "text-lg" : isTablet ? "text-base" : "text-sm"
                )}
              >
                {category.name}
              </span>
            </button>
          ))}
        </div>
        <button
          className={cn("p-2 rounded-full", isLargeTablet || isTablet ? "p-3" : "p-2")}
          style={{ backgroundColor: colors.primary }}
          onClick={() => scrollCategories("right")}
        >
          <ChevronRight
            className={cn("w-5 h-5", isLargeTablet || isTablet ? "w-6 h-6" : "w-5 h-5")}
            style={{ color: colors.light }}
          />
        </button>
      </div>

      {/* Main Content Area */}
      <div
        className={cn(
          isMobile ? "pt-16 pb-20" : "pt-28 pb-4",
          isLargeTablet || isTablet ? "px-8" : "px-4"
        )}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="container mx-auto"
          >
            <h2
              className={cn(
                "font-serif font-bold mb-8 text-center",
                isMobile ? "text-2xl" : isTablet ? "text-4xl" : isLargeTablet ? "text-5xl" : "text-4xl",
                "leading-tight"
              )}
              style={{ color: colors.dark }}
            >
              {categories.find((c) => c.id === activeCategory)?.name}
            </h2>
            <div className={cn("space-y-4", isLargeTablet || isTablet ? "space-y-6" : "space-y-4")}>
              {menuData[activeCategory]?.map((item) => (
                <motion.div
                  key={item.id}
                  className={cn(
                    "flex items-center gap-4 rounded-lg cursor-pointer hover:shadow-lg transition-shadow",
                    isLargeTablet || isTablet ? "p-6" : "p-4"
                  )}
                  style={{ backgroundColor: `${colors.dark}10` }}
                  onClick={() => setSelectedItem(item.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div
                    className={cn(
                      "relative rounded-lg overflow-hidden",
                      isLargeTablet ? "w-32 h-32 sm:w-36 sm:h-36" : isTablet ? "w-28 h-28 sm:w-32 sm:h-32" : "w-20 h-20 sm:w-24 sm:h-24"
                    )}
                  >
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 900px) 100vw, 50vw"
                      quality={75}
                    />
                  </div>
                  <div className="flex-1">
                    <h3
                      className={cn(
                        "font-serif font-medium",
                        isLargeTablet ? "text-xl" : isTablet ? "text-lg" : "text-base",
                        "leading-tight"
                      )}
                      style={{ color: colors.dark }}
                    >
                      {item.name}
                    </h3>
                    <p
                      className={cn(
                        "font-sans opacity-70 mt-1",
                        isLargeTablet ? "text-base" : isTablet ? "text-sm" : "text-xs",
                        "leading-relaxed"
                      )}
                      style={{ color: colors.dark }}
                    >
                      {item.description}
                    </p>
                    <div className={cn("flex items-center justify-between", isLargeTablet || isTablet ? "mt-3" : "mt-2")}>
                      <p
                        className={cn(
                          "font-sans font-bold",
                          isLargeTablet ? "text-xl" : isTablet ? "text-lg" : "text-base"
                        )}
                        style={{ color: colors.primary }}
                      >
                        ${item.price}
                      </p>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(item);
                        }}
                        className={cn(
                          "font-sans rounded-full",
                          isLargeTablet ? "px-6 py-2 text-base" : isTablet ? "px-5 py-1.5 text-sm" : "px-4 py-1 text-sm"
                        )}
                        style={{
                          backgroundColor: colors.primary,
                          color: colors.light,
                        }}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Shopping Cart Slide-in */}
      <AnimatePresence>
        {showCart && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25 }}
            className={cn("fixed top-0 right-0 bottom-0 z-50 shadow-xl", isMobile ? "w-full" : "w-[350px]")}
            style={{ backgroundColor: colors.dark }}
          >
            <CartPanel onClose={() => setShowCart(false)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Item Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className={cn(
                "bg-white rounded-lg w-full",
                isLargeTablet ? "max-w-xl p-8" : isTablet ? "max-w-lg p-8" : "max-w-md p-6"
              )}
              style={{ backgroundColor: colors.dark }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 p-1 rounded-full"
                style={{ backgroundColor: colors.primary }}
                onClick={() => setSelectedItem(null)}
              >
                <X
                  className={cn("w-5 h-5", isLargeTablet || isTablet ? "w-6 h-6" : "w-5 h-5")}
                  style={{ color: colors.light }}
                />
              </button>
              {menuData[activeCategory]
                ?.filter((item) => item.id === selectedItem)
                .map((item) => (
                  <div key={item.id} className="flex flex-col gap-4">
                    <div
                      className={cn(
                        "relative w-full rounded-lg overflow-hidden",
                        isLargeTablet ? "h-72" : isTablet ? "h-64" : "h-56"
                      )}
                    >
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="100vw"
                        quality={75}
                      />
                    </div>
                    <div>
                      <h3
                        className={cn(
                          "font-serif font-bold mb-2 leading-tight",
                          isLargeTablet ? "text-3xl" : isTablet ? "text-2xl" : "text-xl"
                        )}
                        style={{ color: colors.light }}
                      >
                        {item.name}
                      </h3>
                      <p
                        className={cn(
                          "font-sans mb-4 opacity-90 leading-relaxed",
                          isLargeTablet ? "text-lg" : isTablet ? "text-base" : "text-sm"
                        )}
                        style={{ color: colors.light }}
                      >
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <p
                          className={cn(
                            "font-sans font-bold",
                            isLargeTablet ? "text-3xl" : isTablet ? "text-2xl" : "text-xl"
                          )}
                          style={{ color: colors.primary }}
                        >
                          ${item.price}
                        </p>
                        <Button
                          onClick={() => {
                            addToCart(item);
                            setSelectedItem(null);
                          }}
                          className={cn(
                            "font-sans rounded-full",
                            isLargeTablet ? "px-8 py-3 text-lg" : isTablet ? "px-6 py-2 text-base" : "px-5 py-1.5 text-sm"
                          )}
                          style={{
                            backgroundColor: colors.primary,
                            color: colors.light,
                          }}
                        >
                          Add to Order
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Promo Panel */}
      <AnimatePresence>
        {showPromo && <PromoPanel />}
      </AnimatePresence>
    </div>
  );
}