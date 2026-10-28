
import { useState } from "react";
import "./App.css";

const initialProducts = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500",
    name: "Wireless Headphones",
    category: "Electronics",
    description: "Wireless headphones with clear sound.",
    specification: "Bluetooth, rechargeable battery",
    rating: 4.5,
    price: 1299,
    quantity: 3,
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500",
    name: "Smart Watch",
    category: "Accessories",
    description: "A stylish watch for everyday use.",
    specification: "Digital display, fitness tracking",
    rating: 4.8,
    price: 2499,
    quantity: 2,
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500",
    name: "Wireless Mouse",
    category: "Electronics",
    description: "A comfortable mouse for work and study.",
    specification: "Wireless, ergonomic design",
    rating: 4.2,
    price: 599,
    quantity: 4,
  },
];

const emptyForm = {
  image: "",
  name: "",
  category: "",
  description: "",
  specification: "",
  rating: "",
  price: "",
  quantity: "",
};

function ProductCard({
  product,
  onDetails,
  onAdd,
  onRemove,
}) {
  const subtotal = product.price * product.quantity;

  return (
    <article
      className={`product-card ${
        product.quantity < 5 ? "low-stock" : ""
      }`}
    >
      <img
        className="product-image"
        src={product.image}
        alt={product.name}
        onError={(event) => {
          event.currentTarget.style.display = "none";
        }}
      />

      <div className="product-info">
        <span className="category-label">
          {product.category}
        </span>

        <h3>{product.name}</h3>
        <p className="description">{product.description}</p>

        <p className="rating">★ {product.rating} / 5</p>

        <p className="price">
          ₱{product.price.toLocaleString("en-PH", {
            minimumFractionDigits: 2,
          })}
        </p>

        <p>
          Quantity: <strong>{product.quantity}</strong>
        </p>

        {product.quantity < 5 && (
          <p className="stock-warning">Low Stock</p>
        )}

        <p className="subtotal">
          Subtotal: ₱{subtotal.toLocaleString("en-PH", {
            minimumFractionDigits: 2,
          })}
        </p>

        <button
          className="details-button"
          onClick={() => onDetails(product)}
        >
          View Details
        </button>

        <div className="quantity-controls">
          <button
            className="secondary-button"
            onClick={() => onRemove(product.id)}
            disabled={product.quantity === 0}
            aria-label={`Remove one ${product.name}`}
          >
            −
          </button>

          <button
            className="add-button"
            onClick={() => onAdd(product.id)}
          >
            Add to Cart
          </button>

          <button
            className="secondary-button"
            onClick={() => onAdd(product.id)}
            aria-label={`Add one ${product.name}`}
          >
            +
          </button>
        </div>
      </div>
    </article>
  );
}

function ProductForm({ onAddProduct }) {
  const [form, setForm] = useState(emptyForm);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (Object.values(form).some((value) => value.trim() === "")) {
      alert("Please fill in all fields.");
      return;
    }

    const price = Number(form.price);
    const quantity = Number(form.quantity);
    const rating = Number(form.rating);

    if (
      !Number.isFinite(price) ||
      !Number.isFinite(quantity) ||
      !Number.isFinite(rating) ||
      price <= 0 ||
      !Number.isInteger(quantity) ||
      quantity < 0 ||
      rating < 0 ||
      rating > 5
    ) {
      alert(
        "Enter a positive price, a whole-number quantity, and a rating from 0 to 5."
      );
      return;
    }

    onAddProduct({
      ...form,
      id: Date.now(),
      price,
      quantity,
      rating,
    });

    setForm(emptyForm);
  }

  return (
    <section className="form-section">
      <h2>Add New Product</h2>
      <p className="section-description">
        Enter the product information below.
      </p>

      <form className="product-form" onSubmit={handleSubmit}>
        <label>
          Feature Image URL
          <input
            name="image"
            type="url"
            placeholder="https://example.com/product.jpg"
            value={form.image}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Product Name
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Product Category
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          >
            <option value="">Select category</option>
            <option value="Electronics">Electronics</option>
            <option value="Accessories">Accessories</option>
            <option value="Clothing">Clothing</option>
            <option value="Home">Home</option>
            <option value="Other">Other</option>
          </select>
        </label>

        <label>
          Description
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Product Specification
          <textarea
            name="specification"
            value={form.specification}
            onChange={handleChange}
            required
          />
        </label>

        <div className="form-row">
          <label>
            Rating (0–5)
            <input
              name="rating"
              type="number"
              min="0"
              max="5"
              step="0.1"
              value={form.rating}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Price (₱)
            <input
              name="price"
              type="number"
              min="0.01"
              step="0.01"
              value={form.price}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Quantity
            <input
              name="quantity"
              type="number"
              min="0"
              step="1"
              value={form.quantity}
              onChange={handleChange}
              required
            />
          </label>
        </div>

        <button className="submit-button" type="submit">
          Add Product
        </button>
      </form>
    </section>
  );
}

