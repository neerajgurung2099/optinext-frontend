import { useDidMount } from "@/hooks";
import { useEffect, useState } from "react";
import firebase from "@/services/firebase";

const useRecommendedProducts = (itemsCount) => {
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const didMount = useDidMount(true);

  const fetchRecommendedProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const products = await firebase.getAllProducts();

      const userHistory = await firebase.getUserPurchaseHistory(
        "0LXx7esqyjeHBXEBmavh"
      );
      console.log(import.meta.env.VITE_BACKEND_API);
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_API}/api/recommend`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            products,
            userHistory,
          }),
        }
      );
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      if (didMount) {
        setRecommendedProducts(data.recommended || []);
        setLoading(false);
      }
    } catch (e) {
      if (didMount) {
        setError("Failed to fetch recommended products");
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (recommendedProducts.length === 0 && didMount) {
      fetchRecommendedProducts();
    }
  }, []);

  return {
    recommendedProducts,
    fetchRecommendedProducts,
    isLoading,
    error,
  };
};

export default useRecommendedProducts;
