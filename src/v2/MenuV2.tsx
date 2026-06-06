import { useEffect, useRef, useState } from "react";
import "./MenuV2.css";
import { categories, ingredients, products } from "./data";
declare global {
  interface Window {
    google: any;
  }
}


function formatCLP(value: number) {
  return value.toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  });
}

type CartItem = {
  id: string;
  name: string;
  description?: string;
  price: number;
  qty: number;
};

type SelectorModal =
  | { type: "burger" }
  | { type: "burger-2x" }
  | { type: "sandwich" }
  | { type: "happy-hour" }
  | { type: "drinks" }
  | { type: "beer" }
  | { type: "pizza-fixed"; productId: string }
  | { type: "custom-pizza" }
  | { type: "promo-two-pizzas" }
  | { type: "promo-two-pizzas-drink" }
  | { type: "promo-dimauro" }
  | { type: "promo-segunda-mitad" }
  | null;

const WHATSAPP_NUMBER = "56956154280";

const burgerOptions = [
  { id: "rukapillan", name: "Rukapillán", price: 8900, description: "Tocino, pepinillo, cebolla morada, queso fundido y salsa BBQ" },
  { id: "lanin", name: "Lanín", price: 8900, description: "Palta, tomate y mayonesa casera" },
  { id: "llaima", name: "Llaima", price: 8500, description: "Doble queso fundido" },
];

const sandwichProteins = [
  { id: "ave", name: "Ave" },
  { id: "churrasco", name: "Churrasco" },
  { id: "mechada", name: "Mechada" },
  { id: "lomito", name: "Lomito de cerdo" },
];

const sandwichStyles = [
  { id: "solo", name: "Solo" },
  { id: "luco", name: "Luco" },
  { id: "italiano", name: "Italiano" },
  { id: "chacarero", name: "Chacarero" },
];

const sandwichDescriptions: Record<string, string> = {
  solo: "Pan de la casa + proteína",
  luco: "Pan de la casa + proteína + queso",
  italiano: "Pan de la casa + proteína + palta + tomate + mayo",
  chacarero: "Pan de la casa + proteína + tomate + poroto verde + mayo",
};

const sandwichPrices: Record<string, Record<string, number>> = {
  ave: { solo: 6900, luco: 7500, italiano: 7900, chacarero: 7900 },
  churrasco: { solo: 7900, luco: 8500, italiano: 8900, chacarero: 8900 },
  mechada: { solo: 7900, luco: 8500, italiano: 8900, chacarero: 8900 },
  lomito: { solo: 7900, luco: 8500, italiano: 8900, chacarero: 8900 },
};

const happyHourSizes = [
  { id: "medio", name: "Medio Litro" },
  { id: "litro", name: "Litro" },
];

const happyHourOptions = [
  { id: "pisco-sour", name: "Pisco Sour", prices: { medio: 6000, litro: 10000 }, flavors: [] },
  { id: "mojito-tradicional", name: "Mojito Tradicional", prices: { medio: 6000, litro: 10000 }, flavors: [] },
  { id: "pisco-sour-sabores", name: "Pisco Sour sabores", prices: { medio: 7000, litro: 12000 }, flavors: ["Menta Jengibre", "Frambuesa", "Maracuyá"] },
  { id: "mojito-sabores", name: "Mojito sabores", prices: { medio: 7000, litro: 12000 }, flavors: ["Frambuesa", "Frutilla", "Arándanos", "Piña", "Maracuyá", "Mango"] },
  { id: "pina-colada", name: "Piña Colada", prices: { medio: 7000, litro: 12000 }, flavors: [] },
  { id: "ramazzotti-spritz", name: "Ramazzotti Spritz", prices: { medio: 7000, litro: 12000 }, flavors: [] },
  { id: "tropical-gin", name: "Tropical Gin", prices: { medio: 7000, litro: 12000 }, flavors: [] },
];

const beerOptions = [
  { id: "heineken", name: "Heineken 475 cc", price: 4000 },
  { id: "torobayo", name: "Kunstmann Torobayo 500 cc", price: 5000 },
  { id: "calafate", name: "Austral Calafate 500 cc", price: 5000 },
];

const customPizzaBasePrice = 9900;
const promoTwoPizzasPrice = 25900;
const CUSTOM_PIZZA_MAX_TOTAL = 6;
const CUSTOM_PIZZA_MAX_PER_INGREDIENT = 3;

const promoPizzaSauces = [
  { id: "tomate", name: "Tomate" },
  { id: "barbecue", name: "Barbecue" },
];

const promoPizzaIngredientIds = [
  "pepperoni",
  "jamon",
  "champinon",
  "aceituna",
  "cebolla-morada",
  "pimenton",
  "tomate",
  "choclo",
  "salame",
  "carne-mechada",
  "extra-mozzarella",
  "chorizo-parrillero",
  "pollo",
  "pollo-bbq",
  "lomito-de-cerdo",
  "choricillo",
];

const promoPizzaIngredients = ingredients.filter((item) =>
  promoPizzaIngredientIds.includes(item.id)
);

const customPizzaCard = {
  id: "custom-pizza-card",
  category: "pizzas",
  name: "Arma tu Pizza",
  shortDescription: "Elige tu combinación de ingredientes",
  price: customPizzaBasePrice,
  type: "selector-custom-pizza",
};

function pointInPolygon(point: [number, number], polygon: number[][]) {
  const [x, y] = point;
  let inside = false;

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0];
    const yi = polygon[i][1];
    const xj = polygon[j][0];
    const yj = polygon[j][1];

    const intersect =
      yi > y !== yj > y &&
      x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

    if (intersect) inside = !inside;
  }

  return inside;
}

function pointInGeometry(point: [number, number], geometry: any) {
  if (!geometry) return false;

  if (geometry.type === "Polygon") {
    return pointInPolygon(point, geometry.coordinates[0]);
  }

  if (geometry.type === "MultiPolygon") {
    return geometry.coordinates.some((polygon: number[][][]) =>
      pointInPolygon(point, polygon[0])
    );
  }

  return false;
}

function getZonePriceFromName(name: string) {
  const match = name.match(/zona_(\d+)/i);
  return match ? Number(match[1]) : null;
}

export default function MenuV2() {

 const FORCE_STORE_OPEN = true;
 const FORCE_STORE_CLOSED = false;
 const FORCE_CLOSED_MESSAGE = "";

function isStoreOpen() {

  if (FORCE_STORE_CLOSED) {
    return false;
  }

  if (FORCE_STORE_OPEN) {
    return true;
  }

  const now = new Date();

  const chileHour = new Intl.DateTimeFormat("es-CL", {
    timeZone: "America/Santiago",
    hour: "numeric",
    hour12: false,
  }).format(now);

  const hour = Number(chileHour);

  const day = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Santiago",
    weekday: "long",
  }).format(now).toLowerCase();

// Domingo a viernes
if (
  [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
  ].includes(day)
) {
  return hour >= 18 && hour < 24;
}
  // Sábado
  if (day === "saturday") {
    return hour >= 13 || hour < 24;
  }

  return false;
}
  function getProductImage(product: any) {
  if (product.image) return product.image;

  const name = product.name.toLowerCase();
  if (name.includes("bebida")) return "/productos/bebidas.png";
  if (name.includes("cerveza")) return "/productos/cervezas.png";
  if (name.includes("cóctel") || name.includes("coctel")) return "/productos/cocteles.png";
  if (name.includes("hamburguesa") || name.includes("burger")) return "/productos/burger-generica.png";
  if (name.includes("chorrillana")) return "/productos/chorrillana.png";
  if (name.includes("salchipapas")) return "/productos/salchipapas.png";
  if (name.includes("papas")) return "/productos/papas-fritas-doble.png";
  if (name.includes("sandwich")) return "/productos/sandwich.png";
  if (name.includes("pizza") || name.includes("arma tu pizza")) return "/productos/pizza-generica.png";

  return "/productos/pizza-generica.png";
}
  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({});
