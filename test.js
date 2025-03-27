npm install @tanstack/react-query axios
// src/services/api.ts
// src/services/api.ts

const BASE_URL = "https://api.example.com";

const fetchData = async (endpoint: string) => {
  const response = await fetch(`${BASE_URL}${endpoint}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}: ${response.statusText}`);
  }

  return response.json();
};

// API functions
export const fetchUsers = () => fetchData("/users");
export const fetchOrders = () => fetchData("/orders");
export const fetchRevenue = () => fetchData("/revenue");
export const fetchProducts = () => fetchData("/products");


// src/main.tsx (or App.tsx)
import React from "react";
import ReactDOM from "react-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Dashboard from "./Dashboard";

const queryClient = new QueryClient();

ReactDOM.render(
  <QueryClientProvider client={queryClient}>
    <Dashboard />
  </QueryClientProvider>,
  document.getElementById("root")
);




// src/Dashboard.tsx
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchUsers, fetchOrders, fetchRevenue, fetchProducts } from "./services/api";
import Loader from "./components/Loader";
import UsersTable from "./components/UsersTable";
import OrdersTable from "./components/OrdersTable";
import RevenueChart from "./components/RevenueChart";
import ProductsChart from "./components/ProductsChart";

const Dashboard = () => {
  // Fetch data in parallel
  const usersQuery = useQuery({ queryKey: ["users"], queryFn: fetchUsers });
  const ordersQuery = useQuery({ queryKey: ["orders"], queryFn: fetchOrders });
  const revenueQuery = useQuery({ queryKey: ["revenue"], queryFn: fetchRevenue });
  const productsQuery = useQuery({ queryKey: ["products"], queryFn: fetchProducts });

  // Global loading state (checks if any query is loading)
  const isLoading = usersQuery.isLoading || ordersQuery.isLoading || revenueQuery.isLoading || productsQuery.isLoading;

  // Global error state
  const isError = usersQuery.isError || ordersQuery.isError || revenueQuery.isError || productsQuery.isError;

  if (isLoading) return <Loader />;
  if (isError) return <div>Error loading data. Please try again.</div>;

  return (
    <div>
      <h1>Dashboard</h1>
      <UsersTable data={usersQuery.data} />
      <OrdersTable data={ordersQuery.data} />
      <RevenueChart data={revenueQuery.data} />
      <ProductsChart data={productsQuery.data} />
    </div>
  );
};

export default Dashboard;






7. Optimizing Performance
Enable Background Refetching
Set up background refetching for fresh data without blocking UI.

tsx
Copy
Edit
useQuery({
  queryKey: ["users"],
  queryFn: fetchUsers,
  staleTime: 1000 * 60 * 5, // 5 minutes before refetch
  refetchInterval: 1000 * 30, // Auto refetch every 30 seconds
});
Show Skeleton Instead of Generic Loader
tsx
Copy
Edit
const UsersTable = ({ data, isLoading }) => {
  if (isLoading) return <SkeletonLoader />;
  return (/* Render table */);
};





