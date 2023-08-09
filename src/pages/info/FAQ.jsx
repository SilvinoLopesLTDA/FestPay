import styles from './Info.module.scss';

const Faq = () => {
  return (
    <div className={styles.info_container}>
      <h3>Perguntas frequentes - FAQ</h3>
      <div className={styles.info_item}>
        <h4>1. Como funciona o sistema de criação de QR codes para compras em eventos?</h4>
        <p>
          O sistema permite que um atendente crie QR codes exclusivos para cada cliente, que serão utilizados para realizar compras dentro do evento. O atendente irá gerar o QR code no sistema, associando-o ao cliente e às informações da compra.
        </p>
      </div>
      <div className={styles.info_item}>
        <h4>2. Como um cliente pode utilizar o QR code para fazer compras?</h4>
        <p>
          Ao receber o QR code do atendente, o cliente poderá escaneá-lo utilizando um aplicativo de leitura de códigos QR em seu dispositivo móvel. Isso abrirá uma página ou aplicativo específico do evento, onde o cliente poderá visualizar os produtos disponíveis e fazer suas compras.
        </p>
      </div>
      <div className={styles.info_item}>
        <h4>3. É necessário ter internet para utilizar o QR code durante o evento?</h4>
        <p>
          Sim, é necessário ter acesso à internet para escanear o QR code e realizar as compras dentro do evento. É recomendado que o cliente esteja conectado a uma rede Wi-Fi ou possua um plano de dados móveis ativo.
        </p>
      </div>
      <div className={styles.info_item}>
        <h4>4. Posso utilizar o mesmo QR code para várias compras ou ele é válido apenas uma vez?</h4>
        <p>
          O QR code é único e válido para múltiplas compras durante o evento. Após escaneá-lo, o cliente poderá realizar várias compras utilizando o mesmo código. O sistema irá registrar cada compra feita e atualizar as informações do saldo disponível para o cliente.
        </p>
      </div>
      <div className={styles.info_item}>
        <h4>5. E se eu perder o meu QR code?</h4>
        <p>
          Caso você perca o seu QR code, é importante entrar em contato com a equipe de atendimento do evento o mais rápido possível. Eles poderão ajudá-lo a recuperar o seu QR code ou fornecer uma solução alternativa para que você possa continuar realizando suas compras dentro do evento.
        </p>
      </div>
      <div className={styles.info_item}>
        <h4>6. É possível visualizar o saldo disponível e o histórico de compras utilizando o QR code?</h4>
        <p>
          Sim, o sistema permite que o cliente visualize o saldo disponível para compras e o histórico de compras realizadas utilizando o QR code. Ao escanear o código, o cliente terá acesso a essas informações, o que facilita o controle e acompanhamento dos gastos durante o evento.
        </p>
      </div>
      <div className={styles.info_item}>
        <h4>7. Existe um limite de tempo para utilizar o QR code dentro do evento?</h4>
        <p>
          O limite de tempo para utilizar o QR code pode variar de acordo com as regras estabelecidas pelo evento. É importante verificar as instruções e orientações fornecidas pela organização do evento para saber se há algum prazo específico para utilização do código.
        </p>
      </div>
      <div className={styles.info_item}>
        <h4>8. É possível adicionar crédito ao QR code durante o evento?</h4>
        <p>
          Em alguns casos, é possível adicionar crédito ao QR code durante o evento. Isso pode ser feito diretamente com a equipe de atendimento ou em pontos específicos de recarga. Verifique com a organização do evento se essa opção está disponível.
        </p>
      </div>
      <div className={styles.info_item}>
        <h4>9. O que acontece com o saldo não utilizado no QR code após o evento?</h4>
        <p>
          O tratamento do saldo não utilizado pode variar de acordo com as políticas do evento. Algumas opções comuns incluem o reembolso do valor não utilizado, a conversão do saldo em créditos para eventos futuros ou a doação do saldo para uma causa beneficente. Consulte a organização do evento para obter informações sobre o tratamento do saldo não utilizado.
        </p>
      </div>
    </div>
  );
};

export default Faq;
