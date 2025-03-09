import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function DeleteDelivery() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("ID recebido para exclusão:", id);
  }, [id]);

  const handleDelete = async () => {
    if (!id) {
      console.error("ID inválido, impossível excluir.");
      setError("ID inválido.");
      return;
    }

    if (!window.confirm("Tem certeza que deseja excluir esta entrega?")) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`http://localhost:8080/deliveries/`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Erro ao excluir entrega.");
      }

      console.log("Entrega excluída com sucesso!");
      navigate("/");
    } catch (error) {
      console.error("Erro ao excluir entrega:", error);
      setError(error.message);
      alert("Falha ao excluir. Verifique a API.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <h1>Excluir Entrega</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <p>Tem certeza que deseja excluir esta entrega?</p>
      <button onClick={handleDelete} disabled={isDeleting}>
        {isDeleting ? "Excluindo..." : "Sim, excluir"}
      </button>
      <button onClick={() => navigate("/")}>Cancelar</button>
    </div>
  );
}

export default DeleteDelivery;
