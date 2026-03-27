import React from "react";

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null; // 🔥 MOST IMPORTANT FIX

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "rgba(0,0,0,0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 999
    }}>
      
      {/* Modal Box */}
      <div style={{
        background: "white",
        padding: "20px",
        borderRadius: "12px",
        width: "400px",
        position: "relative"
      }}>
        
        {/* Header */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "15px"
        }}>
          <h2>{title}</h2>
          <button onClick={onClose}>✖</button>
        </div>

        {/* Content */}
        {children}

      </div>
    </div>
  );
};

export default Modal;