const axios = require('axios');

async function testDelete() {
  try {
    const { data } = await axios.get('http://localhost:5000/api/v1/products');
    const products = data.products;
    if (products.length === 0) {
      console.log('No products to delete.');
      return;
    }
    const productToDelete = products[0];
    console.log(`Trying to delete product: ${productToDelete.name} (ID: ${productToDelete.id})`);
    
    const res = await axios.delete(`http://localhost:5000/api/v1/products/${productToDelete.id}`);
    console.log('Delete status:', res.status);
    console.log('Product deleted successfully.');
  } catch (err) {
    console.error('Delete failed!');
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Data:', err.response.data);
    } else {
      console.error(err.message);
    }
  }
}

testDelete();
