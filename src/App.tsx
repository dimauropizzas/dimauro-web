import { useState } from "react";
import "./App.css";

// ── Tipos ────────────────────────────────────────────────────────────────────
type ProductType =
  | "simple" | "pizza_fixed" | "promo_pizzas" | "promo_pizzas_drink"
  | "variant_selector" | "selector-burger" | "selector-burger-2x"
  | "selector-sandwich" | "selector-happy-hour" | "selector-drinks"
  | "selector-beer" | "hidden";

type CategoryId =
  | "promos" | "destacados" | "pizzas" | "burger-sandwich"
  | "acompanamientos" | "para-beber";

type Product = {
  id: string;
  category: CategoryId;
  name: string;
  shortDescription: string;
  price: number;
  type: ProductType;
  image?: string;
  active: boolean;
};

type Ingredient = {
  id: string;
  name: string;
  price: number;
  availableForPromo: boolean;
};

// ── Datos iniciales ───────────────────────────────────────────────────────────
const INITIAL_PRODUCTS: Product[] = [
  { id: "promo-2-pizzas", category: "promos", name: "2 Pizzas Familiares", shortDescription: "Elige salsa y 3 ingredientes por pizza", price: 25900, type: "promo_pizzas", image: "/productos/promo-2-pizzas.jpg", active: true },
  { id: "promo-2-pizzas-trago", category: "promos", name: "2 Pizzas + Trago", shortDescription: "2 pizzas + Mojito o Pisco Sour (1 litro)", price: 29900, type: "promo_pizzas_drink", image: "/productos/promo-2-pizzas-trago.png", active: true },
  { id: "promo-burger-2x", category: "promos", name: "Promo Burger 2x", shortDescription: "Elige 2 burgers: Rukapillán, Lanín o Llaima", price: 15900, type: "selector-burger-2x", image: "/productos/promo-burger-2x.png", active: true },
  { id: "dest-villarrica", category: "destacados", name: "Pizza Villarrica", shortDescription: "Carne mechada, salame y champiñón", price: 15900, type: "pizza_fixed", active: true },
  { id: "dest-rinihue", category: "destacados", name: "Pizza Riñihue", shortDescription: "Pollo BBQ, tocino y cebolla morada", price: 14900, type: "pizza_fixed", active: true },
  { id: "cocktails-destacados", category: "destacados", name: "Cócteles", shortDescription: "Pisco Sour, Mojitos, Piña Colada, Spritz y más", price: 6000, type: "selector-happy-hour", active: true },
  { id: "dest-rukapillan", category: "destacados", name: "Hamburguesa Rukapillan", shortDescription: "Tocino, pepinillo, cebolla morada, queso fundido y salsa BBQ", price: 8900, type: "simple", active: true },
  { id: "dest-papas-dobles", category: "destacados", name: "Papas Fritas Dobles", shortDescription: "Porción doble para compartir", price: 5990, type: "simple", active: true },
  { id: "pizza-pellaifa", category: "pizzas", name: "Pizza Pellaifa", shortDescription: "Camarón, tocino y cebolla morada", price: 19900, type: "pizza_fixed", active: true },
  { id: "pizza-villarrica", category: "pizzas", name: "Pizza Villarrica", shortDescription: "Carne mechada, salame y champiñón", price: 15900, type: "pizza_fixed", active: true },
  { id: "pizza-calafquen", category: "pizzas", name: "Pizza Calafquén", shortDescription: "Pepperoni, lomito de cerdo y cebolla morada", price: 15900, type: "pizza_fixed", active: true },
  { id: "pizza-llanquihue", category: "pizzas", name: "Pizza Llanquihue", shortDescription: "Pepperoni, tocino y choricillo", price: 14900, type: "pizza_fixed", active: true },
  { id: "pizza-rinihue", category: "pizzas", name: "Pizza Riñihue", shortDescription: "Pollo BBQ, tocino y cebolla morada", price: 14900, type: "pizza_fixed", active: true },
  { id: "pizza-colico", category: "pizzas", name: "Pizza Colico", shortDescription: "Full pepperoni", price: 14900, type: "pizza_fixed", active: true },
  { id: "pizza-ranco", category: "pizzas", name: "Pizza Ranco", shortDescription: "Chorizo parrillero, aceituna y cebolla morada", price: 13900, type: "pizza_fixed", active: true },
  { id: "pizza-puyehue", category: "pizzas", name: "Pizza Puyehue", shortDescription: "Pollo, pimentón y choclo", price: 13900, type: "pizza_fixed", active: true },
  { id: "pizza-neltume", category: "pizzas", name: "Pizza Neltume", shortDescription: "Tomate, aceituna y jamón", price: 12900, type: "pizza_fixed", active: true },
  { id: "pizza-panguipulli", category: "pizzas", name: "Pizza Panguipulli", shortDescription: "Champiñón, choclo y aceituna", price: 12900, type: "pizza_fixed", active: true },
  { id: "pizza-rupanco", category: "pizzas", name: "Pizza Rupanco", shortDescription: "Tomate y jamón", price: 11900, type: "pizza_fixed", active: true },
  { id: "burger-selector", category: "burger-sandwich", name: "Burger", shortDescription: "Elige entre Rukapillán, Lanín o Llaima", price: 8500, type: "selector-burger", active: true },
  { id: "sandwich-selector", category: "burger-sandwich", name: "Sandwich", shortDescription: "Elige proteína y estilo", price: 6900, type: "selector-sandwich", active: true },
  { id: "acomp-chorrillana", category: "acompanamientos", name: "Chorrillana para 2", shortDescription: "Para compartir", price: 15900, type: "simple", active: true },
  { id: "acomp-salchipapas", category: "acompanamientos", name: "Salchipapas", shortDescription: "Papas fritas con salchicha", price: 6900, type: "simple", active: true },
  { id: "acomp-papas-dobles", category: "acompanamientos", name: "Papas Fritas Dobles", shortDescription: "Porción doble para compartir", price: 5990, type: "simple", active: true },
  { id: "acomp-papas-individual", category: "acompanamientos", name: "Papas Fritas Individual", shortDescription: "Porción individual", price: 3900, type: "simple", active: true },
  { id: "cocktails-selector", category: "para-beber", name: "Cócteles", shortDescription: "Pisco Sour, Mojitos, Piña Colada, Spritz y más", price: 6000, type: "selector-happy-hour", active: true },
  { id: "drinks-selector", category: "para-beber", name: "Bebidas", shortDescription: "Coca-Cola, Sprite o Fanta", price: 3900, type: "selector-drinks", active: true },
  { id: "beer-selector", category: "para-beber", name: "Cervezas", shortDescription: "Kunstmann, Austral o Heineken", price: 4000, type: "selector-beer", active: true },
];

