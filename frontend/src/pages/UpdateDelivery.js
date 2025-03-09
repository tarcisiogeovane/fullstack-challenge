import React, { useState, useEffect } from "react";
import { Container, Card, Alert, Button } from "react-bootstrap";
import { FaUser, FaWeightHanging, FaRoad, FaCity, FaGlobeAmericas } from "react-icons/fa";
import { TbWorldLongitude, TbWorldLatitude } from "react-icons/tb";
import { GoNumber } from "react-icons/go";
import { useParams } from "react-router-dom"; // Para pegar o ID da URL
import { useNavigate } from "react-router-dom"; // Importando useNavigate
import { FaHouseChimney } from "react-icons/fa6";
import EnderecoLookup from "../components/EnderecoLookup"; 


function UpdateDelivery() {
    const [error] = useState(null); 
    const { id } = useParams(); // Pega o ID da URL
    const [enderecoInput, setEnderecoInput] = useState ("");
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


  const [endereco, setEndereco] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [pais, setPais] = useState("");


  useEffect(() => {
    // Buscar os dados da entrega pelo ID
    const fetchDelivery = async () => {
      try {
        const response = await fetch(`http://localhost:8080/deliveries/delivery?id=${id}`, {
          method: "GET",
          headers: { 
          "Content-Type": "application/json"
         },
        });
        if (!response.ok) {
          throw new Error("Erro ao carregar dados da entrega");
        }
        const data = await response.json();
        setFormData(data);
      } catch (error) {
        console.error(error.message);
      }
    }
    fetchDelivery();
  },[id]);
  
  const navigate = useNavigate();

  const [message, setMessage] = useState("");

  const handleChange = (e, isNumber = false) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: isNumber ? value !== "" ? parseFloat(value) : "" : value,
    });
  };

  const handleUpdate = async (e) => {
   // e.preventDefault();
   // setMessage("");

    try {
      formData.latitude = String(formData.latitude)
      formData.longitude = String(formData.longitude)
      const response = await fetch(`http://localhost:8080/deliveries/update/${id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json"
         },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Erro ao atualizar a entrega");
      }

      alert("Entrega atualizada com sucesso!");

      navigate("/"); // Volta para a Home após a atualização

    
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Container className="mt-4">
      <h1 className="text-center mb-4" style={{ fontWeight: "bold", color: "#007bff" }}>
        📦 Atualizar Entrega
      </h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Card className="shadow-sm" style={{ borderRadius: "15px", background: "#f8f9fa" }}>
        <Card.Body>
          
          <p><FaUser color="#007bff" /> Cliente:
            <input type="text" name="nomeCliente" value={formData.nomeCliente} onChange={handleChange} required />
          </p>
          <p><FaWeightHanging color="#6610f2" /> Peso:
            <input type="number" name="peso" value={formData.peso} onChange={(e) => handleChange(e, true)} required />
          </p>
          <p><FaRoad color="#fd14f5" /> Endereço:
            <EnderecoLookup 
              setFormData={setFormData}
            />
          </p>
          <p><FaHouseChimney color="#fd14f5" /> Logradouro:
            <input type="text" name="logradouro" value={formData.logradouro} onChange={handleChange} required />
          </p>
          <p><GoNumber color="#000000" /> Número:
            <input type="text" name="numero" value={formData.numero} onChange={handleChange} required />
          </p>
          <p><FaCity color="#25fa00" /> Cidade:
            <input type="text" name="cidade" value={formData.cidade} onChange={handleChange} required />
          </p>
          <p><FaGlobeAmericas color="#1c0dbf" /> Estado:
            <input type="text" name="estado" value={formData.estado} onChange={handleChange} required />
          </p>
          <p><FaGlobeAmericas color="#1c0dbf" /> País:
            <input type="text" name="pais" value={formData.pais} onChange={handleChange} required />
          </p>
          <p><TbWorldLatitude color="#ca3fcc" /> Latitude:
            <input type="text" name="latitude" value={formData.latitude} onChange={handleChange} required />
          </p>
          <p><TbWorldLongitude color="#3d123d" /> Longitude:
            <input type="text" name="longitude" value={formData.longitude} onChange={handleChange} required />
          </p>
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <Button variant="primary" onClick={handleUpdate}>
              Atualizar Entrega
            </Button>
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Voltar
            </Button>
          </div>
          {message && <Alert variant="info" className="mt-3">{message}</Alert>}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default UpdateDelivery;
