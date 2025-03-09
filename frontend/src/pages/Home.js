import React, { useEffect, useState } from "react"; // Importa React e hooks useEffect e useState
import { Container, Row, Col, Card, Alert, Spinner, Button } from "react-bootstrap"; // Importa componentes do React-Bootstrap
import { FaAddressCard, FaCity, FaAddressBook, FaUser, FaWeightHanging, FaGlobeAmericas } from "react-icons/fa"; // Importa ícones
import { GoNumber } from "react-icons/go"; // Importa ícone de número
import { TbWorldLongitude, TbWorldLatitude } from "react-icons/tb"; // Importa ícones de latitude e longitude
import { useNavigate } from "react-router-dom"; // Importa o hook useNavigate para redirecionamento
import { FaHouseChimney } from "react-icons/fa6"; // Importa ícone de casa
  

function Home() {
  // Declara estados para armazenar entregas, erros e status de carregamento
  const [deliveries, setDeliveries] = useState([]); // Inicia como um array vazio
  const [error, setError] = useState(null); // Inicia sem erros
  const [loading, setLoading] = useState(true); // Inicia como carregando
  const navigate = useNavigate(); // Inicializa o hook useNavigate

  // useEffect para buscar as entregas quando o componente é montado
  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        // Faz a requisição para buscar as entregas
        const response = await fetch("http://localhost:8080/deliveries", {
          method: "GET",
          mode: "cors",
        });

        // Verifica se a resposta da API é bem-sucedida
        if (!response.ok) {
          throw new Error("Erro ao buscar entregas");
        }
        const data = await response.json(); // Converte a resposta para JSON
        setDeliveries(data || []); // Atualiza o estado com os dados recebidos
      } catch (error) {
        setError(error.message); // Atualiza o estado de erro
        setDeliveries([]); // Garante que deliveries SEMPRE seja um array
      } finally {
        setLoading(false); // Atualiza o estado de carregamento para falso
      }
    };

    fetchDeliveries(); // Chama a função para buscar as entregas
  }, []); // Dependência vazia, executa apenas uma vez ao montar o componente


   // Função para redirecionar para a página de criação de entrega
   const handleCreate = () => {
    navigate("/create"); // Redireciona para a rota de criação
  };

  // Função para excluir uma entrega
  const handleDelete = async (id) => {
    if (window.confirm("Você tem certeza que deseja excluir esta entrega?")) {
      try {
        // Faz a requisição para excluir a entrega
        const response = await fetch(`http://localhost:8080/deliveries/delete`, {
          method: "DELETE",
          mode: "cors",
          headers: { "Content-type": "application/json" }, // Corrigido para "application/json"
          body: JSON.stringify({ id }), // Envia o id no corpo da requisição
        });
        // Verifica se a resposta da API é bem-sucedida
        if (!response.ok) {
          throw new Error("Erro ao excluir a entrega");
        }
        // Atualiza a lista de entregas após a exclusão
        setDeliveries((prevDeliveries) => prevDeliveries.filter((delivery) => delivery.id !== id));
      } catch (error) {
        setError(error.message); // Atualiza o estado de erro em caso de falha
      }
    }
  };

   // Função para editar uma entrega
   const handleUpdate = (id) => {
    // Redireciona para a página de edição da entrega
    navigate(`/update/${id}`);
  };


  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 style={{ fontWeight: "bold", color: "#007bff" }}>📦 Lista de Entregas</h1>
        <Button variant="success" onClick={handleCreate}>➕ Criar Entrega</Button> {/* Botão para criar entrega */}
      </div>

      {error && <Alert variant="danger">{error}</Alert>} {/* Exibe mensagem de erro, se houver */}

      {loading && (
        <div className="text-center">
          <Spinner animation="border" />
        </div>
      )}

      <Row>
        {deliveries.length > 0 ? (
          deliveries.map((delivery) => (
            <Col key={delivery.id} md={4} sm={6} xs={12} className="mb-4">
              <Card
                className="shadow-sm"
                style={{
                  borderRadius: "15px", // Bordas arredondadas
                  transition: "0.3s", // Transição suave ao passar o mouse
                  cursor: "pointer", // Cursor de ponteiro ao passar o mouse
                  border: "none", // Sem borda
                  background: "#f8f9fa", // Cor de fundo
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")} // Efeito de zoom ao passar o mouse
                onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")} // Retorna ao tamanho original
              >
                <Card.Body>
                  <h5 style={{ display: "flex", alignItems: "center", gap: "8px", color: "#343a40" }}>
                    <FaUser color="#007bff" /> {delivery.cliente}
                  </h5>
                  <p style={{ fontSize: "14px", color: "#6c757d" }}>
                    <FaWeightHanging color="#6610f2" /> Peso: <strong>{delivery.peso}</strong>
                  </p>
                  <p style={{ fontSize: "14px", color: "#6c757d" }}>
                    <FaHouseChimney color="#fd14f5" /> Logradouro: <strong>{delivery.logradouro}</strong>
                  </p>
                  <p style={{ fontSize: "14px", color: "#6c757d" }}>
                    <GoNumber color="#000000" /> Número: <strong>{delivery.numero}</strong>
                  </p>
                  <p style={{ fontSize: "14px", color: "#6c757d" }}>
                    <FaAddressCard color="#e61010" /> Bairro: <strong>{delivery.bairro}</strong>
                  </p>
                  <p style={{ fontSize: "14px", color: "#6c757d" }}>
                    <FaAddressBook color="#d13d3d" /> Complemento: <strong>{delivery.complemento}</strong>
                  </p>
                  <p style={{ fontSize: "14px", color: "#6c757d" }}>
                    <FaCity color="#25fa00" /> Cidade: <strong>{delivery.cidade}</strong>
                  </p>
                  <p style={{ fontSize: "14px", color: "#6c757d" }}>
                    <FaCity color="#25fa00" /> Estado: <strong>{delivery.estado}</strong>
                  </p>
                  <p style={{ fontSize: "14px", color: "#6c757d" }}>
                    <FaGlobeAmericas color="#1c0dbf" /> País: <strong>{delivery.pais}</strong>
                  </p>
                  <p style={{ fontSize: "14px", color: "#6c757d" }}>
                    <TbWorldLatitude color="#ca3fcc" /> Latitude: <strong>{delivery.geolocalizacao_latitude}</strong>
                  </p>
                  <p style={{ fontSize: "14px", color: "#6c757d" }}>
                    <TbWorldLongitude color="#3d123d" /> Longitude: <strong>{delivery.geolocalizacao_longitude}</strong>
                  </p>
                  {/* Botões de ação */}
                    <div>
                      <Button
                      onClick={() => handleUpdate(delivery.id)} // Chama a função de atualização
                      style={{ minWidth: "50px", padding: "10px 16px", textAlign: "center" }}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(delivery.id)} // Chama a função de exclusão
                        style={{ minWidth: "50px", padding: "10px 16px", textAlign: "center", marginLeft: "10px" }}
                      >
                        Excluir
                      </Button>
                    </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          // Caso não haja entregas, exibe uma mensagem
          !loading && <p className="text-center">Nenhuma entrega encontrada.</p>
        )}
      </Row>
    </Container>
  );
}

export default Home; // Exporta o componente
