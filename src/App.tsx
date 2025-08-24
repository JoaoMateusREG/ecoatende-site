import './App.css'

export default function App() {
  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = document.getElementById('contactForm') as HTMLFormElement;
    const formData = new FormData(form);
    const nome = formData.get('nome') as string;
    const email = formData.get('email') as string;
    const mensagem = formData.get('mensagem') as string;
    
    if (!nome || !email || !mensagem) {
      alert('Por favor, preencha todos os campos antes de enviar por WhatsApp.');
      return;
    }
    
    const whatsappText = `Olá! Gostaria de saber mais sobre o EcoAtende.%0D%0A%0D%0ANome: ${nome}%0D%0AEmail: ${email}%0D%0A%0D%0AMensagem: ${mensagem}`;
    const whatsappLink = `https://wa.me/5581996878812?text=${whatsappText}`;
    window.open(whatsappLink, '_blank');
  };

  return (
    <div className="bg-black text-white w-full h-full">
      {/* Header Minimalista */}
      <header className='fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10'>
        <div className='flex items-center justify-between px-4 md:px-8 py-4 max-w-7xl mx-auto'>
          <img src={'/EcoAtende-branco.png'} alt="logo" className='w-24 md:w-32 h-6 md:h-8' />
          <nav className='hidden md:flex items-center gap-8'>
            <a href="#inicio" className='text-white/70 hover:text-white transition-colors'>Início</a>
            <a href="#precos" className='text-white/70 hover:text-white transition-colors'>Preços</a>
            <a href="#sobre" className='text-white/70 hover:text-white transition-colors'>Sobre</a>
            <a href="#contato" className='text-white/70 hover:text-white transition-colors'>Contato</a>
          </nav>
          <a href='#contato' className='px-4 md:px-6 py-2 bg-white text-black font-medium rounded-lg hover:bg-white/90 transition-all text-sm md:text-base'>
            Teste Gratuitamente
          </a>
        </div>
      </header>

      {/* Seção Início */}
      <section id="inicio" className='pt-24 md:pt-32 pb-12 md:pb-20 px-4 md:px-8'>
        <div className='max-w-4xl mx-auto text-center'>
          <div className='mb-8 md:mb-8'>
            <h1 className='text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 leading-tight'>
              O melhor sistema para
              <span className='block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent'>
                gerenciar filas
              </span>
            </h1>
            <p className='text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed px-4'>
              Transforme a experiência dos seus clientes com nossa solução inteligente de gestão de filas.
              Reduza tempo de espera e aumente a satisfação.
            </p>
          </div>
          
          <div className='flex flex-col sm:flex-row gap-4 justify-center items-center px-4'>
            <a href='#contato' className='w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-all text-sm md:text-base'>
              Teste Gratuitamente
            </a>
            <a href='#contato' className='w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 border border-white/20 text-white hover:bg-white/10 rounded-lg transition-all text-sm md:text-base'>
              Fale conosco
            </a>
          </div>
        </div>
      </section>

      {/* Seção de Vídeos */}
      <section className='py-12 md:py-20 px-4 md:px-8'>
        <div className='max-w-6xl mx-auto'>
          {/* Primeiro Vídeo */}
          <div className='mb-12 md:mb-20'>
            <video src={'/criar-ficha.mp4'} autoPlay muted loop className='w-full h-64 md:h-full object-contain rounded-xl md:rounded-2xl bg-white/5 border border-white/10' />
            <div className='mt-6 md:mt-8 text-center px-4'>
              <h3 className='text-xl md:text-2xl font-semibold mb-3 md:mb-4'>Visualize os serviços de atendimento da sua empresa</h3>
              <p className='text-white/70 text-sm md:text-base'>Crie fichas de atendimento com a devida prioridade</p>
            </div>
          </div>

          {/* Segundo Vídeo */}
          <div className='mb-12 md:mb-20'>
            <video src={'/gerenciar-ficha.mp4'} autoPlay muted loop className='w-full h-64 md:h-full object-contain rounded-xl md:rounded-2xl bg-white/5 border border-white/10' />
            <div className='mt-6 md:mt-8 text-center px-4'>
              <h3 className='text-xl md:text-2xl font-semibold mb-3 md:mb-4'>Controle total sobre o fluxo de atendimento</h3>
              <p className='text-white/70 text-sm md:text-base'>Possibilidade de encerrar a distribuição de fichas</p>
            </div>
          </div>

          {/* Terceiro Vídeo */}
          <div className='mb-12 md:mb-20'>
            <video src={'/relatorio.mp4'} autoPlay muted loop className='w-full h-64 md:h-full object-contain rounded-xl md:rounded-2xl bg-white/5 border border-white/10' />
            <div className='mt-6 md:mt-8 text-center px-4'>
              <h3 className='text-xl md:text-2xl font-semibold mb-3 md:mb-4'>Relatórios detalhados e insights valiosos</h3>
              <p className='text-white/70 text-sm md:text-base'>Tome decisões baseadas em dados reais</p>
            </div>
          </div>

          {/* Quarto Vídeo */}
          <div className='mb-12 md:mb-20'>
            <video src={'/painel.mp4'} autoPlay muted loop className='w-full h-64 md:h-full object-contain rounded-xl md:rounded-2xl bg-white/5 border border-white/10' />
            <div className='mt-6 md:mt-8 text-center px-4'>
              <h3 className='text-xl md:text-2xl font-semibold mb-3 md:mb-4'>Painel de chamado de fichas por voz</h3>
              <p className='text-white/70 text-sm md:text-base'>Entretenha seus clientes enquanto aguardam</p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Preços */}
      <section id="precos" className='min-h-screen py-12 md:py-20 px-4 md:px-8 flex items-start pt-20 bg-white/5'>
        <div className='max-w-6xl mx-auto w-full'>
          <div className='text-center mb-12 md:mb-16'>
            <h2 className='text-3xl md:text-5xl font-bold mb-4 md:mb-6'>Planos e Preços</h2>
            <p className='text-lg md:text-2xl text-white/70 px-4'>Escolha o plano ideal para sua empresa</p>
          </div>
          
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8'>
            {/* Plano Básico */}
            <div className='bg-white/10 rounded-xl md:rounded-2xl p-6 md:p-8 border border-white/20 hover:bg-white/15 transition-all flex flex-col'>
              <div className='flex-1'>
                <h3 className='text-xl md:text-2xl font-bold mb-3 md:mb-4'>Básico</h3>
                <span className='text-base md:text-lg text-white/70'>Valor fixo</span>
                <div className='text-3xl md:text-4xl font-bold mb-4 md:mb-6'>R$ 99<span className='text-base md:text-lg text-white/70'>/mês</span></div>
                <ul className='space-y-3 md:space-y-4 mb-6 md:mb-8'>
                  <li className='flex items-center'><span className='text-green-400 mr-2 md:mr-3 text-lg md:text-xl'>✓</span><span className='text-sm md:text-base'>Acesso a todos os serviços do sistema</span></li>
                  <li className='flex items-center'><span className='text-green-400 mr-2 md:mr-3 text-lg md:text-xl'>✓</span><span className='text-sm md:text-base'>Suporte por email e whatsapp</span></li>
                  <li className='flex items-center'><span className='text-green-400 mr-2 md:mr-3 text-lg md:text-xl'>✓</span><span className='text-sm md:text-base'>Treinamento online da equipe</span></li>
                  <li className='flex items-center'><span className='text-green-400 mr-2 md:mr-3 text-lg md:text-xl'>✓</span><span className='text-sm md:text-base'>Sem permanência mínima</span></li>
                  <li className='flex items-center gap-2'><span className='text-yellow-400 mr-2 md:mr-3 text-lg md:text-xl'>!</span><span className='text-sm md:text-base'>Equipamentos próprios</span></li>
                </ul>
              </div>
              <a href='#contato' className='w-full py-3 md:py-4 bg-white text-black font-semibold rounded-lg md:rounded-xl hover:bg-white/90 transition-all text-sm md:text-base mt-auto text-center'>Entrar em contato</a>
            </div>

            {/* Plano Customizado */}
            <div className='bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl md:rounded-2xl p-6 md:p-8 border border-blue-500/30 relative hover:from-blue-500/30 hover:to-purple-500/30 transition-all flex flex-col'>
              <div className='absolute -top-3 md:-top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-3 md:px-4 py-1 rounded-full text-xs md:text-sm font-medium'>
                Mais Popular
              </div>
              <div className='flex-1'>
                <h3 className='text-xl md:text-2xl font-bold mb-3 md:mb-4'>Customizado</h3>
                <span className='text-base md:text-lg text-white/70'>A partir de</span>
                <div className='text-3xl md:text-4xl font-bold mb-4 md:mb-6'>R$ 99<span className='text-base md:text-lg text-white/70'>/mês</span></div>
                <ul className='space-y-3 md:space-y-4 mb-6 md:mb-8'>
                  <li className='flex items-center'><span className='text-green-400 mr-2 md:mr-3 text-lg md:text-xl'>✓</span><span className='text-sm md:text-base'>Acesso a todos os serviços do sistema</span></li>
                  <li className='flex items-center'><span className='text-green-400 mr-2 md:mr-3 text-lg md:text-xl'>✓</span><span className='text-sm md:text-base'>Suporte prioritário por whatsapp</span></li>
                  <li className='flex items-center'><span className='text-green-400 mr-2 md:mr-3 text-lg md:text-xl'>✓</span><span className='text-sm md:text-base'>Treinamento online ou presencial da equipe</span></li>
                  <li className='flex items-center'><span className='text-green-400 mr-2 md:mr-3 text-lg md:text-xl'>✓</span><span className='text-sm md:text-base'>Sem permanência mínima</span></li>
                  <li className='flex items-center'><span className='text-green-400 mr-2 md:mr-3 text-lg md:text-xl'>✓</span><span className='text-sm md:text-base'>Escolha de equipamentos - Totem de autoatendimento, computador e impressora.</span></li>
                </ul>
              </div>
              <a href='#contato' className='w-full py-3 md:py-4 bg-blue-500 text-white font-semibold rounded-lg md:rounded-xl hover:bg-blue-600 transition-all text-sm md:text-base mt-auto text-center'>Entrar em contato</a>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Sobre */}
      <section id="sobre" className='min-h-screen py-12 md:py-20 px-4 md:px-8 flex items-center'>
        <div className='max-w-6xl mx-auto w-full'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center'>
            <div>
              <h2 className='text-3xl md:text-5xl font-bold mb-6 md:mb-8'>Sobre o EcoAtende</h2>
              <p className='text-base md:text-xl text-white/70 mb-6 md:mb-8 leading-relaxed'>
                O EcoAtende nasceu da necessidade de modernizar e simplificar o gerenciamento de filas de atendimento.
                Nossa missão é transformar a experiência tanto para as empresas quanto para seus clientes.
              </p>
              <p className='text-base md:text-xl text-white/70 mb-8 md:mb-12 leading-relaxed'>
                Nossa startup é uma solução que combina tecnologia avançada com simplicidade de uso, garantindo eficiência e satisfação.
              </p>
            </div>
            <div className='bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl md:rounded-2xl p-6 md:p-10 border border-white/10'>
              <h3 className='text-2xl md:text-3xl font-bold mb-6 md:mb-8'>Como implementar?</h3>
              <div className='space-y-4 md:space-y-6'>
                <div className='flex items-start'>
                  <div className='min-w-[32px] md:min-w-[48px] w-8 md:w-12 h-8 md:h-12 bg-blue-500 rounded-full flex items-center justify-center mr-4 md:mr-6 mt-1 text-white font-bold text-xs md:text-sm shrink-0'>✓</div>
                  <div>
                    <h4 className='text-lg md:text-xl font-semibold mb-1 md:mb-2'>Painel de chamado</h4>
                    <p className='text-white/70 text-sm md:text-lg'>Precisa-se de um computador com internet conectado a TV.</p>
                  </div>
                </div>
                <div className='flex items-start'>
                  <div className='min-w-[32px] md:min-w-[48px] w-8 md:w-12 h-8 md:h-12 bg-purple-500 rounded-full flex items-center justify-center mr-4 md:mr-6 mt-1 text-white font-bold text-xs md:text-sm shrink-0'>✓</div>
                  <div>
                    <h4 className='text-lg md:text-xl font-semibold mb-1 md:mb-2'>Fichas</h4>
                    <p className='text-white/70 text-sm md:text-lg'>Computador ou totem com impressora térmica para impressão das fichas.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção Contato */}
      <section id="contato" className='min-h-screen py-12 md:py-20 px-4 md:px-8 flex items-start pt-20 bg-white/5'>
        <div className='max-w-6xl mx-auto w-full'>
          <div className='text-center mb-12 md:mb-16'>
            <h2 className='text-3xl md:text-5xl font-bold mb-4 md:mb-6'>Entre em Contato</h2>
            <p className='text-lg md:text-2xl text-white/70 px-4'>Estamos aqui para ajudar sua empresa a crescer</p>
          </div>
          
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16'>
            <div>
              <h3 className='text-2xl md:text-3xl font-bold mb-6 md:mb-8'>Informações de Contato</h3>
              <div className='space-y-4 md:space-y-8'>
                <div className='flex items-center p-4 md:p-6 bg-white/5 rounded-lg md:rounded-xl border border-white/10'>
                  <div className='w-12 md:w-16 h-12 md:h-16 bg-blue-500/20 rounded-lg md:rounded-xl flex items-center justify-center mr-4 md:mr-6 text-lg md:text-2xl'>
                    📧
                  </div>
                  <div>
                    <div className='text-lg md:text-xl font-semibold mb-1'>Email</div>
                    <div className='text-white/70 text-sm md:text-lg'>contato@ecoatende.com</div>
                  </div>
                </div>
                <div className='flex items-center p-4 md:p-6 bg-white/5 rounded-lg md:rounded-xl border border-white/10'>
                  <div className='w-12 md:w-16 h-12 md:h-16 bg-green-500/20 rounded-lg md:rounded-xl flex items-center justify-center mr-4 md:mr-6 text-lg md:text-2xl'>
                    <img src={'/whatsapp.png'} alt="whatsapp" className='w-5 md:w-7 h-5 md:h-7' />
                  </div>
                  <div>
                    <div className='text-lg md:text-xl font-semibold mb-1'>WhatsApp</div>
                    <div className='text-white/70 text-sm md:text-lg'>(81) 99687-8812</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className='text-2xl md:text-3xl font-bold mb-6 md:mb-8'>Envie sua Mensagem</h3>
              <form id="contactForm" className='space-y-4 md:space-y-6'>
                <div>
                  <label className='block text-base md:text-lg font-medium mb-2 md:mb-3'>Nome</label>
                  <input 
                    type="text" 
                    name="nome"
                    required
                    className='w-full px-4 md:px-6 py-3 md:py-4 bg-white/10 border border-white/20 rounded-lg md:rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-500 text-sm md:text-lg' 
                    placeholder='Seu nome completo' 
                  />
                </div>
                <div>
                  <label className='block text-base md:text-lg font-medium mb-2 md:mb-3'>Email</label>
                  <input 
                    type="email" 
                    name="email"
                    required
                    className='w-full px-4 md:px-6 py-3 md:py-4 bg-white/10 border border-white/20 rounded-lg md:rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-500 text-sm md:text-lg' 
                    placeholder='seu@email.com' 
                  />
                </div>
                <div>
                  <label className='block text-base md:text-lg font-medium mb-2 md:mb-3'>Mensagem</label>
                  <textarea 
                    name="mensagem"
                    required
                    rows={2} 
                    className='w-full px-4 md:px-6 py-3 md:py-4 bg-white/10 border border-white/20 rounded-lg md:rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-blue-500 text-sm md:text-lg' 
                    placeholder='Como podemos ajudar sua empresa?'></textarea>
                </div>
                <button 
                  type="button" 
                  onClick={handleWhatsAppSubmit}
                  className='w-full py-3 md:py-4 bg-green-500 text-white font-semibold rounded-lg md:rounded-xl hover:bg-green-600 transition-all text-sm md:text-base cursor-pointer'
                >
                  Enviar por WhatsApp
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Elementos Decorativos */}
      <div className='fixed top-1/4 right-4 md:right-10 w-32 md:w-64 h-32 md:h-64 bg-blue-500/10 rounded-full blur-2xl md:blur-3xl'></div>
      <div className='fixed bottom-1/4 left-4 md:left-10 w-24 md:w-48 h-24 md:h-48 bg-purple-500/10 rounded-full blur-xl md:blur-2xl'></div>
    </div>
  )
}