const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
const addressInputRef = useRef<HTMLInputElement | null>(null);
const autocompleteRef = useRef<any>(null);


  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [closedModalOpen, setClosedModalOpen] = useState(false);
  const [cartNote, setCartNote] = useState("");

  const [deliveryType, setDeliveryType] =
    useState<"retiro" | "delivery">("retiro");
  const [isCalculatingDelivery, setIsCalculatingDelivery] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
 
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [addressCoords, setAddressCoords] = useState<{ lat: number; lng: number } | null>(null);
  
  const [deliveryFee, setDeliveryFee] = useState<number | null>(null);
  const [locationMode, setLocationMode] = useState<"gps" | "address">("gps");
  const locationModeRef = useRef(locationMode);
  const activeCoords = locationMode === "address" ? addressCoords : gpsCoords;
  const [locationMessage, setLocationMessage] = useState("");
  const [activePages, setActivePages] = useState<Record<string, number>>({});
  const [scrollHints, setScrollHints] = useState<Record<string, { left: boolean; right: boolean }>>({});
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id ?? "");
  const [modal, setModal] = useState<SelectorModal>(null);

  const [selectedBurger, setSelectedBurger] = useState("rukapillan");
  const [selectedProtein, setSelectedProtein] = useState("ave");
  const [selectedStyle, setSelectedStyle] = useState("solo");
  const [selectedAji, setSelectedAji] = useState(false);

  const [selectedHappyHourSize, setSelectedHappyHourSize] = useState("medio");
  const [selectedHappyHour, setSelectedHappyHour] = useState("pisco-sour");
  const [selectedHappyHourFlavor, setSelectedHappyHourFlavor] = useState("");

  const [selectedDrinkType, setSelectedDrinkType] = useState<"normal" | "zero">("normal");
  const [selectedDrinkBrand, setSelectedDrinkBrand] = useState<"coca" | "sprite" | "fanta">("coca");

  const [selectedBeer, setSelectedBeer] = useState<"heineken" | "torobayo" | "calafate">("heineken");
  const [beerNote, setBeerNote] = useState("");
  const [drinkNote, setDrinkNote] = useState("");

  const [pizzaExtras, setPizzaExtras] = useState<string[]>([]);
  const [showPizzaExtras, setShowPizzaExtras] = useState(false);

  const [customPizzaSauce, setCustomPizzaSauce] = useState("tomate");
  const [customPizzaExtras, setCustomPizzaExtras] = useState<string[]>([]);

  const [burgerQtys, setBurgerQtys] = useState<Record<string, number>>({
    rukapillan: 0,
    lanin: 0,
    llaima: 0,
  });

  const [promoTab, setPromoTab] = useState<"pizza1" | "pizza2">("pizza1");
  const [promoPizza1Sauce, setPromoPizza1Sauce] = useState("tomate");
  const [promoPizza2Sauce, setPromoPizza2Sauce] = useState("tomate");
  const [promoPizza1, setPromoPizza1] = useState<string[]>([]);
  const [promoPizza2, setPromoPizza2] = useState<string[]>([]);

  const [burgerNote, setBurgerNote] = useState("");
  const [sandwichNote, setSandwichNote] = useState("");
  const [happyHourNote, setHappyHourNote] = useState("");
  const [pizzaNote, setPizzaNote] = useState("");
  const [customPizzaNote, setCustomPizzaNote] = useState("");
  const [promoSegundaTab, setPromoSegundaTab] = useState<"pizza1" | "pizza2">("pizza1");
  const [promoSegundaPizza1, setPromoSegundaPizza1] = useState<string | null>(null);
  const [promoSegundaPizza2, setPromoSegundaPizza2] = useState<string | null>(null);
  const [promoSegundaNote, setPromoSegundaNote] = useState("");
  const [promoSegundaExtras1, setPromoSegundaExtras1] = useState<Record<string, number>>({});
  const [promoSegundaExtras2, setPromoSegundaExtras2] = useState<Record<string, number>>({});
  const [promoSegundaExtrasOpen, setPromoSegundaExtrasOpen] = useState(false);

  const promoSegundaExtrasList = ingredients.slice().sort((a, b) => a.price - b.price);

  const promoSegundaExtrasTotal = (() => {
    const extras1 = Object.entries(promoSegundaExtras1).reduce((sum, [id, qty]) => {
      const ing = ingredients.find((i) => i.id === id);
      return sum + (ing ? ing.price * qty : 0);
    }, 0);
    const extras2 = Object.entries(promoSegundaExtras2).reduce((sum, [id, qty]) => {
      const ing = ingredients.find((i) => i.id === id);
      return sum + (ing ? ing.price * qty : 0);
    }, 0);
    return extras1 + extras2;
  })();

  const promoSegundaExtrasCount1 = Object.values(promoSegundaExtras1).reduce((a, b) => a + b, 0);
  const promoSegundaExtrasCount2 = Object.values(promoSegundaExtras2).reduce((a, b) => a + b, 0);
  const [promoNote, setPromoNote] = useState("");

  const promoSegundaPizzas = products.filter(
    (p) => p.category === "pizzas" &&
    !["pizza-maihue", "pizza-caburgua"].includes(p.id) &&
    p.type === "pizza_fixed"
  );

  const promoSegundaTotal = (() => {
    if (!promoSegundaPizza1 || !promoSegundaPizza2) return 0;
    const p1 = products.find((p) => p.id === promoSegundaPizza1);
    const p2 = products.find((p) => p.id === promoSegundaPizza2);
    if (!p1 || !p2) return 0;
    const mayor = Math.max(p1.price, p2.price);
    const menor = Math.min(p1.price, p2.price);
    return mayor + Math.round(menor / 2);
  })();

  const promoSegundaAhorro = (() => {
    if (!promoSegundaPizza1 || !promoSegundaPizza2) return 0;
    const p1 = products.find((p) => p.id === promoSegundaPizza1);
    const p2 = products.find((p) => p.id === promoSegundaPizza2);
    if (!p1 || !p2) return 0;
    return Math.round(Math.min(p1.price, p2.price) / 2);
  })();
  const [promoTrago, setPromoTrago] = useState("pisco-sour");
  const [promoTragoNote, setPromoTragoNote] = useState("");

  // Estados promo Di Mauro
  const [promoDiMauroSauce, setPromoDiMauroSauce] = useState("tomate");
  const [promoDiMauroIngredients, setPromoDiMauroIngredients] = useState<string[]>([]);
  const [promoDiMauroCoctel, setPromoDiMauroCoctel] = useState("pisco-sour");
  const [promoDiMauroNote, setPromoDiMauroNote] = useState("");
  const [promoDiMauroExtras, setPromoDiMauroExtras] = useState<Record<string, number>>({});
  const [promoDiMauroExtrasOpen, setPromoDiMauroExtrasOpen] = useState(false);

  const [promoTwoPizzasExtras1, setPromoTwoPizzasExtras1] = useState<Record<string, number>>({});
  const [promoTwoPizzasExtras2, setPromoTwoPizzasExtras2] = useState<Record<string, number>>({});
  const [promoTwoPizzasExtrasOpen, setPromoTwoPizzasExtrasOpen] = useState(false);

  const promoDiMauroExtrasTotal = Object.entries(promoDiMauroExtras).reduce((sum, [id, qty]) => {
    const ing = ingredients.find((i) => i.id === id);
    return sum + (ing ? ing.price * qty : 0);
  }, 0);
  const promoDiMauroExtrasCount = Object.values(promoDiMauroExtras).reduce((a, b) => a + b, 0);

  const promoTwoPizzasExtrasTotal = (() => {
    const e1 = Object.entries(promoTwoPizzasExtras1).reduce((sum, [id, qty]) => {
      const ing = ingredients.find((i) => i.id === id);
      return sum + (ing ? ing.price * qty : 0);
    }, 0);
    const e2 = Object.entries(promoTwoPizzasExtras2).reduce((sum, [id, qty]) => {
      const ing = ingredients.find((i) => i.id === id);
      return sum + (ing ? ing.price * qty : 0);
    }, 0);
    return e1 + e2;
  })();
  const promoTwoPizzasExtrasCount1 = Object.values(promoTwoPizzasExtras1).reduce((a, b) => a + b, 0);
  const promoTwoPizzasExtrasCount2 = Object.values(promoTwoPizzasExtras2).reduce((a, b) => a + b, 0);

  const cartQty = cart.reduce((acc, item) => acc + item.qty, 0);
  const cartTotal = cart.reduce((acc, item) => acc + item.qty * item.price, 0);
  const finalTotal = cartTotal + (deliveryType === "delivery" ? deliveryFee ?? 0 : 0);

  const burgerTotalQty = Object.values(burgerQtys).reduce((acc, qty) => acc + qty, 0);
  const burgerSelected = burgerOptions.find((item) => item.id === selectedBurger) ?? burgerOptions[0];

  const sandwichPrice = sandwichPrices[selectedProtein]?.[selectedStyle] ?? 0;
  const sandwichProteinName = sandwichProteins.find((item) => item.id === selectedProtein)?.name ?? "";
  const sandwichStyleName = sandwichStyles.find((item) => item.id === selectedStyle)?.name ?? "";

  const happyHourSelected = happyHourOptions.find((item) => item.id === selectedHappyHour) ?? happyHourOptions[0];
  const happyHourPrice = happyHourSelected.prices[selectedHappyHourSize as keyof typeof happyHourSelected.prices];
  const happyHourHasFlavors = happyHourSelected.flavors.length > 0;
  const happyHourActiveFlavor = happyHourHasFlavors
    ? selectedHappyHourFlavor || happyHourSelected.flavors[0]
    : "";

  const beerSelected = beerOptions.find((item) => item.id === selectedBeer) ?? beerOptions[0];

  const modalPizzaProduct =
    modal?.type === "pizza-fixed"
      ? products.find((p) => p.id === modal.productId)
      : null;

  const pizzaBaseIngredientNames =
    modalPizzaProduct?.baseIngredients?.map(
      (id) => ingredients.find((item) => item.id === id)?.name || id
    ) ?? [];

  const pizzaExtraTotal = pizzaExtras.reduce((acc, id) => {
    const item = ingredients.find((ing) => ing.id === id);
    return acc + (item?.price ?? 0);
  }, 0);

  const customPizzaExtraTotal = customPizzaExtras.reduce((acc, id) => {
    const item = ingredients.find((ing) => ing.id === id);
    return acc + (item?.price ?? 0);
  }, 0);

  const customPizzaTotal = customPizzaBasePrice + customPizzaExtraTotal;
  const customPizzaIngredientCount = customPizzaExtras.length;

  function changePromoIngredientQty(
    value: string,
    delta: number,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) {
    setter((prev) => {
      const currentQty = prev.filter((item) => item === value).length;

      if (delta > 0) {
        if (prev.length >= 3) return prev;
        if (currentQty >= 3) return prev;
        return [...prev, value];
      }

      if (delta < 0) {
        if (currentQty <= 0) return prev;
        const index = prev.findIndex((item) => item === value);
        if (index === -1) return prev;
        const next = [...prev];
        next.splice(index, 1);
        return next;
      }

      return prev;
    });
  }

  function changeCustomPizzaIngredientQty(
    value: string,
    delta: number,
    setter: React.Dispatch<React.SetStateAction<string[]>>
  ) {
    setter((prev) => {
      const currentQty = prev.filter((item) => item === value).length;

      if (delta > 0) {
        if (prev.length >= CUSTOM_PIZZA_MAX_TOTAL) return prev;
        if (currentQty >= CUSTOM_PIZZA_MAX_PER_INGREDIENT) return prev;
        return [...prev, value];
      }

      if (delta < 0) {
        if (currentQty <= 0) return prev;
        const index = prev.findIndex((item) => item === value);
        if (index === -1) return prev;
        const next = [...prev];
        next.splice(index, 1);
        return next;
      }

      return prev;
    });
  }

  function changeBurgerQty(id: string, delta: number) {
    setBurgerQtys((prev) => {
      const current = prev[id] ?? 0;
      const total = Object.values(prev).reduce((acc, qty) => acc + qty, 0);
      const next = current + delta;

      if (next < 0) return prev;
      if (delta > 0 && total >= 2) return prev;

      return { ...prev, [id]: next };
    });
  }

  function openSelector(nextModal: SelectorModal) {
    setModal(nextModal);
  }

  function closeModal() {
    setModal(null);
  }

  function resetBurger2xModal() {
    setBurgerQtys({ rukapillan: 0, lanin: 0, llaima: 0 });
    setBurgerNote("");
  }

  function resetPromoModal() {
    setPromoTab("pizza1");
    setPromoPizza1Sauce("tomate");
    setPromoPizza2Sauce("tomate");
    setPromoPizza1([]);
    setPromoPizza2([]);
    setPromoNote("");
    setPromoTwoPizzasExtras1({});
    setPromoTwoPizzasExtras2({});
    setPromoTwoPizzasExtrasOpen(false);
  }

  function resetPromoTragoModal() {
    setPromoTab("pizza1");
    setPromoPizza1Sauce("tomate");
    setPromoPizza2Sauce("tomate");
    setPromoPizza1([]);
    setPromoPizza2([]);
    setPromoNote("");
    setPromoTrago("pisco-sour");
    setPromoTragoNote("");
  }

  function resetCustomPizzaModal() {
    setCustomPizzaSauce("tomate");
    setCustomPizzaExtras([]);
    setCustomPizzaNote("");
  }

  function addToCart(item: { id: string; name: string; price: number; description?: string }) {
    setCart((prev) => {
      const exists = prev.find(
        (cartItem) => cartItem.id === item.id && cartItem.name === item.name
      );

      if (exists) {
        return prev.map((cartItem) =>
          cartItem.id === item.id && cartItem.name === item.name
            ? { ...cartItem, qty: cartItem.qty + 1 }
            : cartItem
        );
      }

      return [
        ...prev,
        {
          id: item.id,
          name: item.name,
          description: item.description,
          price: item.price,
          qty: 1,
        },
      ];
    });
  }

  function changeCartQty(id: string, delta: number) {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, qty: item.qty + delta } : item))
        .filter((item) => item.qty > 0)
    );
  }

  function removeFromCart(id: string) {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }

async function calculateDeliveryForCoords(
  coords: { lat: number; lng: number },
  source: "gps" | "address"
) {

  if (source === "gps" && locationModeRef.current === "address") {
    return;
  }
setIsCalculatingDelivery(true);
  try {
    const response = await fetch("/delivery-zones.geojson");
    const geojson = await response.json();

    const point: [number, number] = [coords.lng, coords.lat];
    console.log("COORDS RECIBIDAS:", coords);
    console.log("POINT:", point);
    console.log("FEATURES:", geojson.features);

  const matchingZones = geojson.features.filter((feature: any) => {
  const inside = pointInGeometry(point, feature.geometry);
  console.log(
  "CHECKING:",
  feature.properties?.name,
  "POINT:",
  point,
  "INSIDE:",
  inside
);
  return inside;
});
console.log(
  "MATCHING ZONES FINAL:",
  matchingZones.map((z: any)=> z.properties?.name)
);
const sortedZones = matchingZones
  .map((feature: any) => {
    const name =
      feature.properties?.name ||
      feature.properties?.Name ||
      feature.properties?.title ||
      "";

    return {
      feature,
      fee: getZonePriceFromName(name),
    };
  })
  .filter((z: any) => z.fee !== null)
  .sort((a: any, b: any) => b.fee - a.fee);

const zoneMatch = sortedZones[0]?.feature;

if (!zoneMatch) {
  setDeliveryFee(null);
  setLocationMessage(
    "Ubicación fuera de zona automática. Envíanos el pedido por WhatsApp y calculamos el despacho manualmente."
  );
  setIsCalculatingDelivery(false);
  return;
}
const zoneName =
  zoneMatch.properties?.name ||
  zoneMatch.properties?.Name ||
  zoneMatch.properties?.title ||
  "";

const fee = getZonePriceFromName(zoneName);

if (fee === null) {
  setDeliveryFee(null);
  setIsCalculatingDelivery(false);
  return;
}

setDeliveryFee(fee);
setLocationMessage(`Delivery calculado: ${formatCLP(fee)}`);
setIsCalculatingDelivery(false);
} catch {
  setIsCalculatingDelivery(false);
  console.log("No se pudo calcular delivery automáticamente");
  setDeliveryFee(null);
}
}

