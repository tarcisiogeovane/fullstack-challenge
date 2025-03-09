import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { FaSearch } from "react-icons/fa";

const EnderecoLookup = ({ formData, setFormData }) => {
  const [enderecoInput, setEnderecoInput] = useState("");

  const buscarEndereco = async () => {
    if (!enderecoInput) {
      alert("Digite um endereço antes de buscar.");
      return;
    }

    try {
      const MAPBOX_API_KEY = `pk.eyJ1IjoidGFyY2lzaW9nZW92YW5lIiwiYSI6ImNtODA5YzZvbzB0dngya29rdnlyaWdwMjUifQ.M1a5kZScUJ799bqmj52xzw`;
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(enderecoInput)}.json?country=br&access_token=${MAPBOX_API_KEY}&autocomplete=true&types=place,locality`
      );

      if (!response.ok) {
        throw new Error("Erro ao buscar endereço na API");
      }

      const data = await response.json();
      console.log(data);

      if (!data.features || data.features.length === 0) {
        alert("Nenhum resultado encontrado para este endereço.");
        return;
      }

      const primeiroResultado = data.features[0];
      const [longitude, latitude] = primeiroResultado.center;

      // Pegando as informações de localização
      const cidade = primeiroResultado.context?.find((c) =>
        c.id.includes("place")
      )?.text || primeiroResultado.text;

      const estado = primeiroResultado.context?.find((c) =>
        c.id.includes("region")
      )?.text || "";

      const pais = primeiroResultado.context?.find((c) =>
        c.id.includes("country")
      )?.text || "";

      // Atualiza o estado do formulário
      setFormData((prev) => ({
        ...prev,
        endereco: enderecoInput, // Mantém o endereço digitado
        latitude,
        longitude,
        cidade,
        estado,
        pais
      }));

    } catch (error) {
      console.error("Erro ao buscar endereço:", error);
      alert("Ocorreu um erro ao buscar o endereço. Tente novamente.");
    }
  };

  return (
    <div>
      <input
        type="text"
        value={enderecoInput}
        onChange={(e) => setEnderecoInput(e.target.value)}
        placeholder="Digite o endereço"
      />
      <Button variant="outline-primary" onClick={buscarEndereco}>
        <FaSearch /> Buscar
      </Button>
    </div>
  );
};

export default EnderecoLookup;

