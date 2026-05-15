import { AppLayout, Card } from '../components';
import { worldcupLogo } from '../assets';

export const About = () => {
  return (
    <AppLayout>
      <div className="md:min-h-screen flex items-center justify-center px-4 py-8">
        <div className="max-w-2xl w-full">
          <Card className="p-6">
            {/* Project Description */}
            <div className="mb-6">
              <div className="flex flex-row items-center justify-center gap-4 mb-8 mt-4">
                <img src={worldcupLogo} alt="World Cup 2026" className="h-16" />
                <h2 className="md:text-2xl text-lg font-semibold text-white">
                  BOLÃO COPA DO MUNDO 2026
                </h2>
              </div>
              <p className="text-white/80">
                Um jogo de palpites divertido e competitivo para a Copa do Mundo FIFA 2026. 
				Adivinhe os placares das partidas, desafie amigos e familiares e suba no ranking para se gabar!
              </p>
            </div>

            <hr className="border-white/10 mb-6" />

{/* Created by */}
<div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-center gap-2">
  <div className="flex items-center gap-3">
    {/* <img
        src={createdByPic}
        alt="Jonathan Hernández"
        className="w-6 h-6 rounded-full object-cover"
    />*/}
    <h2 className="md:text-lg text-lg font-semibold">
      Criado por Jonathan Hernández
      <br />
      Alterado por Fabricio Faria
    </h2>
  </div>
</div>

<hr className="border-white/10 mb-6" />

            {/* Contribute */}
            <div className="mb-6">
              <h2 className="md:text-xl text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span>🤝</span> Contribute
              </h2>
              <p className="text-white/80 mb-4">
                Este projeto é de código aberto! Contribuições, relatórios de bugs e
solicitações de recursos são bem-vindos. Construído com React, Firebase e
Tailwind CSS — sem necessidade de VAR aqui. 😉
              </p>
              <a
                href="https://github.com/ionmx/worldcup-2026-pool"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors"
              >
                ⭐ Star on GitHub
              </a>
            </div>

            <hr className="border-white/10 mb-6" />


          </Card>

          <p className="text-white/50 text-sm text-center my-8">
            
          </p>
        </div>
      </div>
    </AppLayout>
  );
};
