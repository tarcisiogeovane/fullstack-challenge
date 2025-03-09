module github.com/tarcisiogeovane/fullstack-challenge // Define o módulo da aplicação

go 1.24.0 // Especifica a versão do Go utilizada para o módulo

// Dependências diretas da aplicação
require github.com/go-sql-driver/mysql v1.9.0 // Driver MySQL para Go

// Dependências indiretas da aplicação
require (
	github.com/gabriel-vasile/mimetype v1.4.8 // Biblioteca para detecção de tipos MIME
	github.com/go-playground/locales v0.14.1 // Biblioteca para suporte a localização
	github.com/go-playground/universal-translator v0.18.1 // Tradutor universal para validação
	github.com/go-playground/validator/v10 v10.25.0 // Validador para estruturas de dados
	github.com/gorilla/mux v1.8.1 // Roteador para gerenciamento de rotas
	github.com/leodido/go-urn v1.4.0 // Biblioteca para geração e manipulação de URNs
	golang.org/x/crypto v0.35.0 // Pacote de criptografia adicional
	golang.org/x/net v0.35.0 // Extensões de rede para o Go
	golang.org/x/sys v0.30.0 // Acesso a funções de sistema
	golang.org/x/text v0.22.0 // Manipulação de textos, suporte a diferentes codificações e idiomas
)

// Mais dependências indiretas
require (
	filippo.io/edwards25519 v1.1.0 // Implementação de curvas elípticas
	github.com/dgrijalva/jwt-go v3.2.0+incompatible // Biblioteca para manipulação de JSON Web Tokens (JWT)
)
