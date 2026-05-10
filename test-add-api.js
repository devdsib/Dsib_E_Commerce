const axios = require('axios');

async function testAdd() {
  try {
    const { data: categoriesData } = await axios.get('http://localhost:5000/api/v1/categories');
    if (!categoriesData.categories || categoriesData.categories.length === 0) {
      console.log('No categories found, cannot add product.');
      return;
    }
    const catId = categoriesData.categories[0].id;
    
    const payload = {
      name: 'Test Add Product',
      sku: 'TEST-ADD-001',
      price: 100,
      stockQuantity: 10,
      categoryId: catId,
      description: 'Test description',
      slug: 'test-add-product',
      images: [],
    };
    
    console.log('Sending payload:', payload);
    const res = await axios.post('http://localhost:5000/api/v1/products', payload);
    console.log('Add status:', res.status);
    console.log('Product added successfully. ID:', res.data.product.id);
  } catch (err) {
    console.error('Add failed!');
    if (err.response) {
      console.error('Status:', err.response.status);
      console.error('Data:', err.response.data);
    } else {
      console.error(err.message);
    }
  }
}

testAdd();
