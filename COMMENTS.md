Algumas decisões de arquitetura e design, bem como bibliotecas de terceiros utilizadas:


Arquitetura e Decisões de Design

Estrutura de Componentes:	

O uso de componentes funcionais do React para criar a interface do usuário de forma modular e reutilizável.
A separação de lógica de apresentação (UI) e lógica de negócios (como chamadas de API) dentro do componente UpdateDelivery.


Gerenciamento de Estado:

Utilização do useState para gerenciar estados locais, como formData para armazenar os dados da entrega.
Uso do useEffect para buscar dados quando o componente é montado, garantindo que os dados sejam carregados assim que o ID da entrega é disponibilizado.


Manipulação de Formulários:

Implementação de uma função de manipulação (handleChange) para atualizar o estado com base nas entradas do usuário, evitando a duplicação de código.
Validação de dados do formulário com required nos campos de entrada.


Tratamento de Erros:

Implementação de try-catch para tratamento de erros durante as chamadas de API, proporcionando uma experiência do usuário mais robusta.

Navegação:

Uso do useNavigate do React Router para gerenciar a navegação após a atualização da entrega, permitindo a volta para a página inicial ou para a página anterior.


Bibliotecas de Terceiros Utilizadas

React:

Principal biblioteca para construção de interfaces de usuário.
Utilização de hooks (useState, useEffect) para gerenciar estados e efeitos colaterais.

React Router:

Utilizado para gerenciar a navegação entre diferentes páginas do aplicativo, permitindo a captura de parâmetros da URL com useParams.


React Bootstrap:

Usada para estilizar componentes com facilidade e responsividade, como Container, Card, Alert, e Button.


React Icons:

Para incorporar ícones na interface do usuário, proporcionando uma melhor experiência visual e intuitiva.


EndereçoLookup (componente personalizado):

Umcomponente criado para auxiliar na busca e seleção de endereços, integrando-se com a lógica do formulário.


Essas decisões e bibliotecas que usei contribuíram muito para a criação de uma aplicação web bem estruturada, responsiva e fácil de usar, facilitando a atualização de dados de entrega de forma eficiente.