async function detectUserLocation() {
  if (!navigator.geolocation) {
    alert("Tu dispositivo no permite usar ubicación GPS");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const coords = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

        setGpsCoords(coords);
              await calculateDeliveryForCoords(coords, "gps");
    },
    (error) => {
  console.log("GPS error:", error);

  setLocationMessage(
    "No pudimos obtener tu ubicación. Puedes usar MI DIRECCIÓN."
  );

  setGpsCoords(null);
  setDeliveryFee(null);
}
  );
}
  function sendOrderToWhatsApp() {
    console.log("CLICK WHATSAPP");
    console.log("isStoreOpen:", isStoreOpen)
    if (!isStoreOpen()) {
    setClosedModalOpen(true);
  return;
} 
   if (cart.length === 0) return;

    const lines: string[] = [];
    lines.push("Hola! Quiero hacer este pedido:");
    lines.push("");

    cart.forEach((item) => {
      lines.push(`• ${item.qty}x ${item.name} (${formatCLP(item.price)})`);
      if (item.description) {
        lines.push(`  └ ${item.description}`);
      }
    });

    lines.push("");
    lines.push(`Tipo de pedido: ${deliveryType === "retiro" ? "Retiro en local" : "Delivery"}`);
if (gpsCoords) {
  lines.push("");
  lines.push("📍 UBICACIÓN GPS:");
  lines.push(
    `https://www.google.com/maps?q=${gpsCoords.lat},${gpsCoords.lng}`
  );
}
    if (deliveryType === "delivery") {
      lines.push("");
      lines.push("Datos delivery:");
      lines.push(`Nombre: ${customerName}`);
      lines.push(`Teléfono: ${customerPhone}`);
      lines.push(`Dirección: ${customerAddress}`);

      const coordsToSend =
  deliveryType === "delivery"
    ? locationMode === "address"
      ? addressCoords?.lat && addressCoords?.lng
        ? addressCoords
        : null
      : gpsCoords?.lat && gpsCoords?.lng
        ? gpsCoords
        : null
    : null;
    
if (coordsToSend) {
  lines.push(
    `Ubicación: https://www.google.com/maps?q=${coordsToSend.lat},${coordsToSend.lng}`
  );
}
      if (deliveryFee !== null) {
        lines.push(`Delivery: ${formatCLP(deliveryFee)}`);
      } else {
        lines.push("Delivery: por confirmar");
      }
    }

    if (cartNote.trim()) {
      lines.push("");
      lines.push(`Observaciones: ${cartNote}`);
    }

    lines.push("");
    lines.push(`Total: ${formatCLP(finalTotal)}`);

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`,
      "_blank"
    );
  }

  const updateScrollHints = (categoryId: string, el: HTMLDivElement) => {
    const maxScrollLeft = el.scrollWidth - el.clientWidth;

    setScrollHints((prev) => ({
      ...prev,
      [categoryId]: {
        left: el.scrollLeft > 8,
        right: el.scrollLeft < maxScrollLeft - 8,
      },
    }));
  };

  const getPageCount = (el: HTMLDivElement | null) => {
    if (!el) return 1;
    return Math.max(1, Math.round(el.scrollWidth / el.clientWidth));
  };

  const updateActivePage = (categoryId: string, el: HTMLDivElement) => {
    const pageCount = getPageCount(el);
    const page = Math.min(
      pageCount - 1,
      Math.max(0, Math.round(el.scrollLeft / Math.max(el.clientWidth, 1)))
    );

    setActivePages((prev) => ({ ...prev, [categoryId]: page }));
  };

  const handleScroll = (categoryId: string, el: HTMLDivElement) => {
    updateActivePage(categoryId, el);
    updateScrollHints(categoryId, el);
  };

  const scrollToCategory = (categoryId: string) => {
    const section = sectionRefs.current[categoryId];
    if (!section) return;
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const scrollToPage = (categoryId: string, page: number) => {
    const el = rowRefs.current[categoryId];
    if (!el) return;
    el.scrollTo({ left: el.clientWidth * page, behavior: "smooth" });
  };

  useEffect(() => {
    const handleResize = () => {
      categories.forEach((category) => {
        const el = rowRefs.current[category.id];
        if (!el) return;
        updateActivePage(category.id, el);
        updateScrollHints(category.id, el);
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    categories.forEach((category) => {
      const section = sectionRefs.current[category.id];
      if (!section) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActiveCategory(category.id);
          });
        },
        { rootMargin: "-20% 0px -60% 0px" }
      );

      observer.observe(section);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  useEffect(() => {
    document.body.style.overflow = modal || cartOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
}, [modal, cartOpen]);

useEffect(() => {
  locationModeRef.current = locationMode;
}, [locationMode]);

useEffect(() => {
  if (!cartOpen) return;
  if (deliveryType !== "delivery") return;
  if (locationMode !== "address") return;
  if (!addressInputRef.current) return;

  if (autocompleteRef.current) return;

  const timer = window.setTimeout(() => {
    if (!(window as any).google?.maps?.places) {
      console.log("Google Places no cargó");
      return;
    }

    const autocomplete =
      new window.google.maps.places.Autocomplete(
        addressInputRef.current!,
        {
          componentRestrictions: { country: "cl" },
        }
      );

    autocompleteRef.current = autocomplete;

    autocomplete.addListener("place_changed", async () => {
      const place = autocomplete.getPlace();

      if (!place.geometry?.location) {
        console.log("No geometry");
        return;
      }

      const coords = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };

      console.log("DIRECCION SELECCIONADA:", coords);

      setCustomerAddress(
        place.formatted_address || place.name || ""
      );

      setAddressCoords(coords);
      setGpsCoords(null);

      setLocationMessage("Dirección confirmada.");

      await calculateDeliveryForCoords(
        coords,
        "address"
      );
    });
  }, 300);

  return () => {
    window.clearTimeout(timer);
  };
}, [cartOpen, deliveryType, locationMode]);
  return (
    <>
    <div className="menuv2-page">
    {closedModalOpen && (
  <div className="menuv2-closed-overlay">
    <div className="menuv2-closed-modal">

      <button
        className="menuv2-closed-close"
        onClick={() => setClosedModalOpen(false)}
      >
        ✕
      </button>

      <img
        src="/productos/cerrado.png"
        alt="Cerrado"
        className="menuv2-closed-image"
      />

      <p className="menuv2-closed-text">
        {FORCE_STORE_CLOSED ? FORCE_CLOSED_MESSAGE : "En este momento no estamos recibiendo pedidos."}
      </p>

      <div className="menuv2-closed-box">
        <div className="menuv2-closed-box-title">
          Horario de atención
        </div>

        <div className="menuv2-closed-schedule">
          <div>Domingo a Viernes: 18:00 a 00:00</div>
          <div>Sábado: 13:00 a 00:00</div>
        </div>
      </div>

      <div className="menuv2-closed-box">
        <div className="menuv2-closed-contact">
          Para delegaciones, comunícate directamente al:
        </div>

        <div className="menuv2-closed-phone">
          +56 9 5615 4280
        </div>
      </div>

      <button
        className="menuv2-closed-button"
        onClick={() => setClosedModalOpen(false)}
      >
        Entendido
      </button>

    </div>
  </div>
)}
      <div className="menuv2-container">
        <header className="menuv2-header">
          <div className="menuv2-brand">Di Mauro</div>
          <h1 className="menuv2-title">Menú</h1>
        </header>

        <nav className="menuv2-categories">
          {categories.map((category) => (
            <button
              key={category.id}
              className={
                category.id === activeCategory
                  ? "menuv2-pill menuv2-pill--active"
                  : "menuv2-pill"
              }
              onClick={() => scrollToCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </nav>

        {categories.map((category) => {
          const baseProducts = products.filter(
            (p) => p.category === category.id && p.type !== "hidden"
          );

          const sectionProducts: any[] =
            category.id === "pizzas"
              ? [customPizzaCard, ...baseProducts]
              : baseProducts;

          if (!sectionProducts.length) return null;

          const hints = scrollHints[category.id] ?? { left: false, right: false };
          const activePage = activePages[category.id] ?? 0;
          const pageCount = getPageCount(rowRefs.current[category.id]);

          return (
            <section
              key={category.id}
              className="menuv2-section"
              ref={(el) => {
                sectionRefs.current[category.id] = el;
              }}
            >
              <h2 className="menuv2-section-title">{category.name}</h2>

              <div className="menuv2-row-shell">
                {hints.left && (
                  <button
                    className="menuv2-arrow menuv2-arrow--left"
                    onClick={() => {
                      const el = rowRefs.current[category.id];
                      if (!el) return;
                      el.scrollBy({ left: -el.clientWidth * 0.9, behavior: "smooth" });
                    }}
                  >
                    ‹
                  </button>
                )}

                {hints.right && (
                  <button
                    className="menuv2-arrow menuv2-arrow--right"
                    onClick={() => {
                      const el = rowRefs.current[category.id];
                      if (!el) return;
                      el.scrollBy({ left: el.clientWidth * 0.9, behavior: "smooth" });
                    }}
                  >
                    ›
                  </button>
                )}

                <div
                  className="menuv2-row"
                  ref={(el) => {
                    rowRefs.current[category.id] = el;
                    if (el) {
                      requestAnimationFrame(() => {
                        updateActivePage(category.id, el);
                        updateScrollHints(category.id, el);
                      });
                    }
                  }}
                  onScroll={(e) => handleScroll(category.id, e.currentTarget)}
                >
                 {sectionProducts
                    .filter((product) => product.available !== false)
                    .map((product) => {
                    const isSelector =
                      product.type === "selector-burger" ||
                      product.type === "selector-burger-2x" ||
                      product.type === "selector-sandwich" ||
                      product.type === "selector-happy-hour" ||
                      product.type === "selector-drinks" ||
                      product.type === "selector-beer" ||
                      product.type === "selector-custom-pizza" ||
                      product.type === "pizza_fixed" ||
                      product.type === "promo_pizzas" ||
                      product.type === "promo_pizzas_drink" ||
                      product.type === "promo_dimauro" ||
                      product.type === "promo_segunda_mitad" ||
                      product.type === "simple";

                    const opens =
                      product.type === "selector-burger"
                        ? () => {
                            setSelectedBurger("rukapillan");
                            setBurgerNote("");
                            openSelector({ type: "burger" });
                          }
                        : product.type === "selector-burger-2x"
                        ? () => {
                            resetBurger2xModal();
                            openSelector({ type: "burger-2x" });
                          }
                        : product.type === "selector-sandwich"
                        ? () => openSelector({ type: "sandwich" })
                        : product.type === "selector-happy-hour"
                        ? () => openSelector({ type: "happy-hour" })
                        : product.type === "selector-drinks"
                        ? () => openSelector({ type: "drinks" })
                        : product.type === "selector-beer"
                        ? () => openSelector({ type: "beer" })
                        : product.type === "pizza_fixed"
                        ? () => {
                            setPizzaExtras([]);
                            setPizzaNote("");
                            setShowPizzaExtras(false);
                            openSelector({ type: "pizza-fixed", productId: product.id });
                          }
                        : product.type === "selector-custom-pizza"
                        ? () => {
                            resetCustomPizzaModal();
                            openSelector({ type: "custom-pizza" });
                          }
                        : product.type === "promo_pizzas"
                        ? () => {
                            resetPromoModal();
                            openSelector({ type: "promo-two-pizzas" });
                          }
                        : product.type === "promo_pizzas_drink"
                        ? () => {
                            resetPromoTragoModal();
                            openSelector({ type: "promo-two-pizzas-drink" });
                          }
                        : product.type === "promo_dimauro"
                        ? () => {
                            setPromoDiMauroSauce("tomate");
                            setPromoDiMauroIngredients([]);
                            setPromoDiMauroCoctel("pisco-sour");
                            setPromoDiMauroNote("");
                            setPromoDiMauroExtras({});
                            setPromoDiMauroExtrasOpen(false);
                            openSelector({ type: "promo-dimauro" });
                          }
                        : product.type === "promo_segunda_mitad"
                        ? () => {
                            setPromoSegundaTab("pizza1");
                            setPromoSegundaPizza1(null);
                            setPromoSegundaPizza2(null);
                            setPromoSegundaNote("");
                            openSelector({ type: "promo-segunda-mitad" });
                          }
                        : null;

                    return (
                      <article
                        key={product.id}
                        className={
                          isSelector
                            ? "menuv2-card menuv2-card--clickable"
                            : product.type === "simple"
                            ? "menuv2-card menuv2-card--clickable"
                            : "menuv2-card"
                        }
                        onClick={(e) => {
                          const target = e.target as HTMLElement;
                          if (target.closest("button")) return;
                          if (opens) {
                            opens();
                          } else if (product.type === "simple") {
                            addToCart(product);
                          }
                        }}
                      >
                          <div className="menuv2-image-wrap">
                          <img
                          src={getProductImage(product)}
                          alt={product.name}
                          className="menuv2-image"
                          />
                        </div>

                        <div className="menuv2-card-body">
                          <h3 className="menuv2-card-title">{product.name}</h3>

                          {product.type === "selector-burger" ||
                          product.type === "selector-sandwich" ||
                          product.type === "selector-happy-hour" ||
                          product.type === "selector-beer" ||
                          product.type === "selector-custom-pizza" ? (
                            <>
                              <div
                                style={{
                                  fontSize: "13px",
                                  color: "#6b7280",
                                  marginBottom: "-4px",
                                  fontWeight: 500,
                                }}
                              >
                                Desde
                              </div>
                              <div className="menuv2-price">{formatCLP(product.price)}</div>
                            </>
                          ) : product.type === "promo_segunda_mitad" ? (
                            <div className="menuv2-price">50% menos en la 2°</div>
                          ) : (
                            <div className="menuv2-price">{formatCLP(product.price)}</div>
                          )}

                          <p className="menuv2-description">{product.shortDescription}</p>

                          <button
                            className="menuv2-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (opens) {
                                opens();
                                return;
                              }
                              addToCart(product);
                            }}
                          >
                            {product.type === "selector-custom-pizza" ? "Armar" : "Agregar"}
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>

              <div className="menuv2-dots">
                {Array.from({ length: pageCount }).map((_, index) => (
                  <button
                    key={`${category.id}-dot-${index}`}
                    type="button"
                    className="menuv2-dot"
                    onClick={() => scrollToPage(category.id, index)}
                    style={{
                      background:
                        index === activePage ? "#dc2626" : "rgba(17, 24, 39, 0.18)",
                    }}
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {cartQty > 0 && (
        <button className="menuv2-cart-floating" onClick={() => setCartOpen(true)}>
          {cartQty} productos · {formatCLP(finalTotal)}
        </button>
      )}

      {modal && (
        <div className="menuv2-modal-backdrop" onClick={closeModal}>
          <div className="menuv2-modal" onClick={(e) => e.stopPropagation()}>
            <div className="menuv2-modal-header">
              <h3 className="menuv2-modal-title">
                {modal.type === "burger" && "Elige tu Burger"}
                {modal.type === "burger-2x" && "Promo Burger 2x"}
                {modal.type === "sandwich" && "Elige tu Sandwich"}
                {modal.type === "happy-hour" && "Elige tu trago"}
                {modal.type === "drinks" && "Bebidas"}
                {modal.type === "beer" && "Cervezas"}
                {modal.type === "pizza-fixed" && modalPizzaProduct?.name}
                {modal.type === "custom-pizza" && "Arma tu Pizza"}
                {modal.type === "promo-two-pizzas" && "2 Pizzas Familiares"}
                {modal.type === "promo-segunda-mitad" && "La Segunda a Mitad de Precio"}
              </h3>

              <button className="menuv2-modal-close" onClick={closeModal}>✕</button>
            </div>

            {modal.type === "burger" && (
              <div className="menuv2-modal-body">
                {burgerOptions.map((option) => (
                  <button
                    key={option.id}
                    className={selectedBurger === option.id ? "menuv2-option menuv2-option--active" : "menuv2-option"}
                    onClick={() => setSelectedBurger(option.id)}
                  >
                    <div className="menuv2-option-top">
                      <strong>{option.name}</strong>
                      <span>{formatCLP(option.price)}</span>
                    </div>
                    <div className="menuv2-option-text">{option.description}</div>
                  </button>
                ))}

                <input className="menuv2-note-input" type="text" maxLength={30} placeholder="Observaciones" value={burgerNote} onChange={(e) => setBurgerNote(e.target.value)} />

                <button
                  className="menuv2-modal-add"
                  onClick={() => {
                    addToCart({
                      id: `burger-${burgerSelected.id}-${burgerNote || "sin-nota"}`,
                      name: `Burger ${burgerSelected.name}`,
                      price: burgerSelected.price,
                      description: `${burgerSelected.description}${burgerNote ? ` · Obs: ${burgerNote}` : ""}`,
                    });
                    setBurgerNote("");
                    closeModal();
                  }}
                >
                  Agregar al carrito · {formatCLP(burgerSelected.price)}
                </button>
              </div>
            )}

            {modal.type === "burger-2x" && (
              <div className="menuv2-modal-body">
                {burgerOptions.map((option) => (
                  <div key={option.id} className="menuv2-counter-card">
                    <div className="menuv2-option-top">
                      <strong>{option.name}</strong>
                      <span>{formatCLP(option.price)}</span>
                    </div>
                    <div className="menuv2-option-text">{option.description}</div>

                    <div className="menuv2-counter-row">
                      <button className="menuv2-counter-btn" onClick={() => changeBurgerQty(option.id, -1)}>−</button>
                      <span className="menuv2-counter-value">{burgerQtys[option.id] ?? 0}</span>
                      <button className="menuv2-counter-btn" onClick={() => changeBurgerQty(option.id, 1)}>+</button>
                    </div>
                  </div>
                ))}

                <input className="menuv2-note-input" type="text" maxLength={30} placeholder="Observaciones" value={burgerNote} onChange={(e) => setBurgerNote(e.target.value)} />

                <button
                  className="menuv2-modal-add"
                  onClick={() => {
                    if (burgerTotalQty !== 2) return;

                    const selectedItems = burgerOptions.filter((option) => (burgerQtys[option.id] ?? 0) > 0);

                    addToCart({
                      id: `promo-burger-2x-${Object.entries(burgerQtys).map(([key, value]) => `${key}-${value}`).join("-")}-${burgerNote || "sin-nota"}`,
                      name: "Promo Burger 2x",
                      price: 15900,
                      description: `${selectedItems.map((item) => `${item.name} x${burgerQtys[item.id] ?? 0}`).join(", ")}${burgerNote ? ` · Obs: ${burgerNote}` : ""}`,
                    });

                    resetBurger2xModal();
                    closeModal();
                  }}
                >
                  Agregar al carrito · {formatCLP(15900)}
                </button>
              </div>
            )}

            {modal.type === "sandwich" && (
              <div className="menuv2-modal-body">
                <div className="menuv2-modal-subtitle">Proteína</div>
                <div className="menuv2-chip-group">
                  {sandwichProteins.map((protein) => (
                    <button key={protein.id} className={selectedProtein === protein.id ? "menuv2-chip menuv2-chip--active" : "menuv2-chip"} onClick={() => setSelectedProtein(protein.id)}>
                      {protein.name}
                    </button>
                  ))}
                </div>

                <div className="menuv2-modal-subtitle">Estilo</div>
                <div className="menuv2-option-list">
                  {sandwichStyles.map((style) => (
                    <button key={style.id} className={selectedStyle === style.id ? "menuv2-option menuv2-option--active" : "menuv2-option"} onClick={() => setSelectedStyle(style.id)}>
                      <div className="menuv2-option-top">
                        <strong>{style.name}</strong>
                        <span>{formatCLP(sandwichPrices[selectedProtein][style.id])}</span>
                      </div>
                      <div className="menuv2-option-text">{sandwichDescriptions[style.id]}</div>
                    </button>
                  ))}
                </div>

                {selectedStyle === "chacarero" && (
                  <label className="menuv2-check-row">
                    <input type="checkbox" checked={selectedAji} onChange={(e) => setSelectedAji(e.target.checked)} />
                    <span>Agregar ají</span>
                  </label>
                )}

                <input className="menuv2-note-input" type="text" maxLength={30} placeholder="Observaciones" value={sandwichNote} onChange={(e) => setSandwichNote(e.target.value)} />

                <button
                  className="menuv2-modal-add"
                  onClick={() => {
                    addToCart({
                      id: `sandwich-${selectedProtein}-${selectedStyle}-${selectedAji ? "aji" : "sin-aji"}-${sandwichNote || "sin-nota"}`,
                      name: `Sandwich ${sandwichStyleName}`,
                      price: sandwichPrice,
                      description: `${sandwichProteinName}${selectedStyle === "chacarero" && selectedAji ? " + ají" : ""}${sandwichNote ? ` · Obs: ${sandwichNote}` : ""}`,
                    });
                    setSandwichNote("");
                    closeModal();
                  }}
                >
                  Agregar al carrito · {formatCLP(sandwichPrice)}
                </button>
              </div>
            )}

            {modal.type === "happy-hour" && (
              <div className="menuv2-modal-body">
                <div className="menuv2-modal-subtitle">Formato</div>
                <div className="menuv2-chip-group">
                  {happyHourSizes.map((size) => (
                    <button key={size.id} className={selectedHappyHourSize === size.id ? "menuv2-chip menuv2-chip--active" : "menuv2-chip"} onClick={() => setSelectedHappyHourSize(size.id)}>
                      {size.name}
                    </button>
                  ))}
                </div>

                <div className="menuv2-modal-subtitle">Trago</div>
                <div className="menuv2-option-list">
                  {happyHourOptions.map((option) => {
                    const isSelected = selectedHappyHour === option.id;

                    return (
                      <div key={option.id}>
                        <button
                          className={isSelected ? "menuv2-option menuv2-option--active" : "menuv2-option"}
                          onClick={() => {
                            setSelectedHappyHour(option.id);
                            setSelectedHappyHourFlavor("");
                          }}
                        >
                          <div className="menuv2-option-top">
                            <strong>{option.name}</strong>
                            <span>{formatCLP(option.prices[selectedHappyHourSize as keyof typeof option.prices])}</span>
                          </div>
                          <div className="menuv2-option-text">{option.flavors.length > 0 ? "Con sabores disponibles" : ""}</div>
                        </button>

                        {isSelected && option.flavors.length > 0 && (
                          <div className="menuv2-inline-flavors">
                            <div className="menuv2-chip-group">
                              {option.flavors.map((flavor) => (
                                <button key={flavor} className={happyHourActiveFlavor === flavor ? "menuv2-chip menuv2-chip--active" : "menuv2-chip"} onClick={() => setSelectedHappyHourFlavor(flavor)}>
                                  {flavor}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                <input className="menuv2-note-input" type="text" maxLength={30} placeholder="Observaciones" value={happyHourNote} onChange={(e) => setHappyHourNote(e.target.value)} />

                <button
                  className="menuv2-modal-add"
                  onClick={() => {
                    addToCart({
                      id: `happy-hour-${happyHourSelected.id}-${selectedHappyHourSize}-${happyHourActiveFlavor || "sin-sabor"}-${happyHourNote || "sin-nota"}`,
                      name: happyHourSelected.name,
                      price: happyHourPrice,
                      description: `${selectedHappyHourSize === "medio" ? "Medio Litro" : "Litro"}${happyHourActiveFlavor ? ` · ${happyHourActiveFlavor}` : ""}${happyHourNote ? ` · Obs: ${happyHourNote}` : ""}`,
                    });
                    setHappyHourNote("");
                    closeModal();
                  }}
                >
                  Agregar al carrito · {formatCLP(happyHourPrice)}
                </button>
              </div>
            )}

            {modal.type === "drinks" && (
              <div className="menuv2-modal-body">
                <div className="menuv2-modal-subtitle">Tipo</div>
                <div className="menuv2-chip-group">
                  <button className={selectedDrinkType === "normal" ? "menuv2-chip menuv2-chip--active" : "menuv2-chip"} onClick={() => setSelectedDrinkType("normal")}>Normal</button>
                  <button className={selectedDrinkType === "zero" ? "menuv2-chip menuv2-chip--active" : "menuv2-chip"} onClick={() => setSelectedDrinkType("zero")}>Zero</button>
                </div>

                <div className="menuv2-modal-subtitle">Bebida</div>
                <div className="menuv2-chip-group">
                  <button className={selectedDrinkBrand === "coca" ? "menuv2-chip menuv2-chip--active" : "menuv2-chip"} onClick={() => setSelectedDrinkBrand("coca")}>Coca-Cola</button>
                  <button className={selectedDrinkBrand === "sprite" ? "menuv2-chip menuv2-chip--active" : "menuv2-chip"} onClick={() => setSelectedDrinkBrand("sprite")}>Sprite</button>
                  <button className={selectedDrinkBrand === "fanta" ? "menuv2-chip menuv2-chip--active" : "menuv2-chip"} onClick={() => setSelectedDrinkBrand("fanta")}>Fanta</button>
                </div>

                <input className="menuv2-note-input" type="text" maxLength={30} placeholder="Observaciones" value={drinkNote} onChange={(e) => setDrinkNote(e.target.value)} />

                <button
                  className="menuv2-modal-add"
                  onClick={() => {
                    const brandName = selectedDrinkBrand === "coca" ? "Coca-Cola" : selectedDrinkBrand === "sprite" ? "Sprite" : "Fanta";
                    const typeName = selectedDrinkType === "zero" ? "Zero" : "Normal";

                    addToCart({
                      id: `bebida-${selectedDrinkBrand}-${selectedDrinkType}-${drinkNote || "sin-nota"}`,
                      name: `${brandName} ${typeName}`,
                      price: 3900,
                      description: drinkNote ? `Obs: ${drinkNote}` : "",
                    });

                    setDrinkNote("");
                    closeModal();
                  }}
                >
                  Agregar al carrito · {formatCLP(3900)}
                </button>
              </div>
            )}

            {modal.type === "beer" && (
              <div className="menuv2-modal-body">
                {beerOptions.map((beer) => (
                  <button key={beer.id} className={selectedBeer === beer.id ? "menuv2-option menuv2-option--active" : "menuv2-option"} onClick={() => setSelectedBeer(beer.id as "heineken" | "torobayo" | "calafate")}>
                    <div className="menuv2-option-top">
                      <strong>{beer.name}</strong>
                      <span>{formatCLP(beer.price)}</span>
                    </div>
                    <div className="menuv2-option-text"></div>
                  </button>
                ))}

                <input className="menuv2-note-input" type="text" maxLength={30} placeholder="Observaciones" value={beerNote} onChange={(e) => setBeerNote(e.target.value)} />

                <button
                  className="menuv2-modal-add"
                  onClick={() => {
                    addToCart({
                      id: `cerveza-${beerSelected.id}-${beerNote || "sin-nota"}`,
                      name: beerSelected.name,
                      price: beerSelected.price,
                      description: beerNote ? `Obs: ${beerNote}` : "",
                    });

                    setBeerNote("");
                    closeModal();
                  }}
                >
                  Agregar al carrito · {formatCLP(beerSelected.price)}
                </button>
              </div>
            )}

            {modal.type === "pizza-fixed" && modalPizzaProduct && (
              <div className="menuv2-modal-body">
                <div className="menuv2-modal-subtitle">Ingredientes base</div>
                <div className="menuv2-base-list">
                  {pizzaBaseIngredientNames.map((name) => (
                    <div key={name} className="menuv2-base-line">{name}</div>
                  ))}
                </div>

                <button className="menuv2-expand-title" onClick={() => setShowPizzaExtras((prev) => !prev)}>
                  {showPizzaExtras ? "▼" : "▶"} Ingredientes adicionales ({pizzaExtras.length} / {CUSTOM_PIZZA_MAX_TOTAL})
                </button>

                {showPizzaExtras && (
                  <div className="menuv2-ingredient-list">
                    {ingredients.map((ingredient) => {
                      const qty = pizzaExtras.filter((item) => item === ingredient.id).length;

                      return (
                        <div key={ingredient.id} className="menuv2-ingredient-row">
                          <span>{ingredient.name} · {formatCLP(ingredient.price)}</span>
                          <div className="menuv2-counter-row">
                            <button className="menuv2-counter-btn" onClick={() => changeCustomPizzaIngredientQty(ingredient.id, -1, setPizzaExtras)}>−</button>
                            <span className="menuv2-counter-value">{qty}</span>
                            <button className="menuv2-counter-btn" onClick={() => changeCustomPizzaIngredientQty(ingredient.id, 1, setPizzaExtras)}>+</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <input className="menuv2-note-input" type="text" maxLength={30} placeholder="Observaciones" value={pizzaNote} onChange={(e) => setPizzaNote(e.target.value)} />

                <button
                  className="menuv2-modal-add"
                  onClick={() => {
                    const extrasText = pizzaExtras.map((id) => ingredients.find((item) => item.id === id)?.name || id).join(", ");

                    addToCart({
                      id: `pizza-${modalPizzaProduct.id}-${pizzaExtras.join("-") || "sin-extras"}-${pizzaNote || "sin-nota"}`,
                      name: modalPizzaProduct.name,
                      price: modalPizzaProduct.price + pizzaExtraTotal,
                      description: `${pizzaBaseIngredientNames.join(", ")}${extrasText ? ` + ${extrasText}` : ""}${pizzaNote ? ` · Obs: ${pizzaNote}` : ""}`,
                    });

                    setPizzaExtras([]);
                    setPizzaNote("");
                    setShowPizzaExtras(false);
                    closeModal();
                  }}
                >
                  Agregar al carrito · {formatCLP(modalPizzaProduct.price + pizzaExtraTotal)}
                </button>
              </div>
            )}

            {modal.type === "custom-pizza" && (
              <div className="menuv2-modal-body">
                <div className="menuv2-modal-subtitle">Salsa base</div>
                <div className="menuv2-chip-group">
                  {promoPizzaSauces.map((sauce) => (
                    <button key={`custom-${sauce.id}`} className={customPizzaSauce === sauce.id ? "menuv2-chip menuv2-chip--active" : "menuv2-chip"} onClick={() => setCustomPizzaSauce(sauce.id)}>
                      {sauce.name}
                    </button>
                  ))}
                </div>

                <div className="menuv2-modal-subtitle">
                  Ingredientes ({customPizzaIngredientCount} / {CUSTOM_PIZZA_MAX_TOTAL})
                </div>

                <div className="menuv2-ingredient-list">
                  {ingredients.map((ingredient) => {
                    const qty = customPizzaExtras.filter((item) => item === ingredient.id).length;

                    return (
                      <div key={ingredient.id} className="menuv2-ingredient-row">
                        <span>{ingredient.name} · {formatCLP(ingredient.price)}</span>
                        <div className="menuv2-counter-row">
                          <button className="menuv2-counter-btn" onClick={() => changeCustomPizzaIngredientQty(ingredient.id, -1, setCustomPizzaExtras)}>−</button>
                          <span className="menuv2-counter-value">{qty}</span>
                          <button className="menuv2-counter-btn" onClick={() => changeCustomPizzaIngredientQty(ingredient.id, 1, setCustomPizzaExtras)}>+</button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <input className="menuv2-note-input" type="text" maxLength={30} placeholder="Observaciones" value={customPizzaNote} onChange={(e) => setCustomPizzaNote(e.target.value)} />

                <button
                  className="menuv2-modal-add"
                  onClick={() => {
                    const extrasText = customPizzaExtras.map((id) => ingredients.find((item) => item.id === id)?.name || id).join(", ");
                    const sauceName = promoPizzaSauces.find((item) => item.id === customPizzaSauce)?.name || customPizzaSauce;

                    addToCart({
                      id: `custom-pizza-${customPizzaSauce}-${customPizzaExtras.join("-") || "base"}-${customPizzaNote || "sin-nota"}`,
                      name: "Arma tu Pizza",
                      price: customPizzaTotal,
                      description: `Salsa ${sauceName}, mozzarella${extrasText ? ` + ${extrasText}` : ""}${customPizzaNote ? ` · Obs: ${customPizzaNote}` : ""}`,
                    });

                    resetCustomPizzaModal();
                    closeModal();
                  }}
                >
                  Agregar al carrito · {formatCLP(customPizzaTotal)}
                </button>
              </div>
            )}

            {modal.type === "promo-two-pizzas" && (
              <div className="menuv2-modal-body">
                <div className="menuv2-modal-subtitle">Elige salsa y 3 ingredientes por pizza</div>

                <div className="menuv2-chip-group">
                  <button className={promoTab === "pizza1" ? "menuv2-chip menuv2-chip--active" : "menuv2-chip"} onClick={() => setPromoTab("pizza1")}>Pizza 1 {promoPizza1.length === 3 ? "✓" : ""}</button>
                  <button className={promoTab === "pizza2" ? "menuv2-chip menuv2-chip--active" : "menuv2-chip"} onClick={() => setPromoTab("pizza2")}>Pizza 2 {promoPizza2.length === 3 ? "✓" : ""}</button>
                </div>

                <div className="menuv2-modal-subtitle">Salsa base</div>
                <div className="menuv2-chip-group">
                  {promoPizzaSauces.map((sauce) => (
                    <button
                      key={`${promoTab}-${sauce.id}`}
                      className={(promoTab === "pizza1" ? promoPizza1Sauce : promoPizza2Sauce) === sauce.id ? "menuv2-chip menuv2-chip--active" : "menuv2-chip"}
                      onClick={() => {
                        if (promoTab === "pizza1") setPromoPizza1Sauce(sauce.id);
                        else setPromoPizza2Sauce(sauce.id);
                      }}
                    >
                      {sauce.name}
                    </button>
                  ))}
                </div>

                <div className="menuv2-modal-subtitle">
                  Ingredientes ({promoTab === "pizza1" ? promoPizza1.length : promoPizza2.length}/3)
                </div>

                <div className="menuv2-ingredient-list">
                  {promoPizzaIngredients.map((ingredient) => {
                    const selectedList = promoTab === "pizza1" ? promoPizza1 : promoPizza2;
                    const setter = promoTab === "pizza1" ? setPromoPizza1 : setPromoPizza2;
                    const qty = selectedList.filter((item) => item === ingredient.id).length;

                    return (
                      <div key={`${promoTab}-${ingredient.id}`} className="menuv2-ingredient-row">
                        <span>{ingredient.name}</span>
                        <div className="menuv2-counter-row">
                          <button className="menuv2-counter-btn" onClick={() => changePromoIngredientQty(ingredient.id, -1, setter)}>−</button>
                          <span className="menuv2-counter-value">{qty}</span>
                          <button className="menuv2-counter-btn" onClick={() => changePromoIngredientQty(ingredient.id, 1, setter)}>+</button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Extras pagados por pizza */}
                <button
                  style={{
                    background: promoTwoPizzasExtrasOpen ? "#fff8f8" : "#f9f9f9",
                    border: promoTwoPizzasExtrasOpen ? "1px solid #cc0000" : "1px solid #eee",
                    borderRadius: promoTwoPizzasExtrasOpen ? "10px 10px 0 0" : "10px",
                    padding: "9px 14px",
                    fontSize: "12px",
                    color: promoTwoPizzasExtrasOpen ? "#cc0000" : "#666",
                    width: "100%",
                    textAlign: "left",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  onClick={() => setPromoTwoPizzasExtrasOpen(!promoTwoPizzasExtrasOpen)}
                >
                  <span>{promoTwoPizzasExtrasOpen ? "▼" : "▶"} Extras {promoTab === "pizza1" ? "Pizza 1" : "Pizza 2"} ({promoTab === "pizza1" ? promoTwoPizzasExtrasCount1 : promoTwoPizzasExtrasCount2}/6)</span>
                  <span style={{ fontSize: "11px", color: "#888" }}>máx. 3 c/u</span>
                </button>
                {promoTwoPizzasExtrasOpen && (
                  <div style={{ border: "1px solid #cc0000", borderTop: "none", borderRadius: "0 0 10px 10px", overflow: "hidden", marginTop: "-1px" }}>
                    {promoSegundaExtrasList.map((ing, idx) => {
                      const extras = promoTab === "pizza1" ? promoTwoPizzasExtras1 : promoTwoPizzasExtras2;
                      const setExtras = promoTab === "pizza1" ? setPromoTwoPizzasExtras1 : setPromoTwoPizzasExtras2;
                      const count = extras[ing.id] || 0;
                      const totalCount = promoTab === "pizza1" ? promoTwoPizzasExtrasCount1 : promoTwoPizzasExtrasCount2;
                      return (
                        <div
                          key={`two-extra-${ing.id}`}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "8px 14px",
                            borderBottom: idx < promoSegundaExtrasList.length - 1 ? "1px solid #f5f5f5" : "none",
                            background: idx % 2 === 1 ? "#fafafa" : "#fff",
                          }}
                        >
                          <div>
                            <div style={{ fontSize: "13px", color: "#333", fontWeight: 600 }}>{ing.name}</div>
                            <div style={{ fontSize: "11px", color: "#888" }}>{formatCLP(ing.price)}</div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <button
                              style={{ background: "#f0f0f0", border: "none", borderRadius: "99px", width: "26px", height: "26px", fontSize: "15px", cursor: "pointer", fontWeight: 700 }}
                              onClick={() => setExtras((prev) => ({ ...prev, [ing.id]: Math.max(0, (prev[ing.id] || 0) - 1) }))}
                            >−</button>
                            <span style={{ fontSize: "13px", fontWeight: 700, minWidth: "16px", textAlign: "center" }}>{count}</span>
                            <button
                              style={{ background: totalCount >= 6 || count >= 3 ? "#ddd" : "#cc0000", border: "none", borderRadius: "99px", width: "26px", height: "26px", fontSize: "15px", cursor: "pointer", color: "white", fontWeight: 700 }}
                              disabled={totalCount >= 6 || count >= 3}
                              onClick={() => setExtras((prev) => ({ ...prev, [ing.id]: (prev[ing.id] || 0) + 1 }))}
                            >+</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                <input className="menuv2-note-input" type="text" maxLength={30} placeholder="Observaciones" value={promoNote} onChange={(e) => setPromoNote(e.target.value)} />

                <button
                  className="menuv2-modal-add"
                  onClick={() => {
                    if (promoPizza1.length !== 3 || promoPizza2.length !== 3) return;

                    const pizza1Text = promoPizza1.map((id) => ingredients.find((item) => item.id === id)?.name || id).join(", ");
                    const pizza2Text = promoPizza2.map((id) => ingredients.find((item) => item.id === id)?.name || id).join(", ");
                    const sauce1Name = promoPizzaSauces.find((item) => item.id === promoPizza1Sauce)?.name || promoPizza1Sauce;
                    const sauce2Name = promoPizzaSauces.find((item) => item.id === promoPizza2Sauce)?.name || promoPizza2Sauce;
                    const extras1Text = Object.entries(promoTwoPizzasExtras1).filter(([, qty]) => qty > 0).map(([id, qty]) => { const ing = ingredients.find((i) => i.id === id); return ing ? `${ing.name} ×${qty}` : id; }).join(", ");
                    const extras2Text = Object.entries(promoTwoPizzasExtras2).filter(([, qty]) => qty > 0).map(([id, qty]) => { const ing = ingredients.find((i) => i.id === id); return ing ? `${ing.name} ×${qty}` : id; }).join(", ");

                    addToCart({
                      id: `promo-2-pizzas-${promoPizza1Sauce}-${promoPizza1.join("-")}-${promoPizza2Sauce}-${promoPizza2.join("-")}-${promoNote || "sin-nota"}`,
                      name: "2 Pizzas Familiares",
                      price: promoTwoPizzasPrice + promoTwoPizzasExtrasTotal,
                      description: `Pizza 1: Salsa ${sauce1Name}, mozzarella, ${pizza1Text}${extras1Text ? ` + ${extras1Text}` : ""} · Pizza 2: Salsa ${sauce2Name}, mozzarella, ${pizza2Text}${extras2Text ? ` + ${extras2Text}` : ""}${promoNote ? ` · Obs: ${promoNote}` : ""}`,
                    });

                    resetPromoModal();
                    closeModal();
                  }}
                >
                  Agregar al carrito · {formatCLP(promoTwoPizzasPrice + promoTwoPizzasExtrasTotal)}
                </button>
              </div>
            )}

            {modal.type === "promo-two-pizzas-drink" && (
              <div className="menuv2-modal-body">
                <div className="menuv2-modal-subtitle">Elige salsa y 3 ingredientes por pizza</div>

                <div className="menuv2-chip-group">
                  <button className={promoTab === "pizza1" ? "menuv2-chip menuv2-chip--active" : "menuv2-chip"} onClick={() => setPromoTab("pizza1")}>Pizza 1</button>
                  <button className={promoTab === "pizza2" ? "menuv2-chip menuv2-chip--active" : "menuv2-chip"} onClick={() => setPromoTab("pizza2")}>Pizza 2</button>
                </div>

                <div className="menuv2-modal-subtitle">Salsa base</div>
                <div className="menuv2-chip-group">
                  {promoPizzaSauces.map((sauce) => (
                    <button
                      key={`drink-${promoTab}-${sauce.id}`}
                      className={(promoTab === "pizza1" ? promoPizza1Sauce : promoPizza2Sauce) === sauce.id ? "menuv2-chip menuv2-chip--active" : "menuv2-chip"}
                      onClick={() => {
                        if (promoTab === "pizza1") setPromoPizza1Sauce(sauce.id);
                        else setPromoPizza2Sauce(sauce.id);
                      }}
                    >
                      {sauce.name}
                    </button>
                  ))}
                </div>

                <div className="menuv2-modal-subtitle">
                  Ingredientes ({promoTab === "pizza1" ? promoPizza1.length : promoPizza2.length}/3)
                </div>

                <div className="menuv2-ingredient-list">
                  {promoPizzaIngredients.map((ingredient) => {
                    const selectedList = promoTab === "pizza1" ? promoPizza1 : promoPizza2;
                    const setter = promoTab === "pizza1" ? setPromoPizza1 : setPromoPizza2;
                    const qty = selectedList.filter((item) => item === ingredient.id).length;

                    return (
                      <div key={`drink-${promoTab}-${ingredient.id}`} className="menuv2-ingredient-row">
                        <span>{ingredient.name}</span>
                        <div className="menuv2-counter-row">
                          <button className="menuv2-counter-btn" onClick={() => changePromoIngredientQty(ingredient.id, -1, setter)}>−</button>
                          <span className="menuv2-counter-value">{qty}</span>
                          <button className="menuv2-counter-btn" onClick={() => changePromoIngredientQty(ingredient.id, 1, setter)}>+</button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="menuv2-modal-subtitle">Trago a elección (1 litro)</div>
                <div className="menuv2-chip-group">
                  <button
                    className={promoTrago === "pisco-sour" ? "menuv2-chip menuv2-chip--active" : "menuv2-chip"}
                    onClick={() => setPromoTrago("pisco-sour")}
                  >
                    Pisco Sour
                  </button>
                  <button
                    className={promoTrago === "mojito-tradicional" ? "menuv2-chip menuv2-chip--active" : "menuv2-chip"}
                    onClick={() => setPromoTrago("mojito-tradicional")}
                  >
                    Mojito Tradicional
                  </button>
                </div>

                <input className="menuv2-note-input" type="text" maxLength={30} placeholder="Observaciones" value={promoTragoNote} onChange={(e) => setPromoTragoNote(e.target.value)} />

                <button
                  className="menuv2-modal-add"
                  disabled={promoPizza1.length !== 3 || promoPizza2.length !== 3}
                  onClick={() => {
                    if (promoPizza1.length !== 3 || promoPizza2.length !== 3) return;

                    const pizza1Text = promoPizza1.map((id) => ingredients.find((item) => item.id === id)?.name || id).join(", ");
                    const pizza2Text = promoPizza2.map((id) => ingredients.find((item) => item.id === id)?.name || id).join(", ");
                    const sauce1Name = promoPizzaSauces.find((item) => item.id === promoPizza1Sauce)?.name || promoPizza1Sauce;
                    const sauce2Name = promoPizzaSauces.find((item) => item.id === promoPizza2Sauce)?.name || promoPizza2Sauce;
                    const tragoName = promoTrago === "pisco-sour" ? "Pisco Sour" : "Mojito Tradicional";

                    addToCart({
                      id: `promo-2-pizzas-trago-${promoPizza1Sauce}-${promoPizza1.join("-")}-${promoPizza2Sauce}-${promoPizza2.join("-")}-${promoTrago}-${promoTragoNote || "sin-nota"}`,
                      name: "2 Pizzas + Trago",
                      price: 29900,
                      description: `Pizza 1: Salsa ${sauce1Name}, mozzarella, ${pizza1Text} · Pizza 2: Salsa ${sauce2Name}, mozzarella, ${pizza2Text} · Trago: ${tragoName} (litro)${promoTragoNote ? ` · Obs: ${promoTragoNote}` : ""}`,
                    });

                    resetPromoTragoModal();
                    closeModal();
                  }}
                >
                  Agregar al carrito · {formatCLP(29900)}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {modal?.type === "promo-segunda-mitad" && (
        <div className="menuv2-modal-backdrop" onClick={closeModal}>
          <div className="menuv2-modal" onClick={(e) => e.stopPropagation()}>
            <div className="menuv2-modal-header">
              <h3 className="menuv2-modal-title">La Segunda a Mitad de Precio</h3>
              <button className="menuv2-modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="menuv2-modal-body">
                <div className="menuv2-chip-group">
                  <button
                    className={promoSegundaTab === "pizza1" ? "menuv2-chip menuv2-chip--active" : "menuv2-chip"}
                    onClick={() => setPromoSegundaTab("pizza1")}
                  >
                    Pizza 1 {promoSegundaPizza1 ? "✓" : ""}
                  </button>
                  <button
                    className={promoSegundaTab === "pizza2" ? "menuv2-chip menuv2-chip--active" : "menuv2-chip"}
                    onClick={() => setPromoSegundaTab("pizza2")}
                  >
                    Pizza 2 {promoSegundaPizza2 ? "✓" : ""}
                  </button>
                </div>

                <div className="menuv2-modal-subtitle">
                  Elige la {promoSegundaTab === "pizza1" ? "Pizza 1" : "Pizza 2"}
                </div>

                <div className="menuv2-option-list">
                  {promoSegundaPizzas.map((pizza) => {
                    const selected = promoSegundaTab === "pizza1"
                      ? promoSegundaPizza1 === pizza.id
                      : promoSegundaPizza2 === pizza.id;
                    return (
                      <button
                        key={pizza.id}
                        className={selected ? "menuv2-option menuv2-option--active" : "menuv2-option"}
                        onClick={() => {
                          if (promoSegundaTab === "pizza1") setPromoSegundaPizza1(pizza.id);
                          else setPromoSegundaPizza2(pizza.id);
                          if (promoSegundaTab === "pizza1" && !promoSegundaPizza2) setPromoSegundaTab("pizza2");
                        }}
                      >
                        <div className="menuv2-option-top">
                          <strong>{pizza.name}</strong>
                          <span>{formatCLP(pizza.price)}</span>
                        </div>
                        <div className="menuv2-option-text">{pizza.shortDescription}</div>
                      </button>
                    );
                  })}
                </div>

                {/* Extras por pizza */}
                <button
                  style={{
                    background: promoSegundaExtrasOpen ? "#fff8f8" : "#f9f9f9",
                    border: promoSegundaExtrasOpen ? "1px solid #cc0000" : "1px solid #eee",
                    borderRadius: promoSegundaExtrasOpen ? "10px 10px 0 0" : "10px",
                    padding: "9px 14px",
                    fontSize: "12px",
                    color: promoSegundaExtrasOpen ? "#cc0000" : "#666",
                    width: "100%",
                    textAlign: "left",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                  onClick={() => setPromoSegundaExtrasOpen(!promoSegundaExtrasOpen)}
                >
                  <span>{promoSegundaExtrasOpen ? "▼" : "▶"} Extras {promoSegundaTab === "pizza1" ? "Pizza 1" : "Pizza 2"} ({promoSegundaTab === "pizza1" ? promoSegundaExtrasCount1 : promoSegundaExtrasCount2}/6)</span>
                  <span style={{ fontSize: "11px", color: "#888" }}>máx. 3 c/u</span>
                </button>
                {promoSegundaExtrasOpen && (
                  <div style={{ border: "1px solid #cc0000", borderTop: "none", borderRadius: "0 0 10px 10px", overflow: "hidden", marginTop: "-1px" }}>
                    {promoSegundaExtrasList.map((ing, idx) => {
                      const extras = promoSegundaTab === "pizza1" ? promoSegundaExtras1 : promoSegundaExtras2;
                      const setExtras = promoSegundaTab === "pizza1" ? setPromoSegundaExtras1 : setPromoSegundaExtras2;
                      const count = extras[ing.id] || 0;
                      const totalCount = promoSegundaTab === "pizza1" ? promoSegundaExtrasCount1 : promoSegundaExtrasCount2;
                      return (
                        <div
                          key={ing.id}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "8px 14px",
                            borderBottom: idx < promoSegundaExtrasList.length - 1 ? "1px solid #f5f5f5" : "none",
                            background: idx % 2 === 1 ? "#fafafa" : "#fff",
                          }}
                        >
                          <div>
                            <div style={{ fontSize: "13px", color: "#333", fontWeight: 600 }}>{ing.name}</div>
                            <div style={{ fontSize: "11px", color: "#888" }}>{formatCLP(ing.price)}</div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                            <button
                              style={{ background: "#f0f0f0", border: "none", borderRadius: "99px", width: "26px", height: "26px", fontSize: "15px", cursor: "pointer", fontWeight: 700 }}
                              onClick={() => setExtras((prev) => ({ ...prev, [ing.id]: Math.max(0, (prev[ing.id] || 0) - 1) }))}
                            >−</button>
                            <span style={{ fontSize: "13px", fontWeight: 700, minWidth: "16px", textAlign: "center" }}>{count}</span>
                            <button
                              style={{ background: totalCount >= 6 || count >= 3 ? "#ddd" : "#cc0000", border: "none", borderRadius: "99px", width: "26px", height: "26px", fontSize: "15px", cursor: "pointer", color: "white", fontWeight: 700 }}
                              disabled={totalCount >= 6 || count >= 3}
                              onClick={() => setExtras((prev) => ({ ...prev, [ing.id]: (prev[ing.id] || 0) + 1 }))}
                            >+</button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                {(() => {
                  if (!promoSegundaPizza1 || !promoSegundaPizza2) return null;
                  const p1 = products.find((p) => p.id === promoSegundaPizza1)!;
                  const p2 = products.find((p) => p.id === promoSegundaPizza2)!;
                  if (!p1 || !p2) return null;
                  const pizzaMayor = p1.price >= p2.price ? p1 : p2;
                  const pizzaMenor = p1.price < p2.price ? p1 : p2;
                  return (
                    <div style={{ background: "#fff8f8", border: "1px solid #ffdddd", borderRadius: "10px", padding: "12px", marginTop: "8px" }}>
                      <div style={{ fontSize: "11px", color: "#888", marginBottom: "6px", fontWeight: 600 }}>RESUMEN</div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", padding: "3px 0" }}>
                        <span>{pizzaMayor.name}</span>
                        <span>{formatCLP(pizzaMayor.price)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", padding: "3px 0" }}>
                        <span>{pizzaMenor.name} <span style={{ fontSize: "11px", color: "#888" }}>(2ª a mitad)</span></span>
                        <span style={{ color: "#25a244" }}>{formatCLP(Math.round(pizzaMenor.price / 2))}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", padding: "3px 0", color: "#25a244" }}>
                        <span>Ahorro</span>
                        <span>-{formatCLP(promoSegundaAhorro)}</span>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", fontSize: "15px", fontWeight: 700, borderTop: "1px solid #ffdddd", marginTop: "6px", paddingTop: "8px" }}>
                        <span>Total</span>
                        <span>{formatCLP(promoSegundaTotal)}</span>
                      </div>
                    </div>
                  );
                })()}

                <input
                  className="menuv2-note-input"
                  type="text"
                  maxLength={60}
                  placeholder="Observaciones (opcional)"
                  value={promoSegundaNote}
                  onChange={(e) => setPromoSegundaNote(e.target.value)}
                />

                <button
                  className="menuv2-modal-add"
                  disabled={!promoSegundaPizza1 || !promoSegundaPizza2}
                  onClick={() => {
                    if (!promoSegundaPizza1 || !promoSegundaPizza2) return;
                    const p1 = products.find((p) => p.id === promoSegundaPizza1)!;
                    const p2 = products.find((p) => p.id === promoSegundaPizza2)!;
                    const seg1Text = Object.entries(promoSegundaExtras1).filter(([, qty]) => qty > 0).map(([id, qty]) => { const ing = ingredients.find((i) => i.id === id); return ing ? `${ing.name} x${qty}` : id; }).join(", ");
                    const seg2Text = Object.entries(promoSegundaExtras2).filter(([, qty]) => qty > 0).map(([id, qty]) => { const ing = ingredients.find((i) => i.id === id); return ing ? `${ing.name} x${qty}` : id; }).join(", ");
                    addToCart({
                      id: `promo-segunda-${promoSegundaPizza1}-${promoSegundaPizza2}-${promoSegundaNote || "sin-nota"}`,
                      name: "La Segunda a Mitad de Precio",
                      price: promoSegundaTotal + promoSegundaExtrasTotal,
                      description: `Pizza 1: ${p1.name}${seg1Text ? ` · Extras P1: ${seg1Text}` : ""} · Pizza 2: ${p2.name}${seg2Text ? ` · Extras P2: ${seg2Text}` : ""}${promoSegundaNote ? ` · Obs: ${promoSegundaNote}` : ""}`,
                    });
                    setPromoSegundaTab("pizza1");
                    setPromoSegundaPizza1(null);
                    setPromoSegundaPizza2(null);
                    setPromoSegundaNote("");
                    setPromoSegundaExtras1({});
                    setPromoSegundaExtras2({});
                    setPromoSegundaExtrasOpen(false);
                    closeModal();
                  }}
                >
                  {promoSegundaPizza1 && promoSegundaPizza2
                    ? `Agregar al carrito · ${formatCLP(promoSegundaTotal + promoSegundaExtrasTotal)}`
                    : "Elige las 2 pizzas"}
                </button>
            </div>
          </div>
        </div>
      )}

      {modal?.type === "promo-dimauro" && (
        <div className="menuv2-modal-backdrop" onClick={closeModal}>
          <div className="menuv2-modal" onClick={(e) => e.stopPropagation()}>
            <div className="menuv2-modal-header">
              <h3 className="menuv2-modal-title">Promo Parejas</h3>
              <button className="menuv2-modal-close" onClick={closeModal}>✕</button>
            </div>
            <div className="menuv2-modal-body">
              <div className="menuv2-modal-subtitle">Pizza familiar + cóctel de litro a elección</div>

              <div className="menuv2-modal-subtitle">Salsa base</div>
              <div className="menuv2-chip-group">
                {promoPizzaSauces.map((s) => (
                  <button
                    key={s.id}
                    className={promoDiMauroSauce === s.id ? "menuv2-chip menuv2-chip--active" : "menuv2-chip"}
                    onClick={() => setPromoDiMauroSauce(s.id)}
                  >
                    {s.name}
                  </button>
                ))}
              </div>

              <div className="menuv2-modal-subtitle">
                Ingredientes ({promoDiMauroIngredients.length}/3) {promoDiMauroIngredients.length === 3 ? "✓" : ""}
              </div>
              <div className="menuv2-ingredient-list">
                {promoPizzaIngredients.map((ing) => {
                  const qty = promoDiMauroIngredients.filter((i) => i === ing.id).length;
                  return (
                    <div key={ing.id} className="menuv2-ingredient-row">
                      <span>{ing.name}</span>
                      <div className="menuv2-counter-row">
                        <button className="menuv2-counter-btn" onClick={() => changePromoIngredientQty(ing.id, -1, setPromoDiMauroIngredients)}>−</button>
                        <span className="menuv2-counter-value">{qty}</span>
                        <button className="menuv2-counter-btn" onClick={() => changePromoIngredientQty(ing.id, 1, setPromoDiMauroIngredients)}>+</button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Extras pagados */}
              <button
                style={{
                  background: promoDiMauroExtrasOpen ? "#fff8f8" : "#f9f9f9",
                  border: promoDiMauroExtrasOpen ? "1px solid #cc0000" : "1px solid #eee",
                  borderRadius: promoDiMauroExtrasOpen ? "10px 10px 0 0" : "10px",
                  padding: "9px 14px",
                  fontSize: "12px",
                  color: promoDiMauroExtrasOpen ? "#cc0000" : "#666",
                  width: "100%",
                  textAlign: "left",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
                onClick={() => setPromoDiMauroExtrasOpen(!promoDiMauroExtrasOpen)}
              >
                <span>{promoDiMauroExtrasOpen ? "▼" : "▶"} Extras Pizza ({promoDiMauroExtrasCount}/6)</span>
                <span style={{ fontSize: "11px", color: "#888" }}>máx. 3 c/u</span>
              </button>
              {promoDiMauroExtrasOpen && (
                <div style={{ border: "1px solid #cc0000", borderTop: "none", borderRadius: "0 0 10px 10px", overflow: "hidden", marginTop: "-1px" }}>
                  {promoSegundaExtrasList.map((ing, idx) => {
                    const count = promoDiMauroExtras[ing.id] || 0;
                    return (
                      <div
                        key={`dimauro-extra-${ing.id}`}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "8px 14px",
                          borderBottom: idx < promoSegundaExtrasList.length - 1 ? "1px solid #f5f5f5" : "none",
                          background: idx % 2 === 1 ? "#fafafa" : "#fff",
                        }}
                      >
                        <div>
                          <div style={{ fontSize: "13px", color: "#333", fontWeight: 600 }}>{ing.name}</div>
                          <div style={{ fontSize: "11px", color: "#888" }}>{formatCLP(ing.price)}</div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <button
                            style={{ background: "#f0f0f0", border: "none", borderRadius: "99px", width: "26px", height: "26px", fontSize: "15px", cursor: "pointer", fontWeight: 700 }}
                            onClick={() => setPromoDiMauroExtras((prev) => ({ ...prev, [ing.id]: Math.max(0, (prev[ing.id] || 0) - 1) }))}
                          >−</button>
                          <span style={{ fontSize: "13px", fontWeight: 700, minWidth: "16px", textAlign: "center" }}>{count}</span>
                          <button
                            style={{ background: promoDiMauroExtrasCount >= 6 || count >= 3 ? "#ddd" : "#cc0000", border: "none", borderRadius: "99px", width: "26px", height: "26px", fontSize: "15px", cursor: "pointer", color: "white", fontWeight: 700 }}
                            disabled={promoDiMauroExtrasCount >= 6 || count >= 3}
                            onClick={() => setPromoDiMauroExtras((prev) => ({ ...prev, [ing.id]: (prev[ing.id] || 0) + 1 }))}
                          >+</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="menuv2-modal-subtitle">Cóctel de litro</div>
              <div className="menuv2-chip-group">
                {[
                  { id: "pisco-sour", name: "Pisco Sour" },
                  { id: "mojito-tradicional", name: "Mojito Tradicional" },
                  { id: "ramazzotti-spritz", name: "Ramazzotti Spritz" },
                  { id: "tropical-gin", name: "Tropical Gin" },
                ].map((c) => (
                  <button
                    key={c.id}
                    className={promoDiMauroCoctel === c.id ? "menuv2-chip menuv2-chip--active" : "menuv2-chip"}
                    onClick={() => setPromoDiMauroCoctel(c.id)}
                  >
                    {c.name}
                  </button>
                ))}
              </div>

              <input
                className="menuv2-note-input"
                type="text"
                maxLength={60}
                placeholder="Observaciones (opcional)"
                value={promoDiMauroNote}
                onChange={(e) => setPromoDiMauroNote(e.target.value)}
              />

              <button
                className="menuv2-modal-add"
                onClick={() => {
                  if (promoDiMauroIngredients.length !== 3) return;
                  const sauceName = promoPizzaSauces.find((s) => s.id === promoDiMauroSauce)?.name ?? promoDiMauroSauce;
                  const ingText = promoDiMauroIngredients
                    .map((id) => promoPizzaIngredients.find((i) => i.id === id)?.name ?? id)
                    .join(", ");
                  const coctelNames: Record<string, string> = {
                    "pisco-sour": "Pisco Sour",
                    "mojito-tradicional": "Mojito Tradicional",
                    "ramazzotti-spritz": "Ramazzotti Spritz",
                    "tropical-gin": "Tropical Gin",
                  };
                  const coctelName = coctelNames[promoDiMauroCoctel] ?? promoDiMauroCoctel;
                  const diMauroExtrasText = Object.entries(promoDiMauroExtras).filter(([, qty]) => qty > 0).map(([id, qty]) => { const ing = ingredients.find((i) => i.id === id); return ing ? `${ing.name} ×${qty}` : id; }).join(", ");
                  addToCart({
                    id: `promo-dimauro-${promoDiMauroSauce}-${promoDiMauroIngredients.join("-")}-${promoDiMauroCoctel}`,
                    name: "Promo Parejas",
                    price: 18900 + promoDiMauroExtrasTotal,
                    description: `Salsa ${sauceName}, mozzarella, ${ingText}${diMauroExtrasText ? ` + ${diMauroExtrasText}` : ""} · Cóctel: ${coctelName} (litro)${promoDiMauroNote ? ` · Obs: ${promoDiMauroNote}` : ""}`,
                  });
                  setPromoDiMauroSauce("tomate");
                  setPromoDiMauroIngredients([]);
                  setPromoDiMauroCoctel("pisco-sour");
                  setPromoDiMauroNote("");
                  setPromoDiMauroExtras({});
                  setPromoDiMauroExtrasOpen(false);
                  closeModal();
                }}
              >
                Agregar al carrito · {formatCLP(18900 + promoDiMauroExtrasTotal)}
              </button>
            </div>
          </div>
        </div>
      )}

      {cartOpen && (
  <div className="menuv2-cart-backdrop" onClick={() => setCartOpen(false)}>
    <div className="menuv2-cart-panel" onClick={(e) => e.stopPropagation()}>
      <div className="menuv2-cart-header">
        <h3>Tu pedido</h3>
        <button
          className="menuv2-modal-close"
          onClick={() => setCartOpen(false)}
        >
          ✕
        </button>
      </div>

      <div className="menuv2-cart-items">
        <div className="menuv2-checkout-section">
          <h4>1. Comanda</h4>

          {cart.map((item) => (
            <div key={item.id} className="menuv2-cart-item">
              <div className="menuv2-cart-item-main">
                <strong>{item.name}</strong>
                <span>{formatCLP(item.price)}</span>
              </div>
              {item.description && (
                <span style={{ fontSize: "11px", color: "#888", display: "block", marginTop: "2px" }}>
                  {item.description}
                </span>
              )}

              <div className="menuv2-cart-controls">
                <button onClick={() => changeCartQty(item.id, -1)}>−</button>
                <span>{item.qty}</span>
                <button onClick={() => changeCartQty(item.id, 1)}>+</button>

                <button
                  className="menuv2-cart-remove"
                  onClick={() => removeFromCart(item.id)}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="menuv2-checkout-section">
          <h4>2. Datos del cliente</h4>

          <input
            className="menuv2-checkout-input"
            type="text"
            placeholder="Nombre *"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />

          <input
            className="menuv2-checkout-input"
            type="tel"
            placeholder="Teléfono *"
            value={customerPhone}
            onChange={(e) => setCustomerPhone(e.target.value)}
          />
        </div>

        <div className="menuv2-checkout-section">
          <h4>3. Tipo de entrega</h4>

          <div className="menuv2-delivery-type">
            <button
              className={
                deliveryType === "retiro"
                  ? "menuv2-chip menuv2-chip--active"
                  : "menuv2-chip"
              }
              onClick={() => setDeliveryType("retiro")}
            >
              Retiro
            </button>

            <button
              className={
                deliveryType === "delivery"
                  ? "menuv2-chip menuv2-chip--active"
                  : "menuv2-chip"
              }
              onClick={() => setDeliveryType("delivery")}
            >
              Delivery
            </button>
          </div>
        </div>

        {deliveryType === "delivery" && (
          <div className="menuv2-checkout-section">
            <h4>4. ¿Dónde te encuentras?</h4>

            <div className="menuv2-location-tabs">
              <button
                className={
                  locationMode === "gps"
                    ? "menuv2-location-tab menuv2-location-tab--active"
                    : "menuv2-location-tab"
                }
              onClick={() => {
  setLocationMode("gps");
  setAddressCoords(null);
  setCustomerAddress("");
  setDeliveryFee(null);
  setLocationMessage("Usaremos tu GPS como estimación. Si el valor no coincide, escribe tu dirección.");
  detectUserLocation();
}}
              >
                MI UBICACIÓN
              </button>

              <button
                className={
                  locationMode === "address"
                    ? "menuv2-location-tab menuv2-location-tab--active"
                    : "menuv2-location-tab"
                }
                onClick={() => {
                  setLocationMode("address");
                  setGpsCoords(null);
                  setAddressCoords(null);
                  setDeliveryFee(null);
                  setLocationMessage("");
                }}
              >
                MI DIRECCIÓN
              </button>
            </div>

            {locationMode === "gps" && (
              <div className="menuv2-location-box">
                <button
                  className="menuv2-location-btn"
                  onClick={() => {
                    setLocationMessage("Buscando ubicación...");
                    detectUserLocation();
                  }}
                >
                  Obtener mis coordenadas 📍
                </button>

                {locationMessage && (
                  <div className="menuv2-location-message">
                    {locationMessage}
                  </div>
                )}
              </div>
            )}

            {locationMode === "address" && (
              <div className="menuv2-location-box">
                <input
                  ref={addressInputRef}
                  className="menuv2-checkout-input"
                  type="text"
                  placeholder="Escribe y selecciona tu dirección *"
                  value={customerAddress}
                  onChange={(e) => {
                    setCustomerAddress(e.target.value);
                    setDeliveryFee(null);
                    setAddressCoords(null);
                  }}
                />

                <input
                  className="menuv2-checkout-input"
                  type="text"
                  placeholder="Comentarios opcional"
                  value={cartNote}
                  onChange={(e) => setCartNote(e.target.value)}
                />
              </div>
            )}

            <div className="menuv2-map-preview">
{activeCoords ? (
  <iframe
    title="Ubicación cliente"
    src={`https://www.google.com/maps?q=${activeCoords.lat},${activeCoords.lng}&z=16&output=embed`}
    loading="lazy"
  />
) : (
  <div className="menuv2-map-placeholder">
    El mapa aparecerá cuando confirmes ubicación o dirección.
  </div>
)}
            </div>

            {deliveryFee !== null ? (
              <div className="menuv2-location-ok">
                Delivery calculado: {formatCLP(deliveryFee)}
              </div>
            ) : (
              <div className="menuv2-location-warning">
                Si está fuera de zona automática, calculamos el delivery por WhatsApp.
              </div>
            )}
          </div>
        )}
      </div>

      <div className="menuv2-cart-footer">
        <div className="menuv2-cart-total">
          <span>Subtotal</span>
          <strong>{formatCLP(cartTotal)}</strong>
        </div>

        {deliveryType === "delivery" && (
          <div className="menuv2-cart-total">
            <span>Delivery</span>
            <strong>
              {deliveryFee !== null ? formatCLP(deliveryFee) : "Por confirmar"}
            </strong>
          </div>
        )}

        <div className="menuv2-cart-total menuv2-cart-total--final">
          <span>Total</span>
          <strong>{formatCLP(finalTotal)}</strong>
        </div>

        <button
          className="menuv2-cart-checkout"
          onClick={sendOrderToWhatsApp}
          disabled={isCalculatingDelivery}
        >
          {isCalculatingDelivery
           ? "Calculando delivery..."
          : "Enviar pedido por WhatsApp"}

        </button>
      </div>
    </div>
  </div>
)}
    </div>
    </>
  );
}
