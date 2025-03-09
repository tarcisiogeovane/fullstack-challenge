import React, { useState, useEffect } from "react"; // Importa React e hooks
import { Container, Card, Alert, Button } from "react-bootstrap"; // Importa componentes do React-Bootstrap
import { FaUser, FaWeightHanging, FaRoad, FaCity, FaGlobeAmericas } from "react-icons/fa"; // Importa ícones
import { TbWorldLongitude, TbWorldLatitude } from "react-icons/tb"; // Importa ícones de longitude e latitude
import { GoNumber } from "react-icons/go"; // Importa ícone de número
import { useParams } from "react-router-dom"; // Para pegar o ID da URL
import { useNavigate } from "react-router-dom"; // Importando useNavigate para navegação
import { FaHouseChimney } from "react-icons/fa6"; // Importa ícone de casa
import EnderecoLookup from "../components/EnderecoLookup"; // Importa componente de busca de endereço


function UpdateDelivery() {
  const [error] = useState(null); // Estado para gerenciar erros
  const { id } = useParams(); // Pega o ID da URL
  const [enderecoInput, setEnderecoInput] = useState(""); // Estado para gerenciar input de endereço
  const [formData, setFormData] = useState({ // Estado para gerenciar os dados do formulário
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
          throw new Error("Erro ao carregar dados da entrega"); // Lança erro se a resposta não for ok
        }
        const data = await response.json(); // Converte a resposta em JSON
                setFormData(data); // Atualiza o estado com os dados da entrega
            } catch (error) {
                console.error(error.message); // Loga erro no console
      }
    }
    fetchDelivery(); // Chama a função para buscar os dados
  },[id]);
  
  const navigate = useNavigate(); // Hook para navegação
  const [message, setMessage] = useState(""); // Estado para mensagens

  const handleChange = (e, isNumber = false) => {
    const { name, value } = e.target; // Desestrutura o evento para pegar o nome e valor
    setFormData({
        ...formData,
        [name]: isNumber ? value !== "" ? parseFloat(value) : "" : value, // Atualiza o estado com o novo valor
    });
};

const handleUpdate = async (e) => {
  // e.preventDefault(); // Previne o comportamento padrão do formulário
  // setMessage(""); // Limpa a mensagem anterior

  try {
    formData.latitude = String(formData.latitude) // Converte latitude para string
    formData.longitude = String(formData.longitude) // Converte longitude para string
    const response = await fetch(`http://localhost:8080/deliveries/update/${id}`, { // Faz a requisição para atualizar a entrega
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formData), // Converte os dados do formulário em JSON
    });
    if (!response.ok) {
      throw new Error("Erro ao atualizar a entrega"); // Lança erro se a resposta não for ok
  }

  alert("Entrega atualizada com sucesso!"); // Exibe mensagem de sucesso
  navigate("/"); // Volta para a Home após a atualização


    
} catch (error) {
  alert(error.message); // Exibe mensagem de erro
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

export default UpdateDelivery; // Exporta o componente UpdateDelivery
