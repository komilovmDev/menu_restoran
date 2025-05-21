"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingBag, Menu, ChevronLeft, ChevronRight, Instagram, Phone, MapPin, MessageSquare } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useMobile } from "@/hooks/use-mobile";

const colors = {
  primary: "#0E7F78",
  dark: "#151615",
  light: "#F8F7F1",
};

export default function RestaurantMenu() {
  const [activeCategory, setActiveCategory] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showPromo, setShowPromo] = useState(false);
  const [categories, setCategories] = useState([]);
  const [menuDataDynamic, setMenuDataDynamic] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMobile = useMobile(900); // Phones: < 900px
  const isTablet = useMobile(1200) && !isMobile; // Tablets: ≥ 900px and < 1200px
  const isLargeTablet = useMobile(1440) && !isTablet && !isMobile; // Large tablets: ≥ 1200px and < 1440px
  const isPC = !isMobile && !isTablet && !isLargeTablet; // PCs: ≥ 1440px
  const categorySliderRef = useRef(null);

  // Helper function to calculate visual width of a category name
  const calculateVisualWidth = (name) => {
    const charWidth = (isPC || isLargeTablet) ? { latin: 9, cyrillic: 11, emoji: 16 } : { latin: 8, cyrillic: 10, emoji: 16 };
    let width = 0;

    for (const char of name) {
      if (char.match(/[A-Za-z0-9]/)) {
        width += charWidth.latin; // Latin characters
      } else if (char.match(/[\u0400-\u04FF]/)) {
        width += charWidth.cyrillic; // Cyrillic characters
      } else if (char.match(/[\uD83C-\uD83E]/)) {
        width += charWidth.emoji; // Emojis
      } else {
        width += charWidth.latin; // Fallback for other characters
      }
    }

    // Add padding (px-4 ≈ 32px total)
    width += 32;
    return width;
  };

  // Helper function to determine border size based on visual width
  const getBorderSize = (visualWidth) => {
    if (visualWidth <= 100) return "1px";
    if (visualWidth <= 150) return "2px";
    return "3px";
  };

  // Helper function to determine font size based on visual width
  const getFontSize = (visualWidth) => {
    if (visualWidth > 200) {
      return (isPC || isLargeTablet) ? "text-sm" : "text-xs";
    }
    return (isPC || isLargeTablet) ? "text-base" : "text-sm";
  };

  // Fetch categories and menu items
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch categories
        const categoriesResponse = await fetch("https://menyu.work.gd/api/menu-categories/");
        if (!categoriesResponse.ok) throw new Error("Не удалось загрузить категории");
        const categoriesData = await categoriesResponse.json();
        const categoriesFormatted = categoriesData.map((cat) => ({
          id: cat.id,
          name: cat.name,
        }));
        setCategories(categoriesFormatted);
        setActiveCategory(categoriesData[0]?.id || null);

        // Fetch menu items
        const itemsResponse = await fetch("https://menyu.work.gd/api/menu-items/");
        if (!itemsResponse.ok) throw new Error("Не удалось загрузить товары");
        const itemsData = await itemsResponse.json();

        // Group items by category ID
        const groupedItems = itemsData.reduce((acc, item) => {
          const categoryId = item.category.id;
          if (!acc[categoryId]) acc[categoryId] = [];
          acc[categoryId].push({
            id: item.id,
            name: item.name,
            description: item.description,
            price: item.formatted_price,
            image: item.image,
            category: item.category,
          });
          return acc;
        }, {});
        setMenuDataDynamic(groupedItems);
      } catch (err) {
        console.error("API Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

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
      const scrollAmount = isPC || isLargeTablet ? 300 : isTablet ? 250 : 200;
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
            "font-sans font-bold",
            isPC || isLargeTablet ? "text-2xl" : isTablet ? "text-xl" : "text-lg"
          )}
          style={{ color: colors.light }}
        >
          Ваш заказ
        </h2>
        {onClose && (
          <button className="p-1 rounded-full" style={{ backgroundColor: colors.primary }} onClick={onClose}>
            <X
              className={cn("w-5 h-5", isPC || isLargeTablet ? "w-6 h-6" : "w-5 h-5")}
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
              isPC || isLargeTablet ? "text-base" : "text-sm"
            )}
            style={{ color: colors.light }}
          >
            Ваша корзина пуста
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
                      isPC || isLargeTablet ? "text-lg" : "text-base"
                    )}
                    style={{ color: colors.light }}
                  >
                    {item.name}
                  </p>
                  <p
                    className={cn("font-sans", isPC || isLargeTablet ? "text-base" : "text-sm")}
                    style={{ color: `${colors.primary}` }}
                  >
                    {item.price.toFixed(0)} сум x {item.quantity}
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
                    className={cn("font-sans", isPC || isLargeTablet ? "text-base" : "text-sm")}
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
            className={cn("font-sans font-medium", isPC || isLargeTablet ? "text-lg" : "text-base")}
            style={{ color: colors.light }}
          >
            Итого
          </span>
          <span
            className={cn("font-sans font-bold", isPC || isLargeTablet ? "text-2xl" : "text-xl")}
            style={{ color: colors.primary }}
          >
            {totalPrice.toFixed(0)} сум
          </span>
        </div>
        <Button
          className={cn("w-full font-sans", isPC || isLargeTablet ? "py-7 text-lg" : "py-6 text-base")}
          style={{
            backgroundColor: colors.primary,
            color: colors.light,
          }}
        >
          Оформить заказ
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
          isPC || isLargeTablet ? "max-w-lg p-8" : isTablet ? "max-w-md p-8" : "max-w-sm p-6"
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
            className={cn("w-5 h-5", isPC || isLargeTablet || isTablet ? "w-6 h-6" : "w-5 h-5")}
            style={{ color: colors.light }}
          />
        </button>
        <h3
          className={cn(
            "font-sans font-bold mb-4 text-center leading-tight",
            isPC || isLargeTablet ? "text-3xl" : isTablet ? "text-2xl" : "text-xl"
          )}
          style={{ color: colors.light }}
        >
          HAYAT RIVER
        </h3>
        <div className={cn("space-y-4", isPC || isLargeTablet || isTablet ? "space-y-6" : "space-y-4")}>
          <a
            href="https://instagram.com/hayat_river"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <Instagram
              className={cn("w-6 h-6", isPC || isLargeTablet || isTablet ? "w-7 h-7" : "w-6 h-6")}
              style={{ color: colors.primary }}
            />
            <span
              className={cn("font-sans leading-relaxed", isPC || isLargeTablet ? "text-lg" : isTablet ? "text-base" : "text-sm")}
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
              className={cn("w-6 h-6", isPC || isLargeTablet || isTablet ? "w-7 h-7" : "w-6 h-6")}
              style={{ color: colors.primary }}
            />
            <span
              className={cn("font-sans leading-relaxed", isPC || isLargeTablet ? "text-lg" : isTablet ? "text-base" : "text-sm")}
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
              className={cn("w-6 h-6", isPC || isLargeTablet || isTablet ? "w-7 h-7" : "w-6 h-6")}
              style={{ color: colors.primary }}
            />
            <span
              className={cn("font-sans leading-relaxed", isPC || isLargeTablet ? "text-lg" : isTablet ? "text-base" : "text-sm")}
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
              className={cn("w-6 h-6", isPC || isLargeTablet || isTablet ? "w-7 h-7" : "w-6 h-6")}
              style={{ color: colors.primary }}
            />
            <span
              className={cn("font-sans leading-relaxed", isPC || isLargeTablet ? "text-lg" : isTablet ? "text-base" : "text-sm")}
              style={{ color: colors.light }}
            >
              123 River St, Food City, FC 12345
            </span>
          </a>
        </div>
      </motion.div>
    </motion.div>
  );

  if (loading) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ backgroundColor: colors.light }}
      >
        <p
          className={cn("font-sans text-lg", isPC || isLargeTablet ? "text-xl" : "text-lg")}
          style={{ color: colors.dark }}
        >
          Загрузка...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex items-center justify-center min-h-screen"
        style={{ backgroundColor: colors.light }}
      >
        <p
          className={cn("font-sans text-lg", isPC || isLargeTablet ? "text-xl" : "text-lg")}
          style={{ color: colors.dark }}
        >
          Не удалось загрузить меню: {error}
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen" style={{ backgroundColor: colors.light }}>
      {/* Header */}
      <div
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-4"
        style={{ backgroundColor: `${colors.dark}CC` }}
      >
        <div className="flex items-center">
          <button onClick={() => setShowPromo(true)} className="relative w-10 h-10 sm:w-12 sm:h-12">
            <Image src="/images/logo.png" alt="HAYAT RIVER" fill className="object-contain" />
          </button>
          <h1
            className={cn(
              "ml-3 font-sans font-bold hidden sm:block",
              isPC || isLargeTablet ? "text-3xl" : isTablet ? "text-2xl" : "text-xl"
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
              className={cn("w-5 h-5", isPC || isLargeTablet ? "sm:w-7 sm:h-7" : "sm:w-6 sm:h-6")}
              style={{ color: colors.light }}
            />
            {totalItems > 0 && (
              <span
                className={cn(
                  "absolute -top-1 -right-1 flex items-center justify-center text-xs rounded-full",
                  isPC || isLargeTablet ? "w-6 h-6" : "w-5 h-5"
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
                    className={cn("w-5 h-5", isPC || isLargeTablet ? "w-6 h-6" : "w-5 h-5")}
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
                  <div className="flex flex-col gap-4 px-6">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryChange(category.id)}
                        className={cn(
                          "py-3 px-4 rounded-lg text-left font-sans font-medium",
                          activeCategory === category.id ? "bg-opacity-100" : "opacity-70 hover:bg-opacity-80"
                        )}
                        style={{
                          backgroundColor: activeCategory === category.id ? colors.primary : "transparent",
                          color: colors.light,
                          border: `1px solid ${activeCategory === category.id ? "transparent" : colors.primary}`,
                        }}
                      >
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
        className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3"
        style={{ backgroundColor: `${colors.dark}E6` }}
      >
        <button
          className={cn("p-2 rounded-full", isPC || isLargeTablet || isTablet ? "p-3" : "p-2")}
          style={{ backgroundColor: colors.primary }}
          onClick={() => scrollCategories("left")}
        >
          <ChevronLeft
            className={cn("w-5 h-5", isPC || isLargeTablet || isTablet ? "w-6 h-6" : "w-5 h-5")}
            style={{ color: colors.light }}
          />
        </button>
        <div
          ref={categorySliderRef}
          className="flex overflow-x-auto space-x-4 scrollbar-hide"
          style={{ scrollBehavior: "smooth" }}
        >
          {categories.map((category) => {
            const visualWidth = calculateVisualWidth(category.name);
            const minWidth = Math.max(
              visualWidth,
              isPC || isLargeTablet ? 140 : isTablet ? 120 : 100
            );
            return (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
                className={cn(
                  "flex items-center justify-center px-4 rounded-lg transition-all duration-300 whitespace-nowrap font-sans font-medium",
                  getFontSize(visualWidth),
                  activeCategory === category.id ? "bg-opacity-100" : "opacity-70 hover:bg-opacity-80",
                  isPC || isLargeTablet ? "p-3" : isTablet ? "p-2.5" : "p-2"
                )}
                style={{
                  minWidth: `${minWidth}px`,
                  backgroundColor: activeCategory === category.id ? colors.primary : "transparent",
                  color: colors.light,
                  border: activeCategory === category.id 
                    ? "transparent" 
                    : `${getBorderSize(visualWidth)} solid ${colors.primary}`,
                }}
              >
                {category.name}
              </button>
            );
          })}
        </div>
        <button
          className={cn("p-2 rounded-full", isPC || isLargeTablet || isTablet ? "p-3" : "p-2")}
          style={{ backgroundColor: colors.primary }}
          onClick={() => scrollCategories("right")}
        >
          <ChevronRight
            className={cn("w-5 h-5", isPC || isLargeTablet || isTablet ? "w-6 h-6" : "w-5 h-5")}
            style={{ color: colors.light }}
          />
        </button>
      </div>

      {/* Main Content Area */}
      <div
        className={cn(
          isMobile ? "pt-24 pb-20" : "pt-32 pb-20",
          isPC || isLargeTablet || isTablet ? "px-8" : "px-4"
        )}
      >
        <AnimatePresence mode="wait">
          {activeCategory && (
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
                  "font-sans font-bold mb-8 text-center",
                  isMobile ? "text-2xl" : isTablet ? "text-4xl" : isPC || isLargeTablet ? "text-5xl" : "text-4xl",
                  "leading-tight"
                )}
                style={{ color: colors.dark }}
              >
                {categories.find((c) => c.id === activeCategory)?.name}
              </h2>
              <div className={cn("space-y-4", isPC || isLargeTablet || isTablet ? "space-y-6" : "space-y-4")}>
                {(menuDataDynamic[activeCategory] || []).map((item) => (
                  <motion.div
                    key={item.id}
                    className={cn(
                      "flex items-center gap-4 rounded-lg cursor-pointer hover:shadow-lg transition-shadow",
                      isPC || isLargeTablet || isTablet ? "p-6" : "p-4"
                    )}
                    style={{ backgroundColor: `${colors.dark}10` }}
                    onClick={() => setSelectedItem(item.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div
                      className={cn(
                        "relative rounded-lg overflow-hidden",
                        isPC || isLargeTablet ? "w-32 h-32 sm:w-36 sm:h-36" : isTablet ? "w-28 h-28 sm:w-32 sm:h-32" : "w-20 h-20 sm:w-24 sm:h-24"
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
                          "font-sans font-medium",
                          isPC || isLargeTablet ? "text-xl" : isTablet ? "text-lg" : "text-base",
                          "leading-tight"
                        )}
                        style={{ color: colors.dark }}
                      >
                        {item.name}
                      </h3>
                      <p
                        className={cn(
                          "font-sans opacity-70 mt-1",
                          isPC || isLargeTablet ? "text-base" : isTablet ? "text-sm" : "text-xs",
                          "leading-relaxed"
                        )}
                        style={{ color: colors.dark }}
                      >
                        {item.description}
                      </p>
                      <div className={cn("flex items-center justify-between", isPC || isLargeTablet || isTablet ? "mt-3" : "mt-2")}>
                        <p
                          className={cn(
                            "font-sans font-bold",
                            isPC || isLargeTablet ? "text-xl" : isTablet ? "text-lg" : "text-base"
                          )}
                          style={{ color: colors.primary }}
                        >
                          {item.price.toFixed(0)} сум
                        </p>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(item);
                          }}
                          className={cn(
                            "font-sans rounded-full",
                            isPC || isLargeTablet ? "px-6 py-2 text-base" : isTablet ? "px-5 py-1.5 text-sm" : "px-4 py-1 text-sm"
                          )}
                          style={{
                            backgroundColor: colors.primary,
                            color: colors.light,
                          }}
                        >
                          Добавить
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {menuDataDynamic[activeCategory]?.length === 0 && (
                  <p
                    className={cn(
                      "text-center py-8 font-sans opacity-70",
                      isPC || isLargeTablet ? "text-base" : "text-sm"
                    )}
                    style={{ color: colors.dark }}
                  >
                    В этой категории нет товаров
                  </p>
                )}
              </div>
            </motion.div>
          )}
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
                isMobile ? "max-w-2xl p-10" : isTablet ? "max-w-3xl p-12" : "max-w-4xl p-14"
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
                  className={cn("w-7 h-7", isTablet ? "w-8 h-8" : isPC || isLargeTablet ? "w-9 h-9" : "w-7 h-7")}
                  style={{ color: colors.light }}
                />
              </button>
              {Object.values(menuDataDynamic)
                .flat()
                .filter((item) => item.id === selectedItem)
                .map((item) => (
                  <div key={item.id} className="flex flex-col gap-6">
                    <div
                      className={cn(
                        "relative w-full rounded-lg overflow-hidden",
                        isMobile ? "h-80" : isTablet ? "h-96" : "h-112"
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
                          "font-sans font-bold mb-4 leading-tight",
                          isMobile ? "text-3xl" : isTablet ? "text-4xl" : "text-5xl"
                        )}
                        style={{ color: colors.light }}
                      >
                        {item.name}
                      </h3>
                      <p
                        className={cn(
                          "font-sans mb-6 opacity-90 leading-relaxed",
                          isMobile ? "text-lg" : isTablet ? "text-xl" : "text-2xl"
                        )}
                        style={{ color: colors.light }}
                      >
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <p
                          className={cn(
                            "font-sans font-bold",
                            isMobile ? "text-3xl" : isTablet ? "text-4xl" : "text-5xl"
                          )}
                          style={{ color: colors.primary }}
                        >
                          {item.price.toFixed(0)} сум
                        </p>
                        <Button
                          onClick={() => {
                            addToCart(item);
                            setSelectedItem(null);
                          }}
                          className={cn(
                            "font-sans rounded-full",
                            isMobile ? "px-8 py-3 text-lg" : isTablet ? "px-10 py-4 text-xl" : "px-12 py-5 text-2xl"
                          )}
                          style={{
                            backgroundColor: colors.primary,
                            color: colors.light,
                          }}
                        >
                          Добавить в заказ
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