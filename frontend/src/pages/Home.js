import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Alert, Spinner, Button } from "react-bootstrap"; // Adicionando Button aqui
import { FaAddressCard, FaCity, FaAddressBook, FaRoad, FaUser, FaWeightHanging, FaGlobeAmericas } from "react-icons/fa";
import { GoNumber } from "react-icons/go";
import { TbWorldLongitude, TbWorldLatitude } from "react-icons/tb";
import { useNavigate } from "react-router-dom"; // Importando useNavigate
import { FaHouseChimney } from "react-icons/fa6";
  

function Home() {
  const [deliveries, setDeliveries] = useState([]); // Garante que seja um array vazio no início
  const [error, setError] = useState(null); 
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate(); // Inicializando useNavigate

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await fetch("http://localhost:8080/deliveries", {
          method: "GET",
          mode: "cors",
        });
        if (!response.ok) {
          throw new Error("Erro ao buscar entregas");
        }
        const data = await response.json();
        setDeliveries(data || []); // Garante que 'data' seja um array
      } catch (error) {
        setError(error.message);
        setDeliveries([]); // Garante que deliveries SEMPRE seja um array
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, []);

  const handleCreate = () => {
    navigate("/create"); // Redireciona para a página de criação de entrega
  };

  // Função para excluir uma entrega
  const handleDelete = async (id) => {
    if (window.confirm("Você tem certeza que deseja excluir esta entrega?")) {
      try {
        const response = await fetch(`http://localhost:8080/deliveries/delete`, {
          method: "DELETE",
          mode: "cors",
          headers: {"Content-type": "application/jason",},        
          body: JSON.stringify({id}), // passar o id no corpo da requisição
        });
        if (!response.ok) {
          throw new Error("Erro ao excluir a entrega");
        }
        // Atualiza a lista de entregas após a exclusão
        setDeliveries((prevDeliveries) => prevDeliveries.filter((delivery) => delivery.id !== id));
      } catch (error) {
        setError(error.message);
      }
    }
  };

  // Função para editar uma entrega
  const handleUpdate = (id) => {
    // Implementar lógica de edição, por exemplo, redirecionar para um formulário de edição
    navigate(`/update/${id}`);
  };

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 style={{ fontWeight: "bold", color: "#007bff" }}>📦 Lista de Entregas</h1>
        <Button variant="success" onClick={handleCreate}>➕ Criar Entrega</Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

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
                  borderRadius: "15px",
                  transition: "0.3s",
                  cursor: "pointer",
                  border: "none",
                  background: "#f8f9fa",
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
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
                        onClick={() => handleUpdate(delivery.id)}
                        style={{ minWidth: "50px", padding: "10px 16px", textAlign: "center" }}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(delivery.id)}
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
          !loading && <p className="text-center">Nenhuma entrega encontrada.</p>
        )}
      </Row>
    </Container>
  );
}

export default Home;
