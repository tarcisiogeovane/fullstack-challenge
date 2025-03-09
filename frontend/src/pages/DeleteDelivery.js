import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function DeleteDelivery() {
    // Obtém o parâmetro 'id' da URL
  const { id } = useParams();
    // Inicializa a função de navegação para redirecionar o usuário
  const navigate = useNavigate();
    // Estado para gerenciar o status de exclusão
  const [isDeleting, setIsDeleting] = useState(false);
    // Estado para armazenar possíveis erros
  const [error, setError] = useState(null);

    // Efeito que roda ao montar o componente ou quando 'id' muda
  useEffect(() => {
    console.log("ID recebido para exclusão:", id);
  }, [id]);

    // Função para lidar com a exclusão da entrega
  const handleDelete = async () => {
        // Verifica se o 'id' é válido
    if (!id) {
      console.error("ID inválido, impossível excluir.");
      setError("ID inválido.");
      return;
    }

        // Confirmação antes de prosseguir com a exclusão
    if (!window.confirm("Tem certeza que deseja excluir esta entrega?")) {
      return;
    }

        // Define o estado de exclusão como verdadeiro
    setIsDeleting(true);

    try {
        // Realiza a chamada para a API para excluir a entrega
      const response = await fetch(`http://localhost:8080/deliveries/`, {
        method: "DELETE",
      });

        // Verifica se a resposta da API é ok
      if (!response.ok) {
        throw new Error("Erro ao excluir entrega.");
      }

      console.log("Entrega excluída com sucesso!");
        // Redireciona para a página principal após a exclusão
      navigate("/");
    } catch (error) {
        // Captura e exibe erros durante o processo de exclusão
      console.error("Erro ao excluir entrega:", error);
      setError(error.message);
      alert("Falha ao excluir. Verifique a API.");
    } finally {
        // Restaura o estado de exclusão
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
