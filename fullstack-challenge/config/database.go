package config // Declara o pacote como 'config'

import (
	"database/sql" // Importa o pacote para manipulação de banco de dados
	"fmt"          // Importa o pacote para formatação de strings e saída de texto
	"log"          // Importa o pacote para registro de logs

	_ "github.com/go-sql-driver/mysql" // Importa o driver MySQL para suporte ao banco de dados MySQL
)

// DB representa a conexão com o banco
var DB *sql.DB // Variável global para armazenar a conexão com o banco de dados

// a função ConnectDatabase inicia a conexão com o MySQL
func ConnectDatabase() {
	var err error // Declara uma variável para armazenar erros
	// dsn Define a string de conexão (Data Source Name) para o banco de dados
	dsn := "root:Ltpmsalem20.@tcp(127.0.0.1:3306)/deliveriesdb?parseTime=true"
	DB, err = sql.Open("mysql", dsn) // Abre uma conexão com o banco de dados MySQL

	if err != nil { // Verifica se ocorreu um erro ao abrir a conexão
		log.Fatal("Erro ao conectar no banco:", err) // Registra um erro fatal e encerra o programa
	}

	// Testa a conexão
	err = DB.Ping() // Tenta se conectar ao banco de dados
	if err != nil { // Verifica se ocorreu um erro ao testar a conexão
		log.Fatal("Banco de dados inacessível:", err) // Registra um erro fatal e encerra o programa
	}

	fmt.Println("Banco de dados conectado com sucesso!") // Exibe uma mensagem de sucesso na conexão

	// Migração manual da tabela
	migrateTable() // Chama a função para migrar (criar) a tabela se não existir
}

// Função para realizar a migração da tabela
func migrateTable() {
	// Define a consulta SQL para criar a tabela se não existir
	query := `
	CREATE TABLE IF NOT EXISTS deliveries (
		id INT AUTO_INCREMENT PRIMARY KEY, 
		cliente VARCHAR(100), 
		peso FLOAT, 
		logradouro VARCHAR(255),
		numero VARCHAR(10), 
		bairro VARCHAR(100), 
		complemento VARCHAR(100), 
		cidade VARCHAR(100), 
		estado VARCHAR(100), 
		pais VARCHAR(100),
		geolocalizacao_latitude VARCHAR(20),
		geolocalizacao_longitude VARCHAR(20)
	)`
	_, err := DB.Exec(query) // Executa a consulta para criar a tabela
	if err != nil {          // Verifica se ocorreu um erro ao executar a consulta
		log.Fatal("Erro ao criar a tabela:", err) // Registra um erro fatal e encerra o programa
	}
}

