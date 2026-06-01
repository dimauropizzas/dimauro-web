export type CategoryId =
  | "promos"
  | "destacados"
  | "pizzas"
  | "burger-sandwich"
  | "acompanamientos"
  | "bebestibles"
  | "happy-hour"
  | "para-beber";

export type ProductType =
  | "simple"
  | "pizza_fixed"
  | "promo_pizzas"
  | "variant_selector"
  | "selector-burger"
  | "selector-burger-2x"
  | "selector-sandwich"
  | "selector-happy-hour"
  | "selector-drinks"
  | "selector-beer"
  | "promo_pizzas_drink"
  | "promo_dimauro"
  | "promo_segunda_mitad"
  | "hidden";

export type Ingredient = {
  id: string;
  name: string;
  price: number;
  availableForPromo: boolean;
};

export type Category = {
  id: CategoryId;
  name: string;
};

export type ProductOptionChoice = {
  id: string;
  name: string;
  priceDelta: number;
};

export type ProductOption = {
  id: string;
  name: string;
  type: "single";
  required: boolean;
  choices: ProductOptionChoice[];
};

export type Product = {
  id: string;
  category: CategoryId;
  tags?: string[];
  name: string;
  shortDescription: string;
  description?: string;
  price: number;
  image?: string;
  type: ProductType;
  baseIngredients?: string[];
  allowPaidExtras?: boolean;
  allowObservations?: boolean;
  options?: ProductOption[];
};

export const ingredients: Ingredient[] = [
  { id: "tomate", name: "Tomate", price: 1000, availableForPromo: true },
  { id: "cebolla-morada", name: "Cebolla morada", price: 1000, availableForPromo: true },
  { id: "choclo", name: "Choclo", price: 1000, availableForPromo: true },
  { id: "pimenton", name: "Pimentón", price: 1000, availableForPromo: true },
  { id: "aceituna", name: "Aceituna", price: 1000, availableForPromo: true },
  { id: "extra-mozzarella", name: "Extra mozzarella", price: 1500, availableForPromo: true },
  { id: "champinon", name: "Champiñón", price: 1500, availableForPromo: true },
  { id: "jamon", name: "Jamón", price: 1500, availableForPromo: true },
  { id: "pollo", name: "Pollo", price: 1500, availableForPromo: true },
  { id: "salame", name: "Salame", price: 1500, availableForPromo: true },
  { id: "pina", name: "Piña", price: 1500, availableForPromo: true },
  { id: "choricillo", name: "Choricillo", price: 2000, availableForPromo: true },
  { id: "chorizo-parrillero", name: "Chorizo parrillero", price: 2000, availableForPromo: true },
  { id: "pepperoni", name: "Pepperoni", price: 2000, availableForPromo: true },
  { id: "carne-mechada", name: "Carne mechada", price: 2000, availableForPromo: true },
  { id: "lomito-de-cerdo", name: "Lomito de cerdo", price: 2000, availableForPromo: true },
  { id: "pollo-bbq", name: "Pollo BBQ", price: 2000, availableForPromo: true },
  { id: "tocino", name: "Tocino", price: 3000, availableForPromo: false },
  { id: "jamon-serrano", name: "Jamón serrano", price: 4000, availableForPromo: false },
  { id: "camaron", name: "Camarón", price: 5000, availableForPromo: false },
];

export const categories: Category[] = [
  { id: "promos", name: "Promos" },
  { id: "destacados", name: "Destacados" },
  { id: "pizzas", name: "Menú Pizzas" },
  { id: "burger-sandwich", name: "Burger & Sandwich" },
  { id: "acompanamientos", name: "Acompañamientos" },
  { id: "para-beber", name: "Para beber" },
];

