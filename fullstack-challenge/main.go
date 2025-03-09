package main

import (
	"fmt"      // Importa o pacote fmt para formatação de strings e mensagens
	"log"      // Importa o pacote log para registro de logs e erros
	"net/http" // Importa o pacote http para manipulação de requisições HTTP

	"github.com/tarcisiogeovane/fullstack-challenge/config" // Importa o pacote de configuração da aplicação
	"github.com/tarcisiogeovane/fullstack-challenge/routes" // Importa o pacote de rotas da aplicação
)

// Middleware para permitir CORS
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("Middleware CORS chamado para:", r.Method, r.URL.Path)
		w.Header().Set("Access-Control-Allow-Origin", "*") // Permitir todas as origens
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		// Se for uma requisição OPTIONS, apenas retorna 200 OK
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func main() {
	// Conectar ao banco de dados
	config.ConnectDatabase() // Chama a função para conectar ao banco de dados

	// Configurar as rotas
	router := routes.SetupRoutes() // Configura as rotas da aplicação e armazena no roteador

	// Iniciar o servidor na porta 8080
	port := ":8080"                                              // Define a porta que o servidor irá escutar
	fmt.Println("Servidor iniciado na porta", port)              // Exibe mensagem de que o servidor foi iniciado
	log.Fatal(http.ListenAndServe(port, corsMiddleware(router))) // Inicia o servidor e registra qualquer erro fatal
}
