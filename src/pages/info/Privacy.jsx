const Privacy = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-[93%] p-8 bg-[#0f172a] m-5 rounded-xl">
        <div className="text-white">
          <h2 className="text-3xl font-semibold">Política de Privacidade</h2>
          <hr className="my-6" />
          <p className="my-4 indent-4">
            A sua privacidade é importante para nós. É política do FestPay
            respeitar a sua privacidade em relação a qualquer informação sua que
            possamos coletar no site{" "}
            <a
              href="https://festpay.vercel.app"
              className="text-blue-400 hover:underline"
            >
              FestPay
            </a>{" "}
            e outros sites que possuímos e operamos.
          </p>
          <p className="my-4 indent-4">
            Solicitamos informações pessoais apenas quando realmente precisamos
            delas para lhe fornecer um serviço. Fazemos isso por meios justos e
            legais, com o seu conhecimento e consentimento. Também informamos
            por que estamos coletando e como será usado.
          </p>
          <p className="my-4 indent-4">
            Apenas retemos as informações coletadas pelo tempo necessário para
            fornecer o serviço solicitado. Quando armazenamos dados, protegemos
            dentro de meios comercialmente aceitáveis para evitar perdas e
            roubos, bem como acesso, divulgação, cópia, uso ou modificação não
            autorizados.
          </p>
          <p className="my-4 indent-4">
            Não compartilhamos informações de identificação pessoal publicamente
            ou com terceiros, exceto quando exigido por lei. O nosso site pode
            ter links para sites externos que não são operados por nós. Esteja
            ciente de que não temos controle sobre o conteúdo e práticas desses
            sites e não podemos aceitar responsabilidade por suas respectivas
            políticas de privacidade.
          </p>
          <p className="my-4 indent-4">
            Você é livre para recusar a nossa solicitação de informações
            pessoais, entendendo que talvez não possamos fornecer alguns dos
            serviços desejados. O uso continuado de nosso site será considerado
            como aceitação de nossas práticas em torno de privacidade e
            informações pessoais. Se você tiver alguma dúvida sobre como lidamos
            com dados do usuário e informações pessoais, entre em contato
            conosco.
          </p>
          <h3 className="mt-6 text-xl font-bold">Compromisso do Usuário:</h3>
          <p className="my-4 indent-4">
            O usuário se compromete a fazer uso adequado dos conteúdos e da
            informação que o FestPay oferece no site e com caráter enunciativo,
            mas não limitativo:
          </p>
          <ul className="list-disc pl-10">
            <li className="my-2">
              A) Não se envolver em atividades que sejam ilegais ou contrárias à
              boa fé e à ordem pública.
            </li>
            <li className="my-2">
              B) Não difundir propaganda ou conteúdo de natureza racista,
              xenofóbica, jogos de sorte ou azar, qualquer tipo de pornografia
              ilegal, de apologia ao terrorismo ou contra os direitos humanos.
            </li>
            <li className="my-2">
              C) Não causar danos aos sistemas físicos (hardwares) e lógicos
              (softwares) do FestPay, de seus fornecedores ou terceiros, para
              introduzir ou disseminar vírus informáticos ou quaisquer outros
              sistemas de hardware ou software que sejam capazes de causar danos
              anteriormente mencionados.
            </li>
          </ul>
          <h3 className="mt-6 text-lg font-bold">Mais Informações:</h3>
          <p className="my-4 indent-4">
            Esperamos que esteja esclarecido e, como mencionado anteriormente,
            se houver algo que você não tem certeza se precisa ou não,
            geralmente é mais seguro deixar os cookies ativados, caso interaja
            com um dos recursos que você usa em nosso site.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
