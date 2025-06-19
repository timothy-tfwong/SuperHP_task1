import { useState, useEffect } from 'react'
import './App.scss'

const products = [
  { id: 1, name: "iPhone", category: "electronics", price: 799, inStock: true },
  { id: 2, name: "Smart Watch", category: "electronics", price: 249, inStock: true },
  { id: 3, name: "T-shirt", category: "clothing", price: 49, inStock: true },
  { id: 4, name: "Jeans", category: "clothing", price: 79, inStock: true },
  { id: 5, name: "Gaming Console", category: "electronics", price: 499, inStock: true },
  { id: 6, name: "Winter Jacket", category: "clothing", price: 199, inStock: true },
  { id: 7, name: "Test Product1", category: "", price: 500, inStock: false },
  { id: 8, name: "Test Product2", category: "", price: 600, inStock: true }
];

function App() {
  // products list
  const [productList, setProductList] = useState([]);
  const [filteredProductList, setFilteredProductList] = useState([]);
  
  // filter
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 9999 });
  const [showInStock, setShowInStock] = useState(false);
  
  const [categoryList, setCategoryList] = useState([]);
  
  // products fetched from a mock API 
  useEffect(() => {
    const fetchProducts = () => {
      setTimeout(() => {
        setProductList(products); //original product list
        setFilteredProductList(products);
        setCategoryList([...new Set(products.map(product => product.category))].filter(category => category));
        const productPriceList = products.map(product => product.price);
        setPriceRange({ min: Math.min(...productPriceList), max: Math.max(...productPriceList) });
      }, 500);
    };
    fetchProducts();
  }, []);
  
  // watch changes of filters
  useEffect(() => {
    let filtered = [...productList];
    filtered = selectedCategory === "all" ? filtered : filtered.filter(product => product.category === selectedCategory);
    filtered = filtered.filter(
      product => product.price >= priceRange.min && product.price <= priceRange.max
    );
    filtered = showInStock ? filtered.filter(product => product.inStock) : filtered;
    setFilteredProductList(filtered);
  }, [selectedCategory, priceRange, showInStock, productList]);
  
  const handlePriceChange = (type, value) => {
    const numericValue = parseInt(value, 10) || 0;
    setPriceRange({
      ...priceRange,
      [type]: numericValue
    });
  };
  
  const resetFilters = () => {
    setSelectedCategory('all');
    const productPriceList = products.map(product => product.price);
    setPriceRange({ min: Math.min(...productPriceList), max: Math.max(...productPriceList) });
    setShowInStock(false);
  };

  return (
    <div>
      <div className="header">Product Page</div>
      <div className="body">
        <div className="filter-container">
          <h2 className="filter-container-title">Filters</h2>
          <div className="filter-container-item">
            <label className="filter-container-label">Category</label>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-container-category"
            >
              <option value="all">All</option>
              {categoryList.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
              <option value="">Uncategorised</option>
            </select>
          </div>
          <div className="filter-container-item">
            <label className="filter-container-label">Price Range</label>
            <div className="filter-container-range">
              <input
                type="number"
                value={priceRange.min}
                onChange={(e) => handlePriceChange('min', e.target.value)}
                min={0}
                className="filter-container-price"
                placeholder="Min"
              />
              <span>-</span>
              <input
                type="number"
                value={priceRange.max}
                onChange={(e) => handlePriceChange('max', e.target.value)}
                min={priceRange.min}
                className="filter-container-price"
                placeholder="Max"
              />
            </div>
          </div>
          <div className="filter-container-item">
            <label className="">
              <input
                type="checkbox"
                checked={showInStock}
                onChange={() => setShowInStock(!showInStock)}
                className="filter-container-checkbox"
              />
              <span>Show in-stock only</span>
            </label>
          </div>
          
          <button
            onClick={resetFilters}
            className="filter-button"
          >
            Reset Filters
          </button>
        </div>
        {filteredProductList.length > 0 ? (
          <div className="product-container">
            {filteredProductList.map(product => (
              <div 
                key={product.id} 
                className="product-card"
              >
                <div className="product-card-name">{product.name}</div>
                <div className="product-card-row">
                  <span className="product-card-category">
                    {product.category}
                  </span>
                  <span className={`product-card-stock ${product.inStock ? 'active' : 'inactive'}`}>
                    {product.inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
                <div className="product-card-price">${product.price}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="product-empty">No products found.</div>
        )}
      </div>
    </div>
  )
}

export default App
