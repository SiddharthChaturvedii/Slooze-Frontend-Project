import { ApolloClient, InMemoryCache } from '@apollo/client';
import { SchemaLink } from '@apollo/client/link/schema/index.js';
import { makeExecutableSchema } from '@graphql-tools/schema';

// Mock schema definition
const typeDefs = `
  type User {
    id: ID!
    email: String!
    name: String!
    role: String!
  }

  type Product {
    id: ID!
    name: String!
    category: String!
    price: Float!
    stock: Int!
    status: String!
  }

  type Query {
    me: User
    products: [Product!]!
    dashboardStats: Stats!
  }

  type Stats {
    totalProducts: Int!
    lowStock: Int!
    activeUsers: Int!
  }

  type Mutation {
    login(email: String!, password: String!): AuthResponse!
    addProduct(name: String!, category: String!, price: Float!, stock: Int!): Product!
    updateProduct(id: ID!, name: String, category: String, price: Float, stock: Int): Product!
  }

  type AuthResponse {
    token: String!
    user: User!
  }
`;

// Initial dummy database state
let mockProducts = [
  { id: '1', name: 'Gold Bar (1oz)', category: 'Precious Metals', price: 1950.00, stock: 150, status: 'IN_STOCK' },
  { id: '2', name: 'Silver Coin', category: 'Precious Metals', price: 23.50, stock: 500, status: 'IN_STOCK' },
  { id: '3', name: 'Brent Crude Oil (Barrel)', category: 'Energy', price: 85.20, stock: 10000, status: 'IN_STOCK' },
  { id: '4', name: 'Wheat (Bushel)', category: 'Agriculture', price: 6.75, stock: 50, status: 'LOW_STOCK' },
];

const resolvers = {
  Query: {
    me: () => null, // Initially unauthenticated
    products: () => mockProducts,
    dashboardStats: () => ({
      totalProducts: mockProducts.length,
      lowStock: mockProducts.filter(p => p.stock < 100).length,
      activeUsers: 42
    })
  },
  Mutation: {
    login: (_: any, { email, password }: any) => {
      // Simple mock authentication logic
      if (email === 'manager@slooze.xyz' && password === 'admin123') {
        return { token: 'mock-jwt-manager', user: { id: '1', email, name: 'Slooze Manager', role: 'MANAGER' } };
      }
      if (email === 'storekeeper@slooze.xyz' && password === 'store123') {
        return { token: 'mock-jwt-storekeeper', user: { id: '2', email, name: 'Slooze Keeper', role: 'STORE_KEEPER' } };
      }
      throw new Error('Invalid email or password');
    },
    addProduct: (_: any, args: any) => {
      const newProduct = { 
        id: String(mockProducts.length + 1), 
        status: args.stock > 0 ? 'IN_STOCK' : 'OUT_OF_STOCK', 
        ...args 
      };
      mockProducts.push(newProduct);
      return newProduct;
    },
    updateProduct: (_: any, args: any) => {
      const idx = mockProducts.findIndex(p => p.id === args.id);
      if (idx === -1) throw new Error('Product not found');
      mockProducts[idx] = { ...mockProducts[idx], ...args };
      mockProducts[idx].status = mockProducts[idx].stock > 0 ? 'IN_STOCK' : 'OUT_OF_STOCK';
      return mockProducts[idx];
    }
  }
};

const schema = makeExecutableSchema({ typeDefs, resolvers });

// Initialize Apollo Client locally bridging to the executable schema
const apolloClient = new ApolloClient({
  cache: new InMemoryCache(),
  link: new SchemaLink({ schema })
});

export default apolloClient;
