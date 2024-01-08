import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DetailPostModal from './DetailPostl';

function RoomPosts({userId}) {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchUserProducts = async () => {
      try {
        const response = await axios.get(`/api/users/${userId}/products`); // 유저 ID를 사용하여 API 호출
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching user products', error);
      }
    };

    if (userId) {
      fetchUserProducts();
    }
  }, [userId]); // 유저 ID가 변경될 때마다 호출


  return (
    <div>
      {products.map(product => (
        <div key={product.id} onClick={() => setSelectedProduct(product)}>
          {product.name}
        </div>
      ))}

      {selectedProduct && <DetailPostModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </div>
  );
}

export default RoomPosts;
