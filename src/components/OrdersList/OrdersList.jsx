import React, { useEffect, useState } from "react";
import "./ordersList.scss";

const TABS = [
  { key: "all", label: "Toutes les commandes", count: 0 },
  { key: "traineeship", label: "Stages", icon: "🎭" },
  { key: "show", label: "Spectacles", icon: "🎪" },
  { key: "trial-course", label: "Cours d'essai", icon: "🎯" },
  { key: "classic-course", label: "Cours classiques", icon: "📚" },
];

const OrdersList = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [allOrders, setAllOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/orders`, {
          credentials: "include",
          mode: "cors",
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: "Erreur serveur" }));
          throw new Error(err.error || `HTTP ${res.status}`);
        }

        const json = await res.json();

        const coursesOrders = json.data.filter(o => o.type === "courses");
        
        setAllOrders(json.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const getOrderType = (order) => {
    return order.type;
  };

  useEffect(() => {
    if (activeTab === "all") {
      setFilteredOrders(allOrders);
    } else {
      setFilteredOrders(allOrders.filter(order => {
        const orderType = getOrderType(order);
        return orderType === activeTab;
      }));
    }
  }, [activeTab, allOrders]);

  const counts = {
    all: allOrders.length,
    traineeship: allOrders.filter(o => o.type === "traineeship").length,
    show: allOrders.filter(o => o.type === "show").length,
    "trial-course": allOrders.filter(o => getOrderType(o) === "trial-course").length,
    "classic-course": allOrders.filter(o => getOrderType(o) === "classic-course").length,
  };

  const getTypeLabel = (order) => {
    const type = getOrderType(order);
    switch (type) {
      case "traineeship": return "🎭 Stage";
      case "show": return "🎪 Spectacle";
      case "trial-course": return "🎯 Cours d'essai";
      case "classic-course": return "📚 Cours classique";
      default: return type;
    }
  };

  if (loading) return <div className="orders-loading">Chargement des commandes...</div>;
  if (error) return <div className="orders-error">Erreur : {error}</div>;

  return (
    <div className="orders-container">
      <h1>Gestion des commandes</h1>

      <div className="tabs">
        {TABS.map(tab => (
          <button
            key={tab.key}
            className={`tab ${activeTab === tab.key ? "active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.icon && <span className="tab-icon">{tab.icon}</span>}
            {tab.label}
            <span className="tab-count">{counts[tab.key]}</span>
          </button>
        ))}
      </div>

      <div className="table-wrapper">
        {filteredOrders.length === 0 ? (
          <p className="no-orders">Aucune commande dans cette catégorie pour le moment.</p>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Numéro</th>
                <th>Type</th>
                <th>Client</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Événement</th>
                <th>Montant</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => (
                <tr key={order.id}>
                  <td>{order.date}</td>
                  <td><strong>{order.orderNumber}</strong></td>
                  <td>
                    <span className={`type-badge type-${getOrderType(order)}`}>
                      {getTypeLabel(order)}
                    </span>
                  </td>
                  <td>{order.customer}</td>
                  <td>{order.email}</td>
                  <td>{order.phone}</td>
                  <td>{order.eventTitle}</td>
                  <td><strong>{order.amount}</strong></td>
                  <td>
                    <span className={`status status-${order.status}`}>
                      {order.status === "paid" ? "Payée" : order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default OrdersList;