import React, { useState } from "react";
import { Container, Row, Col, Card, Alert, Spinner, Button } from "react-bootstrap"; // Adicionando Button aqui
import { FaAddressCard, FaCity, FaAddressBook, FaRoad, FaUser, FaWeightHanging, FaGlobeAmericas} from "react-icons/fa";
import { TbWorldLongitude, TbWorldLatitude } from "react-icons/tb";
import { GoNumber } from "react-icons/go";
import { useNavigate } from "react-router-dom"; // Importando o hook de navegação
import { FaHouseChimney } from "react-icons/fa6";
import EnderecoLookup from "../components/EnderecoLookup";


function CreateDelivery() {
  const navigate = useNavigate(); // Hook para navegação
  const [error, setError] = useState(null); 
  const [formData, setFormData] = useState({
    nomeCliente: "",
    peso: 0.0,
    logradouro: "",
    numero: "",
    bairro: "",
    complemento: "",
    cidade: "",
    estado: "",
    pais: "",
    latitude: "",
    longitude: ""
  });
  const [message, setMessage] = useState("");
  
  const handleChangeNumber = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value ? parseFloat(value) : 0.0, // Converte para número apenas se isNumber for true
    });
  };

  const handleChangeString = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value ? String(value) : "", // Converte o valor sempre para string
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      formData.latitude = String(formData.latitude)
      formData.longitude = String(formData.longitude)
      const response = await fetch("http://localhost:8080/deliveries/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar a entrega");
      }

      setMessage("Entrega criada com sucesso!");
      setFormData({ 
        nomeCliente: "",
        peso: 0.0,
        logradouro: "",
        numero: "",
        bairro: "",
        complemento: "",  
        cidade: "",
        estado: "",
        pais: "",
        latitude: "",
        longitude: ""}); // Limpa o formulário

        navigate("/"); // Volta para a Home após a atualização
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <Container className="mt-4">
      <h1 className="text-center mb-4" style={{ fontWeight: "bold", color: "#007bff" }}>
        📦 Cadastro de Entregas
      </h1>

      {error && <Alert variant="danger">{error}</Alert>}
      <Card
        className="shadow-sm"
        style={{
          borderRadius: "15px",
          cursor: "pointer",
          border: "none",
          background: "#f8f9fa",
        }}
        
      >
        <Card.Body>
          <p style={{ display: "flex", alignItems: "center", gap: "8px", color: "#343a40" }}>
            <FaUser color="#007bff" /> Cliente:
              <input
                type="text"
                name="nomeCliente"
                value={formData.nomeCliente}
                onChange={(e) => handleChangeString(e)}
                required
              />
          </p>
          <p style={{ fontSize: "14px", color: "#6c757d" }}>
            <FaWeightHanging color="#6610f2" /> Peso:
              <input
                type="number"
                name="peso"
                value={formData.peso}
                onChange={(e) => handleChangeNumber(e)}
                required
              />
          </p>
          <div style={{ fontSize: "14px", color: "#6c757d" }}>
            <FaRoad color="#fd14f5" /> Endereço:
              <EnderecoLookup 
                setFormData={setFormData}
              />
          </div>
          <p style={{ fontSize: "14px", color: "#6c757d" }}>
            <FaHouseChimney color="#fd14f5" /> Logradouro:
            <input
              type="text"
              name="logradouro"
              value={formData.logradouro}
              onChange={(e) => handleChangeString(e)}
              required
            />
          </p>
          <p style={{ fontSize: "14px", color: "#6c757d" }}>
            <GoNumber color="#000000" /> Número:
            <input
              type="text"
              name="numero"
              value={formData.numero}
              onChange={(e) => handleChangeString(e)}
              required
            />
          </p>
          <p style={{ fontSize: "14px", color: "#6c757d" }}>
            <FaAddressCard color="#e61010" /> Bairro:
            <input
              type="text"
              name="bairro"
              value={formData.bairro}
              onChange={(e) => handleChangeString(e)}
              required
            />
          </p>
          <p style={{ fontSize: "14px", color: "#6c757d" }}>
            <FaAddressBook color="#d13d3d" /> Complemento:
            <input
              type="text"
              name="complemento"
              value={formData.complemento}
              onChange={(e) => handleChangeString(e)}
              required
            />
          </p>
          <p style={{ fontSize: "14px", color: "#6c757d" }}>
            <FaCity color="#25fa00" /> Cidade:
            <input
              type="text"
              name="cidade"
              value={formData.cidade}
              onChange={(e) => handleChangeString(e)}
              required
            />
          </p>
          <p style={{ fontSize: "14px", color: "#6c757d" }}>
            <FaGlobeAmericas color="#1c0dbf" /> Estado:
            <input
              type="text"
              name="estado"
              value={formData.estado}
              onChange={(e) => handleChangeString(e)}
              required
            />
          </p>
          <p style={{ fontSize: "14px", color: "#6c757d" }}>
            <FaGlobeAmericas color="#1c0dbf" /> País:
            <input
              type="text"
              name="pais"
              value={formData.pais}
              onChange={(e) => handleChangeString(e)}
              required
            />
          </p>
          <p style={{ fontSize: "14px", color: "#6c757d" }}>
            <TbWorldLatitude color="#ca3fcc" /> Latitude:
            <input
              type="text"
              name="latitude"
              value={formData.latitude}
              onChange={(e) => handleChangeString(e)}
              required
            />
          </p>
          <p style={{ fontSize: "14px", color: "#6c757d" }}>
            <TbWorldLongitude color="#3d123d" /> Longitude:
            <input
              type="text"
              name="longitude"
              value={formData.longitude}
              onChange={(e) => handleChangeString(e)}
              required
            />
          </p>
          
          {/* Botões de ação */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <Button
              variant="primary"
              onClick={handleCreate}
                style={{minWidth: "50px", padding: "10px 16px", textAlign: "center",}}
              >
              Criar Entrega
            </Button>
            <Button variant="secondary" onClick={() => navigate(-1)} style={{ minWidth: "50px", padding: "10px 16px" }}>
              Voltar
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>

  );
}

export default CreateDelivery;
