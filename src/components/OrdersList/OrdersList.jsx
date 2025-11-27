import React, { useEffect, useState } from "react";
import "./ordersList.scss";

const TABS = [
  { key: "all", label: "Toutes les commandes", count: 0 },
  { key: "traineeship", label: "Stages", icon: "Stage" },
  { key: "show", label: "Spectacles", icon: "Show" },
  { key: "courses", label: "Cours", icon: "Courses" },
];

const OrdersList = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [allOrders, setAllOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Chargement une seule fois
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/orders`);
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Impossible de charger les commandes");
        setAllOrders(json.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Filtrage quand on change d'onglet
  useEffect(() => {
    if (activeTab === "all") {
      setFilteredOrders(allOrders);
    } else {
      setFilteredOrders(allOrders.filter(order => order.type === activeTab));
    }
  }, [activeTab, allOrders]);

  // Compteurs pour les onglets
  const counts = {
    all: allOrders.length,
    traineeship: allOrders.filter(o => o.type === "traineeship").length,
    show: allOrders.filter(o => o.type === "show").length,
    courses: allOrders.filter(o => o.type === "courses").length,
  };

  const getTypeLabel = (type) => {
    switch (type) {
      case "traineeship": return "Stage";
      case "show": return "Spectacle";
      case "courses": return "Cours";
      default: return type;
    }
  };

  if (loading) return <div className="orders-loading">Chargement des commandes...</div>;
  if (error) return <div className="orders-error">Erreur : {error}</div>;

  return (
    <div className="orders-container">
      <h1>Gestion des commandes</h1>

      {/* ONGLETS */}
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

      {/* TABLEAU */}
      <div className="table-wrapper">
        {filteredOrders.length === 0 ? (
          <p className="no-orders">Aucune commande dans cette catégorie pour le moment.</p>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Numéro</th>
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
                  <td>{order.customer}</td>
                  <td>{order.email}</td>
                  <td>{order.phone}</td>
                  <td>{order.eventTitle}</td>
                  <td><strong>{order.amount}</strong></td>
                  <td>
                    <span className={`status status-${order.status}`}>
                      {order.status === "paid" ? "Payée" : order}
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