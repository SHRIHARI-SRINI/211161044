import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, Button, Dropdown, DropdownButton } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [sortType, setSortType] = useState('name');
  const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXM...'; // Replace with your actual token

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get('http://20.244.56.144/ecommerce-api', {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        });
        setProducts(result.data);
      } catch (error) {
        console.error('Error fetching products:', error.message);
      }
    };
    fetchData();
  }, []);

  const handleSort = (type) => {
    setSortType(type);
    const sorted = [...products].sort((a, b) => (a[type] > b[type] ? 1 : -1));
    setProducts(sorted);
  };

  return (
    <Container>
      <DropdownButton id="dropdown-basic-button" title="Sort By">
        <Dropdown.Item onClick={() => handleSort('name')}>Name</Dropdown.Item>
        <Dropdown.Item onClick={() => handleSort('price')}>Price</Dropdown.Item>
        <Dropdown.Item onClick={() => handleSort('rating')}>Rating</Dropdown.Item>
      </DropdownButton>
      {products.map((product) => (
        <Card key={product.id} style={{ width: '18rem' }}>
          <Card.Body>
            <Card.Title>{product.name}</Card.Title>
            <Card.Text>Price: {product.price}</Card.Text>
            <Card.Text>Rating: {product.rating}</Card.Text>
            <Button variant="primary" href={`/product/${product.id}`}>View Details</Button>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
};

export default AllProducts;