function ProductDetails({ product, onBack }) {
  return (
    <section className="details-page">
      <button className="secondary-button back-button" onClick={onBack}>
        ← Back to Products
      </button>

      <div className="details-layout">
        <img src={product.image} alt={product.name} />

        <div>
          <span className="category-label">{product.category}</span>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <h3>Product Specification</h3>
          <p>{product.specification}</p>
          <p>Rating: ★ {product.rating} / 5</p>
          <h3>
            ₱{product.price.toLocaleString("en-PH", {
              minimumFractionDigits: 2,
            })}
          </h3>
          <p>Quantity: {product.quantity}</p>
          {product.quantity < 5 && (
            <p className="stock-warning">Low Stock</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default function App() {
  const [products, setProducts] = useState(initialProducts);
  const [category, setCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState(null);

  function addProduct(newProduct) {
    setProducts((previous) => [...previous, newProduct]);
  }

  function changeQuantity(id, amount) {
    setProducts((previous) =>
      previous.map((product) =>
        product.id === id
          ? {
              ...product,
              quantity: Math.max(0, product.quantity + amount),
            }
          : product
      )
    );

    setSelectedProduct((previous) =>
      previous && previous.id === id
        ? {
            ...previous,
            quantity: Math.max(0, previous.quantity + amount),
          }
        : previous
    );
  }

  const categories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];

  const filteredProducts =
    category === "All"
      ? products
      : products.filter((product) => product.category === category);

  const total = products.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0
  );

  return (
    <div className="app">
      <header className="header">
        <div>
          <p className="eyebrow">INVENTORY MANAGEMENT</p>
          <h1>Product Management</h1>
          <p>Manage your products in one place.</p>
        </div>

        <div className="total-box">
          <span>Overall Total</span>
          <strong>
            ₱{total.toLocaleString("en-PH", {
              minimumFractionDigits: 2,
            })}
          </strong>
        </div>
      </header>

      {selectedProduct ? (
        <ProductDetails
          product={
            products.find((p) => p.id === selectedProduct.id) ||
            selectedProduct
          }
          onBack={() => setSelectedProduct(null)}
        />
      ) : (
        <>
          <ProductForm onAddProduct={addProduct} />

          <section className="list-section">
            <div className="list-heading">
              <div>
                <h2>Product List</h2>
                <p className="section-description">
                  {filteredProducts.length} product(s) displayed
                </p>
              </div>

              <label className="filter-label">
                Category
                <select
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="product-grid">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onDetails={setSelectedProduct}
                  onAdd={(id) => changeQuantity(id, 1)}
                  onRemove={(id) => changeQuantity(id, -1)}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <p>No products found in this category.</p>
            )}
          </section>
        </>
      )}

      <footer>
        Product Management App · React and Vite
      </footer>
    </div>
  );
}
