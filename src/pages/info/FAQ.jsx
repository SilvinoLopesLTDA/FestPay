const Faq = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-[93%] p-8 bg-[#0f172a] m-5 rounded-xl">
        <div className="text-white">
          <h2 className="text-3xl font-semibold">Perguntas Frequentes (FAQ)</h2>
          <hr className="my-6" />
          <h3 className="text-xl font-semibold mt-7">
            1. &quot;Como funciona o sistema de criação de QR Codes para compras em
            eventos?&quot;
          </h3>
          <p className="my-4 indent-4">
            O sistema permite que um atendente crie QR Codes exclusivos para
            cada cliente, que serão utilizados para realizar compras dentro do
            evento. O atendente irá gerar o QR Code no sistema, associando-o ao
            cliente e às informações da compra.
          </p>
          <h3 className="text-xl font-semibold mt-10">
            2. &quot;Como um cliente pode utilizar o QR Code para fazer compras?&quot;
          </h3>
          <p className="my-4 indent-4">
            Ao receber o QR code do atendente, o cliente poderá escaneá-lo
            utilizando um aplicativo de leitura de códigos QR em seu dispositivo
            móvel. Isso abrirá uma página ou aplicativo específico do evento,
            onde o cliente poderá visualizar os produtos disponíveis e fazer
            suas compras.
          </p>
          <h3 className="text-xl font-semibold mt-10">
            3. &quot;É necessário ter internet para utilizar o QR Code durante o
            evento?&quot;
          </h3>
          <p className="my-4 indent-4">
            Sim, é necessário ter acesso à internet para escanear o QR Code e
            realizar as compras dentro do evento. É recomendado que o cliente
            esteja conectado a uma rede Wi-Fi ou possua um plano de dados móveis
            ativo.
          </p>
          <h3 className="text-xl font-semibold mt-10">
            4. &quot;Posso utilizar o mesmo QR Code para várias compras ou ele é
            válido apenas uma vez?&quot;
          </h3>
          <p className="my-4 indent-4">
            O QR Code é único e válido para múltiplas compras durante o evento.
            Após escaneá-lo, o cliente poderá realizar várias compras utilizando
            o mesmo código. O sistema irá registrar cada compra feita e
            atualizar as informações do saldo disponível para o cliente.
          </p>
          <h3 className="text-xl font-semibold mt-10">
            5. &quot;E se eu perder o meu QR Code?&quot;
          </h3>
          <p className="my-4 indent-4">
            Caso você perca o seu QR Code, é importante entrar em contato com a
            equipe de atendimento do evento o mais rápido possível. Eles poderão
            ajudá-lo a recuperar o seu QR Code ou fornecer uma solução
            alternativa para que você possa continuar realizando suas compras
            dentro do evento.
          </p>
          <h3 className="text-xl font-semibold mt-10">
            6. &quot;É possível visualizar o saldo disponível e o histórico de compras
            utilizando o QR Code?&quot;
          </h3>
          <p className="my-4 indent-4">
            Sim, o sistema permite que o cliente visualize o saldo disponível
            para compras e o histórico de compras realizadas utilizando o QR
            Code. Ao escanear o código, o cliente terá acesso a essas
            informações, o que facilita o controle e acompanhamento dos gastos
            durante o evento.
          </p>
          <h3 className="text-xl font-semibold mt-10">
            7. &quot;Existe um limite de tempo para utilizar o QR Code dentro do
            evento?&quot;
          </h3>
          <p className="my-4 indent-4">
            O limite de tempo para utilizar o QR Code pode variar de acordo com
            as regras estabelecidas pelo evento. É importante verificar as
            instruções e orientações fornecidas pela organização do evento para
            saber se há algum prazo específico para utilização do código.
          </p>
          <h3 className="text-xl font-semibold mt-10">
            8. &quot;É possível adicionar crédito ao QR Code durante o evento?&quot;
          </h3>
          <p className="my-4 indent-4">
            Em alguns casos, é possível adicionar crédito ao QR Code durante o
            evento. Isso pode ser feito diretamente com a equipe de atendimento
            ou em pontos específicos de recarga. Verifique com a organização do
            evento se essa opção está disponível.
          </p>
          <h3 className="text-xl font-semibold mt-10">
            9. &quot;O que acontece com o saldo não utilizado no QR Code após o
            evento?&quot;
          </h3>
          <p className="my-4 indent-4">
            O tratamento do saldo não utilizado pode variar de acordo com as{" "}
            <span className="underline">políticas do evento</span>. Algumas
            opções comuns/possibilidades incluem:
          </p>
          <ol className="list-disc pl-10">
            <li className="my-2">o reembolso do valor não utilizado;</li>
            <li className="my-2">
              a conversão do saldo em créditos para eventos futuros; ou
            </li>
            <li className="my-2">
              a doação do saldo para uma causa beneficente.
            </li>
          </ol>
          <p className="my-4 indent-4">
            Consulte a organização do evento para obter informações sobre o
            tratamento do saldo não utilizado.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Faq;
