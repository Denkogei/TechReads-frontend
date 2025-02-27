import React from "react";


const Wishlist = ({ wishlistItems = [], addToCart }) => {
  return (
    <div className="wishlist-container">
      <h2 className="wishlist-title">My WishList</h2>

      {wishlistItems.length === 0 ? (
        <p className="wishlist-empty">Your wishlist is empty.</p>
      ) : (
        <table className="wishlist-table">
          <thead>
            <tr>
              <th>Book</th>
              <th> Book Name</th>
              <th> Price</th>
              <th>Stock Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {wishlistItems.map((item) => (
              <tr key={item.id}>
                <td>
                  <img
                    src={item.image}
                    alt={item.title}
                    className="wishlist-img"
                  />
                </td>
                <td>{item.title}</td>
                <td>KSH {item.price}</td>
                <td>{item.stockStatus}</td>
                <td>
                  <button
                    onClick={() => addToCart(item)}
                    className="add-to-cart-btn"
                  >
                    Add to Cart
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Wishlist;