// Função para criar uma entrega no banco de dados
func CreateDelivery(nomeCliente string, peso float64, logradouro, numero, bairro, complemento, cidade, estado, pais, latitude, longitude string) error {
	// Executa a inserção de uma nova entrega na tabela 'deliveries'
	_, err := DB.Exec(`
		INSERT INTO deliveries (cliente, peso, logradouro, numero, bairro, complemento, cidade, estado, pais, geolocalizacao_latitude, geolocalizacao_longitude) 
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		nomeCliente, peso, logradouro, numero, bairro, complemento, cidade, estado, pais, latitude, longitude) // Passa os parâmetros da entrega
	return err // Retorna o erro, se houver
}

// Função para listar todas as entregas do banco de dados
func GetDeliveries() ([]map[string]interface{}, error) {
	// Executa a consulta para selecionar todas as entregas
	rows, err := DB.Query(`
		SELECT id, cliente, peso, logradouro, numero, bairro, complemento, cidade, estado, pais, geolocalizacao_latitude, geolocalizacao_longitude 
		FROM deliveries`)
	if err != nil { // Verifica se ocorreu um erro ao executar a consulta
		return nil, err // Retorna nil e o erro
	}
	defer rows.Close() // Fecha as linhas ao final da função

	var deliveries []map[string]interface{} // Inicializa um slice para armazenar as entregas
	for rows.Next() {                       // Itera sobre as linhas retornadas
		var id int
		var nomeCliente, logradouro, numero, bairro, complemento, cidade, estado, pais, latitude, longitude sql.NullString
		var peso sql.NullFloat64

		// Escaneia os valores da linha atual para as variáveis
		err := rows.Scan(
			&id,
			&nomeCliente,
			&peso,
			&logradouro,
			&numero,
			&bairro,
			&complemento,
			&cidade,
			&estado,
			&pais,
			&latitude,
			&longitude)
		if err != nil { // Verifica se ocorreu um erro ao escanear os valores
			return nil, err // Retorna nil e o erro
		}

		// Cria um mapa com os dados da entrega
		delivery := map[string]interface{}{
			"id":                       id,
			"cliente":                  nullStringOrEmpty(nomeCliente),
			"peso":                     nullFloatOrZero(peso),
			"logradouro":               nullStringOrEmpty(logradouro),
			"numero":                   nullStringOrEmpty(numero),
			"bairro":                   nullStringOrEmpty(bairro),
			"complemento":              nullStringOrEmpty(complemento),
			"cidade":                   nullStringOrEmpty(cidade),
			"estado":                   nullStringOrEmpty(estado),
			"pais":                     nullStringOrEmpty(pais),
			"geolocalizacao_latitude":  nullStringOrEmpty(latitude),
			"geolocalizacao_longitude": nullStringOrEmpty(longitude),
		}
		deliveries = append(deliveries, delivery) // Adiciona a entrega ao slice
	}

	return deliveries, nil // Retorna o slice de entregas e nil para erro
}

func nullStringOrEmpty(ns sql.NullString) string {
	if ns.Valid {
		return ns.String
	}
	return ""
}

func nullFloatOrZero(nf sql.NullFloat64) float64 {
	if nf.Valid {
		return nf.Float64
	}
	return 0.0
}

// Atualiza entrega
func UpdateDelivery(id int, nomeCliente string, peso float64, logradouro, numero, bairro, complemento, cidade, estado, pais, latitude, longitude string) error {
	// Executa a atualização de uma entrega com base no ID
	_, err := DB.Exec(`
		UPDATE deliveries 
		SET cliente = ?, peso = ?, logradouro = ?, numero = ?, bairro = ?, complemento = ?, cidade = ?, estado = ?, pais = ?, geolocalizacao_latitude = ?, geolocalizacao_longitude = ? 
		WHERE id = ?`,
		nomeCliente, peso, logradouro, numero, bairro, complemento, cidade, estado, pais, latitude, longitude, id) // Passa os parâmetros
	return err // Retorna o erro, se houver
}

// Deleta entrega
func DeleteDelivery(id int) error {
	// Executa a exclusão de uma entrega com base no ID
	_, err := DB.Exec("DELETE FROM deliveries WHERE id = ?", id)
	return err // Retorna o erro, se houver
}

// Puxa a entrega pelo ID
func GetDeliveryByID(id int) (map[string]interface{}, error) {
	// Executa a consulta para selecionar uma entrega pelo ID
	rows, err := DB.Query(`
		SELECT id, cliente, peso, logradouro, numero, bairro, complemento, cidade, estado, pais, geolocalizacao_latitude, geolocalizacao_longitude 
		FROM deliveries WHERE id = ?`, id)
	if err != nil { // Verifica se ocorreu um erro ao executar a consulta
		return nil, err // Retorna nil e o erro
	}
	defer rows.Close() // Fecha as linhas ao final da função

	var deliveries []map[string]interface{} // Inicializa um slice para armazenar as entregas
	for rows.Next() {                       // Itera sobre as linhas retornadas
		var id int
		var nomeCliente, logradouro, numero, bairro, complemento, cidade, estado, pais, latitude, longitude string
		var peso float64

		// Escaneia os valores da linha atual para as variáveis
		err := rows.Scan(&id, &nomeCliente, &peso, &logradouro, &numero, &bairro, &complemento, &cidade, &estado, &pais, &latitude, &longitude)
		if err != nil { // Verifica se ocorreu um erro ao escanear os valores
			return nil, err // Retorna nil e o erro
		}

		// Cria um mapa com os dados da entrega
		delivery := map[string]interface{}{
			"id":          id,
			"nomeCliente": nomeCliente,
			"peso":        peso,
			"logradouro":  logradouro,
			"numero":      numero,
			"bairro":      bairro,
			"complemento": complemento,
			"cidade":      cidade,
			"estado":      estado,
			"pais":        pais,
			"latitude":    latitude,
			"longitude":   longitude,
		}
		deliveries = append(deliveries, delivery) // Adiciona a entrega ao slice
	}

	return deliveries[0], nil // Retorna a primeira entrega e nil para erro
}