const INITIAL_INGREDIENTS: Ingredient[] = [
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

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (n: number) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP", maximumFractionDigits: 0 }).format(n);

const CATEGORY_LABELS: Record<CategoryId, string> = {
  promos: "Promos", destacados: "Destacados", pizzas: "Menú Pizzas",
  "burger-sandwich": "Burger & Sandwich", acompanamientos: "Acompañamientos", "para-beber": "Para beber",
};

// ── Usuarios ──────────────────────────────────────────────────────────────────
const USERS = [
  { username: "mauricio", password: "dimauro2024", displayName: "Mauricio" },
  { username: "carola", password: "carola2024", displayName: "Carola" },
];

// ── Login ─────────────────────────────────────────────────────────────────────
function Login({ onLogin }: { onLogin: (name: string) => void }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);

  const handleLogin = () => {
    const found = USERS.find(u => u.username === user.toLowerCase().trim() && u.password === pass);
    if (found) {
      onLogin(found.displayName);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="login-screen">
      <div className="login-box">
        <div className="login-logo">🍕</div>
        <h1 className="login-title">Di Mauro Admin</h1>
        <p className="login-sub">Panel de administración</p>
        <input
          className={`login-input ${error ? "login-input--error" : ""}`}
          type="text"
          placeholder="Usuario"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          autoFocus
        />
        <input
          className={`login-input ${error ? "login-input--error" : ""}`}
          type="password"
          placeholder="Contraseña"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
        />
        {error && <p className="login-error">Usuario o contraseña incorrectos</p>}
        <button className="login-btn" onClick={handleLogin}>Ingresar</button>
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
function Dashboard({ products, storeOpen, setStoreOpen }: {
  products: Product[];
  storeOpen: boolean;
  setStoreOpen: (v: boolean) => void;
}) {
  const activeCount = products.filter(p => p.active && p.type !== "hidden").length;
  const totalCount = products.filter(p => p.type !== "hidden").length;
  const promos = products.filter(p => p.category === "promos" && p.active && p.type !== "hidden");

  return (
    <div className="section fade-in">
      <h2 className="section-title">Dashboard</h2>

      <div className="kpi-grid">
        <div className={`kpi-card kpi-card--store ${storeOpen ? "kpi-card--open" : "kpi-card--closed"}`}>
          <div className="kpi-label">Estado del local</div>
          <div className="kpi-value">{storeOpen ? "Abierto" : "Cerrado"}</div>
          <button className="store-toggle" onClick={() => setStoreOpen(!storeOpen)}>
            {storeOpen ? "Cerrar local" : "Abrir local"}
          </button>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Productos activos</div>
          <div className="kpi-value">{activeCount} <span className="kpi-total">/ {totalCount}</span></div>
        </div>
        <div className="kpi-card">
          <div className="kpi-label">Promos activas</div>
          <div className="kpi-value">{promos.length}</div>
        </div>
      </div>

      <div className="dash-section">
        <h3 className="dash-section-title">Promos activas</h3>
        <div className="promo-cards">
          {promos.map(p => (
            <div key={p.id} className="promo-card">
              <div className="promo-card-name">{p.name}</div>
              <div className="promo-card-price">{fmt(p.price)}</div>
              <div className="promo-card-desc">{p.shortDescription}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Productos ─────────────────────────────────────────────────────────────────
function Productos({ products, setProducts }: {
  products: Product[];
  setProducts: (p: Product[]) => void;
}) {
  const [filterCat, setFilterCat] = useState<CategoryId | "all">("all");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    category: "pizzas", type: "simple", active: true, name: "", shortDescription: "", price: 0,
  });

  const filtered = filterCat === "all"
    ? products.filter(p => p.type !== "hidden")
    : products.filter(p => p.category === filterCat && p.type !== "hidden");

  const toggleActive = (id: string) => {
    setProducts(products.map(p => p.id === id ? { ...p, active: !p.active } : p));
  };

  const saveEdit = () => {
    if (!editingProduct) return;
    setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
    setEditingProduct(null);
  };

  const duplicar = (p: Product) => {
    const nuevo: Product = { ...p, id: `${p.id}-copia-${Date.now()}`, name: `${p.name} (copia)` };
    setProducts([...products, nuevo]);
  };

  const eliminar = (id: string) => {
    if (!confirm("¿Eliminar este producto?")) return;
    setProducts(products.filter(p => p.id !== id));
  };

  const mover = (id: string, dir: "arriba" | "abajo") => {
    const cat = products.find(p => p.id === id)?.category;
    const catProducts = products.filter(p => p.category === cat && p.type !== "hidden");
    const idx = catProducts.findIndex(p => p.id === id);
    if (dir === "arriba" && idx === 0) return;
    if (dir === "abajo" && idx === catProducts.length - 1) return;
    const swapIdx = dir === "arriba" ? idx - 1 : idx + 1;
    const newList = [...products];
    const iA = newList.findIndex(p => p.id === catProducts[idx].id);
    const iB = newList.findIndex(p => p.id === catProducts[swapIdx].id);
    [newList[iA], newList[iB]] = [newList[iB], newList[iA]];
    setProducts(newList);
  };

  const agregarProducto = () => {
    if (!newProduct.name || !newProduct.price) return;
    const id = `${newProduct.category}-${Date.now()}`;
    const prod: Product = {
      id, category: newProduct.category as CategoryId, name: newProduct.name!,
      shortDescription: newProduct.shortDescription || "", price: newProduct.price!,
      type: newProduct.type as ProductType, active: true, image: newProduct.image,
    };
    setProducts([...products, prod]);
    setShowNewForm(false);
    setNewProduct({ category: "pizzas", type: "simple", active: true, name: "", shortDescription: "", price: 0 });
  };

  const categories: (CategoryId | "all")[] = ["all", "promos", "destacados", "pizzas", "burger-sandwich", "acompanamientos", "para-beber"];

  return (
    <div className="section fade-in">
      <div className="section-header">
        <h2 className="section-title">Productos</h2>
        <button className="btn-primary" onClick={() => setShowNewForm(!showNewForm)}>
          {showNewForm ? "Cancelar" : "+ Nuevo producto"}
        </button>
      </div>

      {showNewForm && (
        <div className="form-card">
          <div className="form-row">
            <div className="form-field">
              <label>Nombre</label>
              <input placeholder="Ej: Pizza Hawaiana" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} />
            </div>
            <div className="form-field">
              <label>Precio (CLP)</label>
              <input type="number" placeholder="12900" value={newProduct.price || ""} onChange={e => setNewProduct({ ...newProduct, price: parseInt(e.target.value) })} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-field">
              <label>Descripción corta</label>
              <input placeholder="Ej: Piña, jamón y mozzarella" value={newProduct.shortDescription} onChange={e => setNewProduct({ ...newProduct, shortDescription: e.target.value })} />
            </div>
            <div className="form-field">
              <label>Categoría</label>
              <select value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value as CategoryId })}>
                {(["promos", "destacados", "pizzas", "burger-sandwich", "acompanamientos", "para-beber"] as CategoryId[]).map(c => (
                  <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
                ))}
              </select>
            </div>
          </div>
          <button className="btn-primary" onClick={agregarProducto}>Guardar producto</button>
        </div>
      )}

      <div className="filter-bar">
        {categories.map(cat => (
          <button key={cat} className={`filter-btn ${filterCat === cat ? "filter-btn--active" : ""}`} onClick={() => setFilterCat(cat)}>
            {cat === "all" ? "Todos" : CATEGORY_LABELS[cat as CategoryId]}
          </button>
        ))}
      </div>

      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Orden</th><th>Producto</th><th>Categoría</th><th>Precio</th><th>Estado</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {filtered.map((p, idx) => {
              const catProducts = filtered.filter(fp => fp.category === p.category);
              const catIdx = catProducts.findIndex(fp => fp.id === p.id);
              return (
                <tr key={p.id} className={!p.active ? "row--inactive" : ""}>
                  <td>
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <button className="btn-ghost" style={{ padding: "2px 8px", fontSize: 11 }} onClick={() => mover(p.id, "arriba")} disabled={catIdx === 0}>↑</button>
                      <button className="btn-ghost" style={{ padding: "2px 8px", fontSize: 11 }} onClick={() => mover(p.id, "abajo")} disabled={catIdx === catProducts.length - 1}>↓</button>
                    </div>
                  </td>
                  <td>
                    <div className="prod-name">{p.name}</div>
                    <div className="prod-desc">{p.shortDescription}</div>
                    {p.image && <div className="prod-desc" style={{ color: "var(--red)" }}>🖼 {p.image}</div>}
                  </td>
                  <td><span className="cat-badge">{CATEGORY_LABELS[p.category]}</span></td>
                  <td style={{ fontWeight: 500 }}>{fmt(p.price)}</td>
                  <td>
                    <button className={`toggle-btn ${p.active ? "toggle-btn--on" : "toggle-btn--off"}`} onClick={() => toggleActive(p.id)}>
                      {p.active ? "Activo" : "Inactivo"}
                    </button>
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6 }}>
                      <button className="btn-ghost" style={{ padding: "5px 10px", fontSize: 12 }} onClick={() => setEditingProduct({ ...p })}>✏️ Editar</button>
                      <button className="btn-ghost" style={{ padding: "5px 10px", fontSize: 12 }} onClick={() => duplicar(p)}>⧉ Duplicar</button>
                      <button className="btn-delete" onClick={() => eliminar(p.id)}>🗑</button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal de edición */}
      {editingProduct && (
        <div className="modal-overlay" onClick={() => setEditingProduct(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Editar producto</h3>
              <button className="modal-close" onClick={() => setEditingProduct(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-field">
                <label>Nombre</label>
                <input value={editingProduct.name} onChange={e => setEditingProduct({ ...editingProduct, name: e.target.value })} />
              </div>
              <div className="form-field">
                <label>Descripción corta</label>
                <input value={editingProduct.shortDescription} onChange={e => setEditingProduct({ ...editingProduct, shortDescription: e.target.value })} />
              </div>
              <div className="form-row">
                <div className="form-field">
                  <label>Precio (CLP)</label>
                  <input type="number" value={editingProduct.price} onChange={e => setEditingProduct({ ...editingProduct, price: parseInt(e.target.value) || 0 })} />
                </div>
                <div className="form-field">
                  <label>Categoría</label>
                  <select value={editingProduct.category} onChange={e => setEditingProduct({ ...editingProduct, category: e.target.value as CategoryId })}>
                    {(["promos", "destacados", "pizzas", "burger-sandwich", "acompanamientos", "para-beber"] as CategoryId[]).map(c => (
                      <option key={c} value={c}>{CATEGORY_LABELS[c]}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-field">
                <label>Imagen (ruta o URL)</label>
                <input placeholder="/productos/mi-pizza.jpg" value={editingProduct.image || ""} onChange={e => setEditingProduct({ ...editingProduct, image: e.target.value })} />
              </div>
              <div className="form-field">
                <label>
                  <input type="checkbox" checked={editingProduct.active} onChange={e => setEditingProduct({ ...editingProduct, active: e.target.checked })} />
                  {" "}Producto activo
                </label>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-ghost" onClick={() => setEditingProduct(null)}>Cancelar</button>
              <button className="btn-primary" onClick={saveEdit}>Guardar cambios</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Ingredientes ──────────────────────────────────────────────────────────────
function Ingredientes({ ingredients, setIngredients }: {
  ingredients: Ingredient[];
  setIngredients: (i: Ingredient[]) => void;
}) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newIng, setNewIng] = useState({ name: "", price: "", availableForPromo: true });

  const savePrice = (id: string) => {
    const val = parseInt(editPrice.replace(/\D/g, ""));
    if (!isNaN(val) && val > 0) {
      setIngredients(ingredients.map(i => i.id === id ? { ...i, price: val } : i));
    }
    setEditingId(null);
  };

  const addIngredient = () => {
    if (!newIng.name || !newIng.price) return;
    const id = newIng.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "-");
    setIngredients([...ingredients, { id, name: newIng.name, price: parseInt(newIng.price), availableForPromo: newIng.availableForPromo }]);
    setNewIng({ name: "", price: "", availableForPromo: true });
    setShowForm(false);
  };

  const removeIngredient = (id: string) => {
    setIngredients(ingredients.filter(i => i.id !== id));
  };

  return (
    <div className="section fade-in">
      <div className="section-header">
        <h2 className="section-title">Ingredientes</h2>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          {showForm ? "Cancelar" : "+ Agregar"}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <div className="form-row">
            <div className="form-field">
              <label>Nombre</label>
              <input placeholder="Ej: Rúcula" value={newIng.name} onChange={e => setNewIng({ ...newIng, name: e.target.value })} />
            </div>
            <div className="form-field">
              <label>Precio (CLP)</label>
              <input type="number" placeholder="1500" value={newIng.price} onChange={e => setNewIng({ ...newIng, price: e.target.value })} />
            </div>
            <div className="form-field form-field--check">
              <label>
                <input type="checkbox" checked={newIng.availableForPromo} onChange={e => setNewIng({ ...newIng, availableForPromo: e.target.checked })} />
                Disponible en promo
              </label>
            </div>
          </div>
          <button className="btn-primary" onClick={addIngredient}>Guardar ingrediente</button>
        </div>
      )}

      <div className="table-wrap">
        <table className="admin-table">
          <thead>
            <tr><th>Ingrediente</th><th>Precio</th><th>En promo</th><th></th></tr>
          </thead>
          <tbody>
            {ingredients.map(ing => (
              <tr key={ing.id}>
                <td className="prod-name">{ing.name}</td>
                <td>
                  {editingId === ing.id ? (
                    <div className="price-edit">
                      <input className="price-input" value={editPrice} onChange={e => setEditPrice(e.target.value)} onKeyDown={e => e.key === "Enter" && savePrice(ing.id)} autoFocus />
                      <button className="btn-save" onClick={() => savePrice(ing.id)}>✓</button>
                      <button className="btn-cancel" onClick={() => setEditingId(null)}>✕</button>
                    </div>
                  ) : (
                    <span className="price-val" onClick={() => { setEditingId(ing.id); setEditPrice(String(ing.price)); }}>
                      {fmt(ing.price)} <span className="edit-hint">✏️</span>
                    </span>
                  )}
                </td>
                <td>
                  <span className={`badge ${ing.availableForPromo ? "badge--yes" : "badge--no"}`}>
                    {ing.availableForPromo ? "Sí" : "No"}
                  </span>
                </td>
                <td>
                  <button className="btn-delete" onClick={() => removeIngredient(ing.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Horarios ──────────────────────────────────────────────────────────────────
function Horarios({ storeOpen, setStoreOpen }: { storeOpen: boolean; setStoreOpen: (v: boolean) => void }) {
  const schedule = [
    { dia: "Domingo a Viernes", horario: "18:00 a 00:00" },
    { dia: "Sábado", horario: "13:00 a 00:00" },
  ];

  return (
    <div className="section fade-in">
      <h2 className="section-title">Horarios</h2>

      <div className="horario-card">
        <div className="horario-estado">
          <div>
            <div className="horario-label">Estado actual del local</div>
            <div className={`horario-badge ${storeOpen ? "horario-badge--open" : "horario-badge--closed"}`}>
              {storeOpen ? "🟢 Abierto" : "🔴 Cerrado"}
            </div>
          </div>
          <button
            className={`store-toggle-big ${storeOpen ? "store-toggle-big--close" : "store-toggle-big--open"}`}
            onClick={() => setStoreOpen(!storeOpen)}
          >
            {storeOpen ? "Cerrar local ahora" : "Abrir local ahora"}
          </button>
        </div>
      </div>

      <div className="horario-tabla">
        <h3 className="dash-section-title">Horario regular</h3>
        {schedule.map((s, i) => (
          <div key={i} className="horario-row">
            <span className="horario-dia">{s.dia}</span>
            <span className="horario-hora">{s.horario}</span>
          </div>
        ))}
        <p className="horario-note">⚠️ Para cambiar el horario regular, edita el archivo <code>MenuV2.tsx</code> en la función <code>isStoreOpen()</code>.</p>
      </div>
    </div>
  );
}

// ── Tipos Pedido ──────────────────────────────────────────────────────────────
type ItemPedido = {
  productId: string;
  nombre: string;
  precio: number;
  cantidad: number;
  nota?: string;
};

type Pedido = {
  id: string;
  fecha: string;
  hora: string;
  tipo: "delivery" | "retiro";
  cliente: string;
  telefono: string;
  direccion?: string;
  items: ItemPedido[];
  total: number;
  estado: "pendiente" | "en-preparacion" | "listo" | "entregado";
  origen: "web" | "telefono";
};

// ── Punto de Venta ────────────────────────────────────────────────────────────
function PuntoDeVenta({ products, pedidos, setPedidos }: {
  products: Product[];
  pedidos: Pedido[];
  setPedidos: (p: Pedido[]) => void;
}) {
  const [items, setItems] = useState<ItemPedido[]>([]);
  const [tipo, setTipo] = useState<"delivery" | "retiro">("retiro");
  const [cliente, setCliente] = useState("");
  const [telefono, setTelefono] = useState("");
  const [direccion, setDireccion] = useState("");
  const [nota, setNota] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [confirmado, setConfirmado] = useState(false);
  const [filterCat, setFilterCat] = useState<CategoryId | "all">("all");

  const productosActivos = products.filter(p => p.active && p.type !== "hidden");
  const filtrados = productosActivos.filter(p => {
    const matchCat = filterCat === "all" || p.category === filterCat;
    const matchBusq = p.name.toLowerCase().includes(busqueda.toLowerCase());
    return matchCat && matchBusq;
  });

  const total = items.reduce((s, i) => s + i.precio * i.cantidad, 0);

  const agregarItem = (p: Product) => {
    const existente = items.find(i => i.productId === p.id);
    if (existente) {
      setItems(items.map(i => i.productId === p.id ? { ...i, cantidad: i.cantidad + 1 } : i));
    } else {
      setItems([...items, { productId: p.id, nombre: p.name, precio: p.price, cantidad: 1 }]);
    }
  };

  const cambiarCantidad = (productId: string, delta: number) => {
    setItems(items
      .map(i => i.productId === productId ? { ...i, cantidad: i.cantidad + delta } : i)
      .filter(i => i.cantidad > 0)
    );
  };

  const confirmarPedido = () => {
    if (items.length === 0 || !cliente) return;
    const ahora = new Date();
    const nuevoPedido: Pedido = {
      id: `PED-${Date.now()}`,
      fecha: ahora.toLocaleDateString("es-CL"),
      hora: ahora.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" }),
      tipo,
      cliente,
      telefono,
      direccion: tipo === "delivery" ? direccion : undefined,
      items: [...items],
      total,
      estado: "pendiente",
      origen: "telefono",
    };
    setPedidos([nuevoPedido, ...pedidos]);
    setItems([]);
    setCliente("");
    setTelefono("");
    setDireccion("");
    setNota("");
    setConfirmado(true);
    setTimeout(() => setConfirmado(false), 3000);
  };

  const categories: (CategoryId | "all")[] = ["all", "promos", "pizzas", "burger-sandwich", "acompanamientos", "para-beber"];

  return (
    <div className="section fade-in pos-layout">
      <div className="pos-productos">
        <h2 className="section-title">Punto de Venta</h2>

        <input
          className="pos-search"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
        />

        <div className="filter-bar">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${filterCat === cat ? "filter-btn--active" : ""}`}
              onClick={() => setFilterCat(cat)}
            >
              {cat === "all" ? "Todos" : CATEGORY_LABELS[cat as CategoryId]}
            </button>
          ))}
        </div>

        <div className="pos-grid">
          {filtrados.map(p => {
            const enCarrito = items.find(i => i.productId === p.id);
            return (
              <div
                key={p.id}
                className={`pos-card ${enCarrito ? "pos-card--active" : ""}`}
                onClick={() => agregarItem(p)}
              >
                {enCarrito && <span className="pos-qty">{enCarrito.cantidad}</span>}
                <div className="pos-card-name">{p.name}</div>
                <div className="pos-card-price">{fmt(p.price)}</div>
                <div className="pos-card-desc">{p.shortDescription}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pos-pedido">
        <h3 className="pos-pedido-title">Pedido</h3>

        <div className="pos-tipo">
          <button className={`tipo-btn ${tipo === "retiro" ? "tipo-btn--active" : ""}`} onClick={() => setTipo("retiro")}>🏠 Retiro</button>
          <button className={`tipo-btn ${tipo === "delivery" ? "tipo-btn--active" : ""}`} onClick={() => setTipo("delivery")}>🛵 Delivery</button>
        </div>

        <div className="pos-form">
          <input className="pos-input" placeholder="Nombre cliente *" value={cliente} onChange={e => setCliente(e.target.value)} />
          <input className="pos-input" placeholder="Teléfono" value={telefono} onChange={e => setTelefono(e.target.value)} />
          {tipo === "delivery" && (
            <input className="pos-input" placeholder="Dirección" value={direccion} onChange={e => setDireccion(e.target.value)} />
          )}
        </div>

        <div className="pos-items">
          {items.length === 0 ? (
            <div className="pos-empty">Agrega productos desde el menú</div>
          ) : (
            items.map(item => (
              <div key={item.productId} className="pos-item">
                <div className="pos-item-info">
                  <div className="pos-item-name">{item.nombre}</div>
                  <div className="pos-item-price">{fmt(item.precio * item.cantidad)}</div>
                </div>
                <div className="pos-item-qty">
                  <button onClick={() => cambiarCantidad(item.productId, -1)}>−</button>
                  <span>{item.cantidad}</span>
                  <button onClick={() => cambiarCantidad(item.productId, 1)}>+</button>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="pos-total">
            Total: <strong>{fmt(total)}</strong>
          </div>
        )}

        {confirmado && <div className="pos-confirmado">✅ Pedido registrado</div>}

        <button
          className="pos-confirmar"
          disabled={items.length === 0 || !cliente}
          onClick={confirmarPedido}
        >
          Confirmar pedido
        </button>
      </div>
    </div>
  );
}

// ── Pedidos ───────────────────────────────────────────────────────────────────
function Pedidos({ pedidos, setPedidos }: { pedidos: Pedido[]; setPedidos: (p: Pedido[]) => void }) {
  const ESTADOS: Pedido["estado"][] = ["pendiente", "en-preparacion", "listo", "entregado"];
  const ESTADO_LABELS: Record<Pedido["estado"], string> = {
    "pendiente": "Pendiente",
    "en-preparacion": "En preparación",
    "listo": "Listo",
    "entregado": "Entregado",
  };
  const ESTADO_COLORS: Record<Pedido["estado"], string> = {
    "pendiente": "badge--warn",
    "en-preparacion": "badge--blue",
    "listo": "badge--yes",
    "entregado": "badge--muted",
  };

  const avanzarEstado = (id: string) => {
    setPedidos(pedidos.map(p => {
      if (p.id !== id) return p;
      const idx = ESTADOS.indexOf(p.estado);
      return { ...p, estado: ESTADOS[Math.min(idx + 1, ESTADOS.length - 1)] };
    }));
  };

  return (
    <div className="section fade-in">
      <h2 className="section-title">Pedidos</h2>
      {pedidos.length === 0 ? (
        <div className="empty-state">No hay pedidos registrados aún</div>
      ) : (
        <div className="table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>ID</th><th>Cliente</th><th>Tipo</th><th>Items</th><th>Total</th><th>Estado</th><th></th></tr>
            </thead>
            <tbody>
              {pedidos.map(p => (
                <tr key={p.id}>
                  <td>
                    <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{p.fecha} {p.hora}</div>
                    <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{p.origen === "telefono" ? "📞 Teléfono" : "🌐 Web"}</div>
                  </td>
                  <td>
                    <div className="prod-name">{p.cliente}</div>
                    {p.telefono && <div className="prod-desc">{p.telefono}</div>}
                    {p.direccion && <div className="prod-desc">📍 {p.direccion}</div>}
                  </td>
                  <td><span className="cat-badge">{p.tipo === "delivery" ? "🛵 Delivery" : "🏠 Retiro"}</span></td>
                  <td>
                    {p.items.map((i, idx) => (
                      <div key={idx} style={{ fontSize: 13 }}>{i.cantidad}× {i.nombre}</div>
                    ))}
                  </td>
                  <td style={{ fontWeight: 600, color: "var(--red)" }}>{fmt(p.total)}</td>
                  <td><span className={`badge ${ESTADO_COLORS[p.estado]}`}>{ESTADO_LABELS[p.estado]}</span></td>
                  <td>
                    {p.estado !== "entregado" && (
                      <button className="btn-primary" style={{ padding: "6px 12px", fontSize: 12 }} onClick={() => avanzarEstado(p.id)}>
                        Avanzar →
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ── App principal ─────────────────────────────────────────────────────────────
const TABS = [
  { id: "dashboard", label: "Dashboard", icon: "📊" },
  { id: "pos", label: "Punto de Venta", icon: "🧾" },
  { id: "pedidos", label: "Pedidos", icon: "📋" },
  { id: "productos", label: "Productos", icon: "🍕" },
  { id: "ingredientes", label: "Ingredientes", icon: "🧂" },
  { id: "horarios", label: "Horarios", icon: "🕐" },
];

export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [tab, setTab] = useState("dashboard");
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [ingredients, setIngredients] = useState<Ingredient[]>(INITIAL_INGREDIENTS);
  const [storeOpen, setStoreOpen] = useState(true);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);

  if (!loggedIn) return <Login onLogin={(name) => { setLoggedIn(true); setUserName(name); }} />;

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="sidebar-logo">🍕</span>
          <div>
            <div className="sidebar-title">Di Mauro</div>
            <div className="sidebar-sub">Admin</div>
          </div>
        </div>
        <nav className="sidebar-nav">
          {TABS.map(t => (
            <button
              key={t.id}
              className={`nav-item ${tab === t.id ? "nav-item--active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              <span className="nav-icon">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className={`store-status ${storeOpen ? "store-status--open" : "store-status--closed"}`}>
            {storeOpen ? "🟢 Local abierto" : "🔴 Local cerrado"}
          </div>
          <div className="sidebar-user">👤 {userName}</div>
          <button className="logout-btn" onClick={() => { setLoggedIn(false); setUserName(""); }}>Cerrar sesión</button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <h1 className="topbar-title">
            {TABS.find(t => t.id === tab)?.icon} {TABS.find(t => t.id === tab)?.label}
          </h1>
          <div className="topbar-right">
            <div className="topbar-date">
              {new Date().toLocaleDateString("es-CL", { weekday: "long", day: "numeric", month: "long" })}
            </div>
          </div>
        </header>

        <div className="content">
          {tab === "dashboard" && <Dashboard products={products} storeOpen={storeOpen} setStoreOpen={setStoreOpen} />}
          {tab === "pos" && <PuntoDeVenta products={products} pedidos={pedidos} setPedidos={setPedidos} />}
          {tab === "pedidos" && <Pedidos pedidos={pedidos} setPedidos={setPedidos} />}
          {tab === "productos" && <Productos products={products} setProducts={setProducts} />}
          {tab === "ingredientes" && <Ingredientes ingredients={ingredients} setIngredients={setIngredients} />}
          {tab === "horarios" && <Horarios storeOpen={storeOpen} setStoreOpen={setStoreOpen} />}
        </div>
      </main>
    </div>
  );
}