export const products: Product[] = [
  // ── PROMOS ──────────────────────────────────────────────────────────────────
  {
    id: "promo-dimauro",
    category: "promos",
    tags: ["promos"],
    name: "Promo Parejas",
    shortDescription: "Pizza familiar 3 ingredientes + cóctel de litro a elección",
    description: "1 pizza familiar con salsa y 3 ingredientes a elección + cóctel de litro",
    price: 18900,
    type: "promo_dimauro",
    image: "/productos/promo-dimauro.png",
  },
  {
    id: "promo-2-pizzas",
    category: "promos",
    tags: ["promos"],
    name: "2 Pizzas Familiares",
    shortDescription: "Elige salsa y 3 ingredientes por pizza",
    description: "Promo 2 pizzas familiares de 38 cm",
    price: 25900,
    type: "promo_pizzas",
    image: "/productos/promo-2-pizzas.jpg",
  },
  {
    id: "promo-segunda-mitad",
    category: "promos",
    tags: ["promos"],
    name: "La Segunda a Mitad de Precio",
    shortDescription: "Elige 2 pizzas del menú · La más barata a mitad de precio",
    description: "Cualquier 2 pizzas del menú. La de menor precio queda al 50%.",
    price: 0,
    type: "promo_segunda_mitad",
    image: "/productos/promo-segunda-mitad.png",
  },
  {
    id: "promo-burger-2x",
    category: "promos",
    name: "Promo Burger 2x",
    shortDescription: "Elige 2 burgers: Rukapillán, Lanín o Llaima",
    price: 15900,
    type: "selector-burger-2x",
    image: "/productos/promo-burger-2x.png",
    description: "2 burgers a elección",
  },
  {
    id: "promo-chorrillana",
    category: "promos",
    tags: ["promos", "acompanamientos"],
    name: "Chorrillana para 2",
    shortDescription: "Para compartir",
    price: 15900,
    type: "hidden",
  },

  // ── DESTACADOS ───────────────────────────────────────────────────────────────
  {
    id: "dest-villarrica",
    category: "destacados",
    tags: ["destacados", "pizzas"],
    name: "Pizza Villarrica",
    shortDescription: "Carne mechada, salame y champiñón",
    price: 15900,
    type: "pizza_fixed",
    baseIngredients: ["carne-mechada", "salame", "champinon"],
    allowPaidExtras: true,
    allowObservations: true,
  },
  {
    id: "dest-rinihue",
    category: "destacados",
    tags: ["destacados", "pizzas"],
    name: "Pizza Riñihue",
    shortDescription: "Pollo BBQ, tocino y cebolla morada",
    price: 14900,
    type: "pizza_fixed",
    baseIngredients: ["pollo-bbq", "tocino", "cebolla-morada"],
    allowPaidExtras: true,
    allowObservations: true,
  },
  {
    id: "cocktails-destacados",
    category: "destacados",
    name: "Cócteles",
    shortDescription: "Pisco Sour, Mojitos, Piña Colada, Spritz y más",
    price: 6000,
    type: "selector-happy-hour",
    image: "/productos/cocteles.png",
    description: "Cócteles medio litro o litro",
  },
  {
    id: "dest-rukapillan",
    category: "destacados",
    tags: ["destacados", "burger-sandwich"],
    name: "Hamburguesa Rukapillan",
    shortDescription: "Tocino, pepinillo, cebolla morada, queso fundido y salsa BBQ",
    price: 8900,
    type: "simple",
    image: "/productos/burger-generica.png",
  },
  {
    id: "dest-papas-dobles",
    category: "destacados",
    tags: ["destacados", "acompanamientos"],
    name: "Papas Fritas Dobles",
    shortDescription: "Porción doble para compartir",
    price: 5990,
    type: "simple",
    image: "/productos/papas-fritas-doble.png",
  },

  // ── PIZZAS ───────────────────────────────────────────────────────────────────
  {
    id: "pizza-pellaifa",
    category: "pizzas",
    name: "Pizza Pellaifa",
    shortDescription: "Camarón, tocino y cebolla morada",
    price: 19900,
    type: "pizza_fixed",
    baseIngredients: ["camaron", "tocino", "cebolla-morada"],
    allowPaidExtras: true,
    allowObservations: true,
  },
  {
    id: "pizza-villarrica",
    category: "pizzas",
    name: "Pizza Villarrica",
    shortDescription: "Carne mechada, salame y champiñón",
    price: 15900,
    type: "pizza_fixed",
    baseIngredients: ["carne-mechada", "salame", "champinon"],
    allowPaidExtras: true,
    allowObservations: true,
  },
  {
    id: "pizza-calafquen",
    category: "pizzas",
    name: "Pizza Calafquén",
    shortDescription: "Pepperoni, lomito de cerdo y cebolla morada",
    price: 15900,
    type: "pizza_fixed",
    baseIngredients: ["pepperoni", "lomito-de-cerdo", "cebolla-morada"],
    allowPaidExtras: true,
    allowObservations: true,
  },
  {
    id: "pizza-llanquihue",
    category: "pizzas",
    name: "Pizza Llanquihue",
    shortDescription: "Pepperoni, tocino y choricillo",
    price: 14900,
    type: "pizza_fixed",
    baseIngredients: ["pepperoni", "tocino", "choricillo"],
    allowPaidExtras: true,
    allowObservations: true,
  },
  {
    id: "pizza-rinihue",
    category: "pizzas",
    name: "Pizza Riñihue",
    shortDescription: "Pollo BBQ, tocino y cebolla morada",
    price: 14900,
    type: "pizza_fixed",
    baseIngredients: ["pollo-bbq", "tocino", "cebolla-morada"],
    allowPaidExtras: true,
    allowObservations: true,
  },
  {
    id: "pizza-colico",
    category: "pizzas",
    name: "Pizza Colico",
    shortDescription: "Full pepperoni",
    price: 14900,
    type: "pizza_fixed",
    baseIngredients: ["pepperoni"],
    allowPaidExtras: true,
    allowObservations: true,
  },
  {
    id: "pizza-ranco",
    category: "pizzas",
    name: "Pizza Ranco",
    shortDescription: "Chorizo parrillero, aceituna y cebolla morada",
    price: 13900,
    type: "pizza_fixed",
    baseIngredients: ["chorizo-parrillero", "aceituna", "cebolla-morada"],
    allowPaidExtras: true,
    allowObservations: true,
  },
  {
    id: "pizza-puyehue",
    category: "pizzas",
    name: "Pizza Puyehue",
    shortDescription: "Pollo, pimentón y choclo",
    price: 13900,
    type: "pizza_fixed",
    baseIngredients: ["pollo", "pimenton", "choclo"],
    allowPaidExtras: true,
    allowObservations: true,
  },
  {
    id: "pizza-neltume",
    category: "pizzas",
    name: "Pizza Neltume",
    shortDescription: "Tomate, aceituna y jamón",
    price: 12900,
    type: "pizza_fixed",
    baseIngredients: ["tomate", "aceituna", "jamon"],
    allowPaidExtras: true,
    allowObservations: true,
  },
  {
    id: "pizza-panguipulli",
    category: "pizzas",
    name: "Pizza Panguipulli",
    shortDescription: "Champiñón, choclo y aceituna",
    price: 12900,
    type: "pizza_fixed",
    baseIngredients: ["champinon", "choclo", "aceituna"],
    allowPaidExtras: true,
    allowObservations: true,
  },
  {
    id: "pizza-rupanco",
    category: "pizzas",
    name: "Pizza Rupanco",
    shortDescription: "Tomate y jamón",
    price: 11900,
    type: "pizza_fixed",
    baseIngredients: ["tomate", "jamon"],
    allowPaidExtras: true,
    allowObservations: true,
  },

  // ── BURGER & SANDWICH ────────────────────────────────────────────────────────
  {
    id: "burger-selector",
    category: "burger-sandwich",
    name: "Burger",
    shortDescription: "Elige entre Rukapillán, Lanín o Llaima",
    price: 8500,
    type: "selector-burger",
    image: "/productos/burger-generica.png",
    description: "Opciones desde $8.500",
  },
  {
    id: "sandwich-selector",
    category: "burger-sandwich",
    name: "Sandwich",
    shortDescription: "Elige proteína y estilo: Solo, Luco, Italiano o Chacarero",
    price: 6900,
    type: "selector-sandwich",
    image: "/productos/sandwich.png",
    description: "Opciones desde $6.900",
  },

  // ── ACOMPAÑAMIENTOS ──────────────────────────────────────────────────────────
  {
    id: "acomp-chorrillana",
    category: "acompanamientos",
    name: "Chorrillana para 2",
    shortDescription: "Para compartir",
    price: 15900,
    type: "simple",
    image: "/productos/chorrillana.png",
  },
  {
    id: "acomp-salchipapas",
    category: "acompanamientos",
    name: "Salchipapas",
    shortDescription: "Papas fritas con salchicha",
    price: 6900,
    type: "simple",
    image: "/productos/salchipapas.png",
  },
  {
    id: "acomp-papas-dobles",
    category: "acompanamientos",
    name: "Papas Fritas Dobles",
    shortDescription: "Porción doble para compartir",
    price: 5990,
    type: "simple",
    image: "/productos/papas-fritas-doble.png",
  },
  {
    id: "acomp-papas-individual",
    category: "acompanamientos",
    name: "Papas Fritas Individual",
    shortDescription: "Porción individual",
    price: 3900,
    type: "simple",
    image: "/productos/papas-fritas-doble.png",
  },

  // ── PARA BEBER ───────────────────────────────────────────────────────────────
  {
    id: "cocktails-selector",
    category: "para-beber",
    name: "Cócteles",
    shortDescription: "Pisco Sour, Mojitos, Piña Colada, Spritz y más",
    price: 6000,
    type: "selector-happy-hour",
    image: "/productos/cocteles.png",
    description: "Cócteles medio litro o litro",
  },
  {
    id: "drinks-selector",
    category: "para-beber",
    name: "Bebidas",
    shortDescription: "Coca-Cola, Sprite o Fanta",
    price: 3900,
    type: "selector-drinks",
    image: "/productos/bebidas.png",
    description: "Bebidas 1.5L",
  },
  {
    id: "beer-selector",
    category: "para-beber",
    name: "Cervezas",
    shortDescription: "Kunstmann, Austral o Heineken",
    price: 4000,
    type: "selector-beer",
    image: "/productos/cervezas.png",
    description: "Cervezas seleccionadas",
  },
];
